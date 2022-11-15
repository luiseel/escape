export enum GameErrorCode {
  ITEM_NOT_BAG = 0x01,
}

export type GameErrorCodeMessages = Map<GameErrorCode, string>;

export class GameErrorMessageResolver {
  private errorMsgs = new Map<GameErrorCode, string>();

  constructor(errorMsgs: GameErrorCodeMessages) {
    this.errorMsgs = errorMsgs;
  }

  getMsg(code: GameErrorCode) {
    const result = this.errorMsgs.get(code);
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
