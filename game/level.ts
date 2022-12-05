import { CommandManager } from "./prompt";
import { GameError } from "./error";
import { Player } from "./player";
import levels from "./assets/levels";

export interface LevelData {
  id: number;
  name: string;
  initialScene: string;
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
  player;

  private scene?: string;

  constructor(commandManager: CommandManager) {
    this.commandManager = commandManager;
    this.player = new Player("luis");
  }

  loadLevel(id: string) {
    const level = levels[id];
    if (!level) throw GameError.generic("Level not found");
    this.commandManager.disableCmd("play");
    this.commandManager.disableCmd("levels");
    this.commandManager.disableCmd("welcome");

    this.scene = level.initialScene;

    this.commandManager.addCmd({
      name: "look",
      args: ["object"],
      action: (args: string[]) => {
        if (args.length !== 1)
          throw GameError.generic("look requires one argument: object");
        const [object] = args;
        const scene = level.data.rooms.find((it) => it.name === this.scene);
        if (!scene) throw new Error("Room not found");
        const int = scene.int.find((it) => it.name === object);
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
