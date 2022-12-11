import { CommandManager } from "./command";
import { GameErrorMessageResolver, GameErrorCode, GameError } from "./error";
import errors from "./assets/errors.json";
import { Player } from "./player";

export class Scene {
  description;
  norhtScene?: Scene;
  southScene?: Scene;
  eastScene?: Scene;
  westScene?: Scene;
  objects;
  dependencies;

  constructor(description: string, dependencies = [] as SceneDependency[]) {
    this.description = description;
    this.objects = [] as GameObject[];
    this.dependencies = dependencies;
  }
}

export interface SceneDependency {
  fn: () => boolean;
  failingReason: string;
}

export class GameObject {
  name;
  description;
  objects;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.objects = [] as GameObject[];
  }
}

export class OpenableObject extends GameObject {
  isOpen = false;

  constructor(name: string, description: string) {
    super(name, description);
  }
}

export class Item extends GameObject {
  use;

  constructor(name: string, description: string, fn: () => string) {
    super(name, description);
    this.use = fn;
  }
}

export class Level {
  private commandManager;
  private activeScene?: Scene;
  player;
  id;

  constructor(id: string, commandManager: CommandManager) {
    this.id = id;
    this.commandManager = commandManager;
    this.player = new Player();
  }

  // Starts a new level
  start() {
    // Disabling base commands
    this.commandManager.disableCmds(["help", "welcome", "play"]);

    // Set active scene
    this.activeScene = this.setupLevel();

    // Register commands
    this.commandManager.registerCmds([
      {
        name: "go",
        args: ["direction"],
        action: this.go.bind(this),
        help: "Go to a direction",
      },
      {
        name: "look",
        args: ["object"],
        action: this.look.bind(this),
        help: "Look at something",
      },
      {
        name: "take",
        args: ["object"],
        action: this.take.bind(this),
        help: "Take an object",
      },
      {
        name: "use",
        args: ["object"],
        action: this.use.bind(this),
        help: "Use an object from your inventory",
      },
    ]);

    return this.activeScene.description;
  }

  private setupLevel() {
    // Objects
    const desk = new GameObject("desk", "This is a desk");
    const chair = new GameObject("chair", "This is a chair");
    const door = new OpenableObject("door", "This is a door");
    const key = new Item("key", "This is a key", () => {
      door.isOpen = true;
      return "You used the key";
    });

    // Building the scenes
    const initial = new Scene(
      "You are in the studio room. You can see a desk and a chair. There is a door that leads to the north."
    );
    const norhtScene = new Scene(
      "You are in the living room. It seems there's nothing else",
      [
        {
          fn: () => door.isOpen,
          failingReason: "The door is locked.",
        },
      ]
    );
    initial.norhtScene = norhtScene;
    norhtScene.southScene = initial;

    // Settings objects onto the scenes
    initial.objects.push(desk);
    initial.objects.push(chair);
    initial.objects.push(door);

    desk.objects.push(key);

    return initial;
  }

  private go(args: string[]) {
    if (!this.activeScene) throw new Error("No active scene");

    if (args.length !== 1) throw GameError.generic("go require one argument");

    const [direction] = args;
    if (!["north", "south", "east", "west"].includes(direction))
      throw GameError.generic(
        "Invalid direction. Valids are: north, south, east, west"
      );

    let scene;
    if (direction === "north") {
      scene = this.activeScene.norhtScene;
    } else if (direction === "south") {
      scene = this.activeScene.southScene;
    } else if (direction === "east") {
      scene = this.activeScene.eastScene;
    } else if (direction === "west") {
      scene = this.activeScene.westScene;
    }

    if (!scene) throw GameError.generic("You can't go there");
    const failingDep = scene.dependencies.find((dep) => dep.fn() == false);
    if (failingDep)
      throw GameError.generic(
        `You can't go there: ${failingDep.failingReason}`
      );

    this.activeScene = scene;

    return "Ok.";
  }

  private look(args: string[]) {
    if (!this.activeScene) throw new Error("No active scene");

    if (args.length !== 1) throw GameError.generic("look require one argument");

    const [object] = args;

    if (object === "around") {
      return this.activeScene.description;
    } else {
      const found = this.findObject(object, this.activeScene.objects);
      if (found) return found.description;
    }

    return `There's no ${object} to look at`;
  }

  private take(args: string[]) {
    if (!this.activeScene) throw new Error("No active scene");
    if (args.length !== 1)
      throw GameError.generic("get require one argument: item");

    const [item] = args;
    const obj = this.findObject(item, this.activeScene.objects);
    if (!obj) throw GameError.generic(`There's no ${item} to get`);
    if (!(obj instanceof Item))
      throw GameError.generic(`You can't get ${item}`);
    this.player.inventory.putItem(obj);
    this.removeObject(item, this.activeScene.objects);
    return `You got ${item}`;
  }

  private use(args: string[]) {
    if (!this.activeScene) throw new Error("No active scene");
    if (args.length !== 1)
      throw GameError.generic("use require one argument: item");
    const [item] = args;
    return this.player.inventory.useItem(item);
  }

  private findObject(
    name: string,
    objects: GameObject[]
  ): GameObject | undefined {
    for (const obj of objects) {
      if (obj.name === name) return obj;
      if (obj.objects) {
        return this.findObject(name, obj.objects);
      }
    }
  }

  private removeObject(name: string, objects: GameObject[]) {
    for (const obj of objects) {
      if (obj.name === name) {
        objects.splice(objects.indexOf(obj), 1);
        return;
      }
      if (obj.objects) {
        this.removeObject(name, obj.objects);
      }
    }
  }
}

export class Game {
  private errorResolver;
  private commandManager;

  constructor() {
    this.errorResolver = new GameErrorMessageResolver(errors);
    const commandNotFoundMessage = this.errorResolver.getMsg(
      GameErrorCode.COMMAND_NOT_FOUND
    );
    this.commandManager = new CommandManager(commandNotFoundMessage);
    this.addBaseCmds();
  }

  runPrompt(prompt: string) {
    try {
      return this.commandManager.execCmd(prompt);
    } catch (e) {
      if (e instanceof GameError) {
        if (e.code === GameErrorCode.GENERIC) {
          return e.message;
        }
        return this.errorResolver.getMsg(e.code);
      } else {
        console.error(e);
        return this.errorResolver.getMsg(GameErrorCode.UNEXPECTED_ERROR);
      }
    }
  }

  private addBaseCmds() {
    // Base commands
    this.commandManager.registerCmds([
      {
        name: "help",
        action: this.help.bind(this),
        help: "Show the list of available commands",
      },
      {
        name: "welcome",
        action: this.welcome.bind(this),
        help: "Show the welcome message",
      },
      {
        name: "play",
        args: ["level"],
        action: this.play.bind(this),
        help: "Select a level to play",
      },
    ]);
  }

  private help() {
    const cmds = this.commandManager.listCmds();
    return cmds
      .map(({ name, args, help }) => {
        const theArgs = args ? ` ${args.map((it) => `[${it}]`).join(" ")}` : "";
        return `* ${name}${theArgs}: ${help}`;
      })
      .join("\n");
  }

  private welcome() {
    return "Welcome to Welts!";
  }

  private play(args: string[]) {
    if (args.length !== 1)
      throw GameError.generic("play requires one argument: level");
    const [id] = args;
    const level = new Level(id, this.commandManager);
    return level.start();
  }
}
