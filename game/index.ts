import { GameErrorMessageResolver, GameErrorCode, GameError } from "./error";
import { CommandManager } from "./prompt";
import errors from "./assets/errors.json";

export type ItemType = "consumable" | "tool";

export abstract class Item {
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

export class Inventory {
  items = new Map<string, InventoryItem>();

  addItem(item: Item, qty: number) {
    this.items.set(item.name, { value: item, qty });
  }

  getItem(name: string) {
    const result = this.items.get(name);
    if (!result) throw GameError.fromCode(GameErrorCode.ITEM_NOT_BAG);
    return result;
  }
}

type PlayerStatus = "healthly" | "poisoned";

export class Player {
  name: string;
  health = 3;
  status = "healthly" as PlayerStatus;
  inventory = new Inventory();

  constructor(name: string) {
    this.name = name;
  }
}

export class Game {
  errorResolver;
  commandManager;
  player;

  constructor() {
    this.errorResolver = new GameErrorMessageResolver(errors);
    const commandNotFoundMessage = this.errorResolver.getMsg(
      GameErrorCode.COMMAND_NOT_FOUND
    );
    this.commandManager = new CommandManager(commandNotFoundMessage);
    this.player = new Player("Luis");
    this.addInitialCmds();
  }

  private addInitialCmds() {
    this.commandManager.addCmd("list items", this.listItems.bind(this));
  }

  private listItems() {
    if (this.player.inventory.items.size === 0) return "You have not items";
    let result = "";
    for (let {
      value: { name },
      qty,
    } of this.player.inventory.items.values()) {
      result += `* ${name} X ${qty}\n`;
    }
    return result;
  }
}
