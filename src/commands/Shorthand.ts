import { CommandInteraction } from 'discord.js';
import type Command from './Command';
import type Executable from './Executable';

/**
 * models a shorthand for a command
 * a single character is replaced for he commands full name
 * ex:
 * ? is a shorthand for help-Command.
 * Message `? /somecommand` is handled the same as `/help /somecommand`
 */
export default class Shorthand implements Executable {
  public readonly prefix: string;

  public readonly command: Command;

  constructor(prefix: string, command: Command) {
    this.prefix = prefix;
    this.command = command;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    return this.command.go(interaction);
  }

  go: (interaction: CommandInteraction) => Promise<any>;
}
