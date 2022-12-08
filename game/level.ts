import { CommandManager } from "./prompt";
import { GameError, GameErrorCode } from "./error";
import { Player } from "./player";
import levels from "./assets/levels";
import { GameObject, Scene } from "game";

export interface LevelSchema {
  id: number;
  name: string;
  initialScene: string;
  intro: string;
  data: {
    rooms: [
      {
        name: string;
        int: {
          name: string;
          type: string;
          cmds: {
            name: string;
            response: string;
          }[];
        }[];
      }
    ];
  };
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

    // Building the scenes
    const initial = new Scene("You are in a room");
    const norhtScene = new Scene("You are in the north room");
    initial.norhtScene = norhtScene;
    norhtScene.southScene = initial;

    // Settings objects onto the scenes
    const desk = new GameObject("desk", "This is a desk");
    const chair = new GameObject("chair", "This is a chair");
    const notebook = new GameObject("notebook", "This is a notebook", "item");
    initial.objects.push(desk);
    initial.objects.push(chair);

    desk.objects.push(notebook);

    // Set active scene
    this.activeScene = initial;

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
    ]);

    return initial.description;
  }

  private go(args: string[]) {
    if (!this.activeScene) throw new Error("No active scene");

    if (args.length !== 1) throw GameError.generic("go require one argument");

    const [direction] = args;
    if (direction === "north") {
      if (!this.activeScene.norhtScene)
        throw GameError.fromCode(GameErrorCode.NO_SCENE_IN_DIRECTION);
      this.activeScene = this.activeScene?.norhtScene;
    } else if (direction === "south") {
      if (!this.activeScene.southScene)
        throw GameError.fromCode(GameErrorCode.NO_SCENE_IN_DIRECTION);
      this.activeScene = this.activeScene?.southScene;
    } else if (direction === "east") {
      if (!this.activeScene.eastScene)
        throw GameError.fromCode(GameErrorCode.NO_SCENE_IN_DIRECTION);
      this.activeScene = this.activeScene?.eastScene;
    } else if (direction === "west") {
      if (!this.activeScene.westScene)
        throw GameError.fromCode(GameErrorCode.NO_SCENE_IN_DIRECTION);
      this.activeScene = this.activeScene?.westScene;
    } else {
      throw GameError.fromCode(GameErrorCode.COMMAND_NOT_FOUND);
    }

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
    if (obj.type !== "item") throw GameError.generic("You can't take that");
    if (obj.quantity <= 0)
      throw GameError.generic(`There's no ${item} to take`);
    this.player.inventory.addItem(obj, obj.quantity);
    obj.quantity = 0;
    return `You got ${obj.name}`;
  }

  private findObject(name: string, objects: GameObject[]): GameObject | null {
    for (const obj of objects) {
      if (obj.name === name) return obj;
      if (obj.objects) {
        const found = this.findObject(name, obj.objects);
        if (!found) continue;
        if (found.name === name) return found;
      }
    }
    return null;
  }

  // TODO remove this in favor of a proper LevelManager class
  listLevels() {
    const result = [];
    for (let level in levels) {
      result.push(levels[level]);
    }
    return result;
  }
}
