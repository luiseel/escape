export enum GameErrorCode {
  GENERIC = "GENERIC",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  COMMAND_NOT_FOUND = "COMMAND_NOT_FOUND",
  NO_ITEM_IN_INVENTORY = "NO_ITEM_IN_INVENTORY",
  NO_ITEMS = "NO_ITEMS",
  NO_SCENE_IN_DIRECTION = "NO_SCENE_IN_DIRECTION",
}

export type GameErrorCodeMessages = { [key: string]: string };

export class GameErrorMessageResolver {
  private errorMsgs;

  constructor(errorMsgs: GameErrorCodeMessages) {
    this.errorMsgs = errorMsgs;
  }

  getMsg(code: GameErrorCode) {
    const result = this.errorMsgs[code];
    if (!result) throw new Error("code not found");
    return result;
  }
}

export class GameError extends Error {
  code: GameErrorCode;

  private constructor(code: GameErrorCode, message?: string) {
    super(message);
    this.code = code;
  }

  static fromCode(code: GameErrorCode) {
    return new GameError(code);
  }

  static generic(message: string) {
    return new GameError(GameErrorCode.GENERIC, message);
  }
}
