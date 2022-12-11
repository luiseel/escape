import { Item } from "game";
import { GameError } from "./error";

class Inventory {
  items = [] as Item[];

  putItem(item: Item) {
    this.items.push(item);
  }

  useItem(name: string, target?: string) {
    const found = this.items.find((item) => item.name === name);
    if (!found) throw GameError.generic(`You don't have ${name}`);
    this.items.splice(this.items.indexOf(found), 1);
    return found.use(target);
  }

  hasItem(name: string) {
    return this.items.some((item) => item.name === name);
  }
}

export class Player {
  inventory;

  constructor() {
    this.inventory = new Inventory();
  }
}
