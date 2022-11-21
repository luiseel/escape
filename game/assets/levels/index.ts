export interface Level {
  id: number;
  name: string;
  initialRoom: string;
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
  }[];
}

export default {
  "1": require("./1.json"),
} as { [key: string]: Level };
