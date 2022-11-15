import {
  GameErrorMessageResolver,
  GameErrorCode,
  GameError,
  GameErrorCodeMessages,
} from "./error";

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

interface BagItem {
  value: Item;
  qty: number;
}

export class Bag {
  items = new Map<string, BagItem>();

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
  private name: string;
  private health = 3;
  private status = "healthly" as PlayerStatus;
  private bag = new Bag();

  constructor(name: string) {
    this.name = name;
  }

  useItem(name: string, game: Game) {
    try {
      const { value: item } = this.bag.getItem(name);
      return item.use(game);
    } catch (e) {
      const { code } = e as GameError;
      return game.errorResolver.getMsg(code);
    }
  }
}

export class Game {
  errorResolver;

  constructor(errorCodeMessages: GameErrorCodeMessages) {
    this.errorResolver = new GameErrorMessageResolver(errorCodeMessages);
  }
}
