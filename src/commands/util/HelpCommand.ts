import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandStringOption } from '@discordjs/builders';
import Command from '../Command';
import type DiscordBot from '../../DiscordBot';
import Messages from '../../utility/Messages/Messages';
import EmbedCategory from '../../utility/Messages/EmbedCategory';
import Shorthand from '../Shorthand';
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
    this.example = `${this.prefix} \n${this.prefix} [command]`;
    this.commandOptions = [
      new SlashCommandStringOption().setName('commandname').setDescription('name of the command you want to know more about')
        .setRequired(false),
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const commandName = interaction.options.getString('commandname');
    let reply: MessageEmbed;
    if (commandName) reply = this.commandHelp(commandName);
    else reply = this.generalHelp();
    reply.setColor('BLUE');
    await interaction.reply({ embeds: [reply], ephemeral: true });
  }

  /**
   * prints help for a single command
   * @param commandStr
   */
  commandHelp(commandStr: string): MessageEmbed {
    const command = <Command> this.commands[commandStr] || this.commands[`/${commandStr}`];
    if (command == null) {
      // error
      throw new Error(this.lang.get('error.unknownCommand', { commandName: commandStr }));
    } else {
      const message = new MessageEmbed();
      message.setTitle(`help: ${Messages.toInlineBlock(commandStr)}`);
      message.setColor('BLUE');
      command.getHelpEmbedCategory().forEach((c) => {
        message.addField(c.title, c.text, c.inline);
      });

      return message;
    }
  }

  /**
   * print all available commands to the chat, ordered by category
   */
  generalHelp(): MessageEmbed {
    const title = 'Commands';
    const commandsByCategory: Record<string, Command[]> = this.sortCommandsByCategory();
    const messageCategories: EmbedCategory[] = [];
    Object.keys(commandsByCategory)
      .forEach((key) => {
        const embedCat = new EmbedCategory(key, '', false);
        commandsByCategory[key].forEach((c) => {
          embedCat.text += Messages.toInlineBlock(`${c.prefix}`);
          embedCat.text += `\t${c.description}`;
          embedCat.text += '\n';
        });
        messageCategories.push(embedCat);
      });

    return Messages.createRichText({ title, categories: messageCategories });
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
