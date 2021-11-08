import type { CommandInteraction } from 'discord.js';
import Command from '../Command';
import getVersion from '../../utility/getVersion';
import getBotOwner from '../../utility/getBotOwner';
import getUptime from '../../utility/getUptime';
import Messages from '../../utility/Messages/Messages';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';

/**
 * StatusCommand
 *
 * prints status info
 */
export default class StatusCommand extends Command {
  private lang: ScopedLanguageHandler;

  constructor() {
    super('status', 'util');
    this.lang = new ScopedLanguageHandler('commands.util.status');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const version = await getVersion();
    const owner = await getBotOwner();
    const uptime = await getUptime();
    const text = `Status
    ${Messages.toInlineBlock(this.lang.get('entries.version'))}\t${version}
    ${Messages.toInlineBlock(this.lang.get('entries.owner'))}\t<@${owner}>
    ${Messages.toInlineBlock(this.lang.get('entries.uptime'))}\t${uptime}
    `;
    await interaction.reply(text);
  }
}
