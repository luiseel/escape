type Action = (args: string[]) => string;

interface BaseCommand {
  id: string;
  prompt: string;
  action: Action;
  help?: string;
}

interface Command extends BaseCommand {
  enabled: boolean;
}

export class CommandManager {
  private commands: Command[];
  private errorMsg: string;

  constructor(errorMsg: string) {
    this.commands = [];
    this.errorMsg = errorMsg;
  }

  addCmd({ id, prompt, action, help }: BaseCommand) {
    const exists = this.commands.find((it) => it.prompt === prompt);
    if (exists) throw new Error("Prompt already exists");
    this.commands.push({ id, prompt, action, help, enabled: true });
  }

  execCmd(prompt: string, errorMsg?: string) {
    const cmd = this.commands.find(
      (it) => it.enabled && prompt.toLowerCase().trim().match(`^${it.prompt}$`)
    );
    if (!cmd) return errorMsg ?? this.errorMsg;
    const matches = prompt.match(cmd.prompt);
    const args = (matches ? matches.splice(1) : []) as string[];
    return cmd.action(args);
  }

  enableCmd(id: string) {
    const cmd = this.findCmd(id);
    cmd.enabled = true;
  }

  disableCmd(id: string) {
    const cmd = this.findCmd(id);
    cmd.enabled = false;
  }

  listCmds(enabled = true) {
    return this.commands.filter((it) => it.enabled === enabled);
  }

  private findCmd(id: string) {
    const cmd = this.commands.find((it) => it.id === id);
    if (!cmd) throw new Error(`Command with id ${id} was not found`);
    return cmd;
  }
}
