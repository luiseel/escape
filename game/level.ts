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
            prompt: string;
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

    const commands = [];
    for (const rooms of level.data.rooms) {
      for (const int of rooms.int) {
        for (const cmd of int.cmds) {
          commands.push({
            id: `${rooms.name}${int.name}${cmd.prompt}`,
            prompt: `${cmd.prompt} ${int.name}`,
            action: () => cmd.response,
          });
        }
      }
    }

    for (const cmd of commands) {
      this.commandManager.addCmd(cmd);
    }

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
