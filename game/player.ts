import { GameError, GameErrorCode } from "./error";

export type ItemType = "consumable" | "tool";

abstract class Item {
  name: string;
  type: ItemType;

  constructor(name: string, type: ItemType) {
    this.name = name;
    this.type = type;
  }
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

export class Player {
  name: string;
  health = 3;
  status = "healthly" as PlayerStatus;
  inventory;

  constructor(name: string) {
    this.name = name;
    this.inventory = new Inventory();
  }
}
