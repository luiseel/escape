import { Item } from "game";

interface InventoryItem {
  value: Item;
  qty: number;
}

class Inventory {
  items = new Map<string, InventoryItem>();

  putItem(item: Item, qty: number) {
    this.items.set(item.name, { value: item, qty });
  }

  useItem(name: string) {
    return `You used this item: ${name}`;
  }
}

export class Player {
  inventory;

  constructor() {
    this.inventory = new Inventory();
  }
}
