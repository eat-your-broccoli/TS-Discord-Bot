import { Client, CommandInteraction } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from '@discordjs/builders';
import { SlashCommandOptionBase } from '@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase';
import CommandConfig from './CommandConfig';
import Executable from './Executable';
import EmbedCategory from '../utility/Messages/EmbedCategory';
import Messages from '../utility/Messages/Messages';

/**
 * represents a base command
 */
export default class Command implements Executable {
  // the commands prefix, e.g. `/help` for the help-command
  public readonly prefix: string;

  public readonly commandName: string;

  public readonly category: string;

  public readonly config: CommandConfig;

  public description: string;

  public usage: string;

  public example: string;

  public slashCommand: SlashCommandBuilder;

  public commandOptions : SlashCommandOptionBase[] = [];

  public client: Client;

  constructor(prefix: string, category = 'misc', config: CommandConfig = new CommandConfig()) {
    this.prefix = prefix;
    this.commandName = prefix;
    this.category = category || prefix;
    this.config = config;
  }

  /**
   * execute command
   * performs config check and handles error
   */
  async execute(interaction: CommandInteraction): Promise<void> {
    throw new Error(`stump: ${interaction}`);
  }

  /**
   * handles error on a basic level
   */
  handleError(interaction: CommandInteraction, error: Error): void {
    console.error(error);
    if (interaction.replied) {
      interaction.channel.send(error.message).catch();
      return;
    }
    interaction.reply(error.message).catch();
  }

  /**
   * checks config pre-execution
   */
  checkConfig(): void {
    if (this.config.ownerOnly) {
      throw new Error('you are not owner');
    }
  }

  /**
   * returns help text for this command
   */
  getHelpEmbedCategory(): EmbedCategory[] {
    const categories: EmbedCategory[] = [];
    categories.push(
      new EmbedCategory('Usage', Messages.toBlock(this.usage)),
    );

    categories.push(
      new EmbedCategory('Beispiele', Messages.toBlock(this.example)),
    );
    return categories;
  }

  createSlashCommand(): void {
    this.slashCommand = new SlashCommandBuilder()
      .setName(this.commandName)
      .setDescription(this.description);
    this.commandOptions.forEach((opt) => {
      if (opt instanceof SlashCommandStringOption) this.slashCommand.addStringOption(opt);
      else if (opt instanceof SlashCommandChannelOption) this.slashCommand.addChannelOption(opt);
      else if (opt instanceof SlashCommandUserOption) this.slashCommand.addUserOption(opt);
    });
  }

  async go(interaction: CommandInteraction): Promise<any> {
    await this.execute(interaction).catch((err) => this.handleError(interaction, err));
  }
}
