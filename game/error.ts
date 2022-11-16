export enum GameErrorCode {
  COMMAND_NOT_FOUND = "COMMAND_NOT_FOUND",
  ITEM_NOT_BAG = "ITEM_NOT_BAG",
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

  private constructor(code: GameErrorCode) {
    super();
    this.code = code;
  }

  static fromCode(code: GameErrorCode) {
    return new GameError(code);
  }
}
