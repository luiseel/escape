import { GameErrorMessageResolver, GameErrorCode, GameError } from "./error";
import { CommandManager } from "./prompt";
import errors from "./assets/errors.json";
import levels, { Level } from "./assets/levels";

export type ItemType = "consumable" | "tool";

abstract class Item {
  name: string;
  type: ItemType;

  constructor(name: string, type: ItemType) {
    this.name = name;
    this.type = type;
  }

  abstract use(game: Game): string;
}

interface InventoryItem {
  value: Item;
  qty: number;
}

class Inventory {
  items = new Map<string, InventoryItem>();

  addItem(item: Item, qty: number) {
    this.items.set(item.name, { value: item, qty });
  }

  getItem(name: string) {
    const result = this.items.get(name);
    if (!result) throw GameError.fromCode(GameErrorCode.NO_ITEM_IN_INVENTORY);
    return result;
  }
}

type PlayerStatus = "healthly" | "poisoned";

class Player {
  name: string;
  health = 3;
  status = "healthly" as PlayerStatus;
  inventory;

  constructor(name: string) {
    this.name = name;
    this.inventory = new Inventory();
  }
}

export class Game {
  private errorResolver;
  private commandManager;
  private player;

  constructor(playerName: string) {
    this.errorResolver = new GameErrorMessageResolver(errors);
    const commandNotFoundMessage = this.errorResolver.getMsg(
      GameErrorCode.COMMAND_NOT_FOUND
    );
    this.commandManager = new CommandManager(commandNotFoundMessage);
    this.player = new Player(playerName);
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
    const cmds = this.commandManager.listCmds(false);
    return cmds.map((it) => `* ${it.prompt}: ${it.help}`).join("\n");
  }

  private welcome() {
    return "Welcome to Welts!";
  }

  private levels() {
    let result = "\\n";
    for (let level in levels) {
      const { id, name } = levels[level];
      result = `#${id} - ${name}`;
    }
    return result;
  }

  private play(args: string[]) {
    if (args.length !== 1)
      throw GameError.generic("play requires one argument: level");
    const [id] = args;
    return "You want to play the game #" + id;
  }
}
