import { GameErrorMessageResolver, GameErrorCode, GameError } from "./error";
import { CommandManager } from "./prompt";
import errors from "./assets/errors.json";

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
      return this.commandManager.executeCmd(prompt);
    } catch (e) {
      if (e instanceof GameError) {
        return this.errorResolver.getMsg(e.code);
      } else {
        return this.errorResolver.getMsg(GameErrorCode.UNEXPECTED_ERROR);
      }
    }
  }

  private addBaseCmds() {
    // Base commands
    this.commandManager.addCmd("help", this.help.bind(this));
    this.commandManager.addCmd("welcome", this.welcome.bind(this));
  }

  private listItems() {
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
    return `
      These are the commands that you can call:
      * (welcome):      Show the title screen of the game.
      * (help):         Show this help.
      * (levels):       List the levels you can play.
      * (play [level]): Starts a new level.
    `.trim();
  }

  private welcome() {
    return `
      Welcome to Escape!
    `.trim();
  }
}
