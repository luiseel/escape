type Action = (args: string[]) => string;

interface Command {
  prompt: string;
  action: Action;
}

export class CommandManager {
  private commands: Command[];
  private errorMsg: string;

  constructor(errorMsg: string) {
    this.commands = [];
    this.errorMsg = errorMsg;
  }

  addCmd(prompt: string, action: Action) {
    const exists = this.commands.find((it) => it.prompt === prompt);
    if (exists) throw new Error("Prompt already exists");
    this.commands.push({ prompt, action });
  }

  executeCmd(prompt: string, errorMsg?: string) {
    const cmd = this.commands.find((it) => prompt.match(it.prompt));
    if (!cmd) return errorMsg ?? this.errorMsg;
    const args = prompt.match(cmd.prompt);
    return cmd.action(args as string[]);
  }
}
