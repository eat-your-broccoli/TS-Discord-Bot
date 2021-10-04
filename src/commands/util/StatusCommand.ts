import type { Message } from 'discord.js';
// eslint-disable-next-line import/no-cycle
import Command from '../Command';
import getVersion from '../../utility/getVersion';
import getBotOwner from '../../utility/getBotOwner';
import getUptime from '../../utility/getUptime';
import MessageHandler from '../../utility/Messages/MessageHandler';
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

  async run(message: Message): Promise<void> {
    const version = await getVersion();
    const owner = await getBotOwner();
    const uptime = await getUptime();
    const text = `Status
    ${MessageHandler.toInlineBlock(this.lang.get('entries.version'))}\t${version}
    ${MessageHandler.toInlineBlock(this.lang.get('entries.owner'))}\t<@${owner}>
    ${MessageHandler.toInlineBlock(this.lang.get('entries.uptime'))}\t${uptime}
    `;
    await MessageHandler.sendSimpleText(message, text);
  }
}
