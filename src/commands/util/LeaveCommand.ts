import { Message } from 'discord.js';
import Command from '../Command';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import leaveVoiceChannel from '../../utility/Voice/leaveVoiceChannel';

export default class LeaveCommand extends Command {
  private lang: ScopedLanguageHandler;

  constructor() {
    super('leave', 'util');
    this.lang = new ScopedLanguageHandler('commands.util.leave');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;
  }

  async run(message: Message): Promise<void> {
    // only leave if message originates from same server as bot is connected to
    // otherwise bot may leave from channel on server A if call is made in server B
    const { guild } = message;
    await leaveVoiceChannel(guild);
  }
}
