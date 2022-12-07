import { GameObject } from "game";
import { GameError, GameErrorCode } from "./error";

interface InventoryItem {
  value: GameObject;
  qty: number;
}

class Inventory {
  items = new Map<string, InventoryItem>();

  addItem(item: GameObject, qty: number) {
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
  health = 3;
  status = "healthly" as PlayerStatus;
  inventory;

  constructor() {
    this.inventory = new Inventory();
  }
}
