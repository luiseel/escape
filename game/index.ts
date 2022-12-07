import { CommandManager } from "./prompt";
import { GameErrorMessageResolver, GameErrorCode, GameError } from "./error";
import { Level } from "./level";
import errors from "./assets/errors.json";

export class Scene {
  description;
  norhtScene?: Scene;
  southScene?: Scene;
  eastScene?: Scene;
  westScene?: Scene;
  objects;

  constructor(description: string) {
    this.description = description;
    this.objects = [] as GameObject[];
  }
}

export type GameObjectType = "thing" | "item";

export class GameObject {
  name;
  description;
  objects;
  quantity;
  type: GameObjectType;

  constructor(
    name: string,
    description: string,
    type: GameObjectType = "thing",
    quantity = 1
  ) {
    this.name = name;
    this.description = description;
    this.objects = [] as GameObject[];
    this.type = type;
    this.quantity = quantity;
  }
}

export class Game {
  private errorResolver;
  private commandManager;
  private levelManager;

  constructor() {
    this.errorResolver = new GameErrorMessageResolver(errors);
    const commandNotFoundMessage = this.errorResolver.getMsg(
      GameErrorCode.COMMAND_NOT_FOUND
    );
    this.commandManager = new CommandManager(commandNotFoundMessage);
    this.levelManager = new Level(this.commandManager);
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
    this.commandManager.registerCmd({
      name: "help",
      action: this.help.bind(this),
      help: "Show the list of available commands",
    });
    this.commandManager.registerCmd({
      name: "welcome",
      action: this.welcome.bind(this),
      help: "Show the welcome message",
    });
    this.commandManager.registerCmd({
      name: "levels",
      action: this.levels.bind(this),
      help: "List the levels",
    });
    this.commandManager.registerCmd({
      name: "play",
      args: ["level"],
      action: this.play.bind(this),
      help: "Select a level to play",
    });
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

  private levels() {
    const levels = this.levelManager.listLevels();
    let result = "";
    for (let level of levels) {
      const { id, name } = level;
      result += `${id} - ${name}`;
    }
    return result;
  }

  private play(args: string[]) {
    if (args.length !== 1)
      throw GameError.generic("play requires one argument: level");
    const [id] = args;
    return this.levelManager.start(id);
  }
}
