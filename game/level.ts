import { CommandManager } from "./prompt";
import { GameError } from "./error";
import { Player } from "./player";
import levels from "./assets/levels";

export interface LevelData {
  id: number;
  name: string;
  initialRoom: string;
  intro: string;
  data: {
    rooms: [
      {
        name: string;
        int: {
          name: string;
          type: string;
          cmds: {
            name: string;
            response: string;
          }[];
        }[];
      }
    ];
  };
}

export class LevelManager {
  private commandManager;
  private player;

  private room?: string;

  constructor(commandManager: CommandManager, player: Player) {
    this.commandManager = commandManager;
    this.player = player;
  }

  loadLevel(id: string) {
    const level = levels[id];
    if (!level) throw GameError.generic("Level not found");
    this.commandManager.disableCmd("play");
    this.commandManager.disableCmd("levels");
    this.commandManager.disableCmd("welcome");

    this.room = level.initialRoom;

    this.commandManager.addCmd({
      name: "look",
      args: ["object"],
      action: (args: string[]) => {
        if (args.length !== 1)
          throw GameError.generic("look requires one argument: object");
        const [object] = args;
        const room = level.data.rooms.find((it) => it.name === this.room);
        if (!room) throw new Error("Room not found");
        const int = room.int.find((it) => it.name === object);
        if (!int) throw GameError.generic(`There is no ${object} to look at`);
        const cmd = int.cmds.find((it) => it.name === "look");
        if (!cmd)
          throw GameError.generic(
            "There is nothing interesing on the " + object
          );
        return cmd.response;
      },
      help: "Look at something",
    });

    return level.intro;
  }

  listLevels() {
    const result = [];
    for (let level in levels) {
      result.push(levels[level]);
    }
    return result;
  }
}
