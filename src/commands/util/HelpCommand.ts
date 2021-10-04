import type { Message } from 'discord.js';
import Command from '../Command';
import type DiscordBot from '../../DiscordBot';
import MessageHandler from '../../utility/Messages/MessageHandler';
import EmbedCategory from '../../utility/Messages/EmbedCategory';
import MessageParser from '../../utility/MessageParser/MessageParser';
import type Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';

export default class HelpCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('help', 'util');
    this.lang = new ScopedLanguageHandler('commands.util.help');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix} [command]`;
    this.example = `${this.prefix}
    \n${this.prefix} [command]`;
  }

  /**
   * prints help
   * @param message
   */
  async run(message: Message): Promise<void> {
    const parsedMessage = new MessageParser(message.content).parse();
    const command = parsedMessage.getArg('command', 1);
    if (command) {
      await this.commandHelp(message, command);
    } else {
      await this.generalHelp(message);
    }
  }

  /**
   * prints help for a single command
   * @param message
   * @param commandStr
   */
  async commandHelp(message: Message, commandStr: string): Promise<void> {
    const command = <Command> this.commands[commandStr] || this.commands[`/${commandStr}`];
    if (command == null) {
      // error
      await MessageHandler.replySimpleText(message,
        this.lang.get('error.unknownCommand', { commandName: commandStr }));
    } else {
      const title = command.commandName;
      const { description } = command;
      const categories = command.getHelpEmbedCategory();
      const richText = MessageHandler.createRichText({ title, description, categories });
      await MessageHandler.sendRichText(message, richText);
    }
  }

  /**
     * print all available commands to the chat, ordered by category
     * @param message
     */
  async generalHelp(message: Message): Promise<void> {
    const title = 'Commands';
    const commandsByCategory: Record<string, Command[]> = this.sortCommandsByCategory();
    const messageCategories: EmbedCategory[] = [];
    Object.keys(commandsByCategory).forEach((key) => {
      const embedCat = new EmbedCategory(key, '', true);
      commandsByCategory[key].forEach((c) => {
        embedCat.text += MessageHandler.toInlineBlock(`${c.prefix}`);
        embedCat.text += '\n';
      });
      messageCategories.push(embedCat);
    });

    const reply = MessageHandler.createRichText({ title, categories: messageCategories });
    await MessageHandler.sendRichText(message, reply);
  }

  /**
   * sorts commands by category
   */
  private sortCommandsByCategory(): Record<string, Command[]> {
    const commandsByCategory: Record<string, Command[]> = {};
    Object.values(this.commands).forEach((c: Command) => {
      const cat = c.category;
      if (commandsByCategory[cat] == null) commandsByCategory[cat] = [];
      commandsByCategory[cat].push(c);
    });
    return commandsByCategory;
  }

  /**
   * get commands and shorthands from the discord bot
   * @param context
   */
  configure({ context }: { context: DiscordBot }): void {
    if (context == null) {
      throw new Error(`Error while configuring ${this}. Needs context set`);
    }
    this.commands = context.commands || {};
    this.shorthands = context.shorthands || {};
  }
}
