import { Item } from "game";
import { GameError } from "./error";

class Inventory {
  items = [] as Item[];

  putItem(item: Item) {
    this.items.push(item);
  }

  useItem(name: string) {
    const found = this.items.find((item) => item.name === name);
    if (!found) throw GameError.generic(`You don't have ${name}`);
    return found.use();
  }
}

export class Player {
  inventory;

  constructor() {
    this.inventory = new Inventory();
  }
}
