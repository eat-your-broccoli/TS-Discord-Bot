import type { Message } from 'discord.js';
// eslint-disable-next-line import/no-cycle
import Command from '../Command';
import getVersion from '../../utility/getVersion';
import getBotOwner from '../../utility/getBotOwner';
import getUptime from '../../utility/getUptime';
import MessageHandler from '../../utility/Messages/MessageHandler';

/**
 * StatusCommand
 *
 * prints status info
 */
export default class StatusCommand extends Command {
  constructor() {
    super('status', 'util');
    this.description = 'Erhalte Statusmeldung über den Bot';
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;
  }

  async run(message: Message): Promise<void> {
    const version = await getVersion();
    const owner = await getBotOwner();
    const uptime = await getUptime();
    const text = `Status
    ${MessageHandler.toInlineBlock('version')}\t${version}
    ${MessageHandler.toInlineBlock('owner')}\t<@${owner}>
    ${MessageHandler.toInlineBlock('uptime')}\t${uptime}
    `;
    await MessageHandler.sendSimpleText(message, text);
  }
}
