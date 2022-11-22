import { CommandManager } from "./prompt";
import { GameErrorMessageResolver, GameErrorCode, GameError } from "./error";
import { LevelManager } from "./level";
import { Player } from "./player";
import errors from "./assets/errors.json";

export class Game {
  private errorResolver;
  private commandManager;
  private levelManager;
  private player;

  constructor(playerName: string) {
    this.errorResolver = new GameErrorMessageResolver(errors);
    const commandNotFoundMessage = this.errorResolver.getMsg(
      GameErrorCode.COMMAND_NOT_FOUND
    );
    this.commandManager = new CommandManager(commandNotFoundMessage);
    this.player = new Player(playerName);
    this.levelManager = new LevelManager(this.commandManager, this.player);
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
    this.commandManager.addCmd({
      id: "help",
      prompt: "help",
      action: this.help.bind(this),
      help: "Show the list of available commands",
    });
    this.commandManager.addCmd({
      id: "welcome",
      prompt: "welcome",
      action: this.welcome.bind(this),
      help: "Show the welcome message",
    });
    this.commandManager.addCmd({
      id: "levels",
      prompt: "levels",
      action: this.levels.bind(this),
      help: "List the levels",
    });
    this.commandManager.addCmd({
      id: "play",
      prompt: "play #(\\d+)",
      action: this.play.bind(this),
      help: "Select a level to play",
    });
  }

  private inventory() {
    if (this.player.inventory.items.size === 0)
      throw GameError.fromCode(GameErrorCode.NO_ITEMS);
    let result = "";
    for (let {
      value: { name },
      qty,
    } of this.player.inventory.items.values()) {
      result += `* ${name} X ${qty}\n`;
    }
    return result;
  }

  private help() {
    const cmds = this.commandManager.listCmds();
    return cmds.map((it) => `* ${it.prompt}: ${it.help}`).join("\n");
  }

  private welcome() {
    return "Welcome to Welts!";
  }

  private levels() {
    const levels = this.levelManager.listLevels();
    let result = "\\n";
    for (let level of levels) {
      const { id, name } = level;
      result = `#${id} - ${name}`;
    }
    return result;
  }

  private play(args: string[]) {
    if (args.length !== 1)
      throw GameError.generic("play requires one argument: level");
    const [id] = args;
    return this.levelManager.loadLevel(id);
  }
}
