import { Message } from 'discord.js';
import Command from '../Command';
import Globals from '../../utility/Globals';

export default class JoinCommand extends Command {
  constructor() {
    super('leave', 'util');
    this.description = 'Bot verlässt den aktuellen Voice-Channel';
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;
  }

  async run(message: Message): Promise<void> {
    // only leave if message originates from same server as bot is connected to
    // otherwise bot may leave from channel on server A if call is made in server B
    const guildID = message.guild.id;
    const voiceConnection = Globals.bot.client.voice.connections.get(guildID);
    if (voiceConnection) {
      voiceConnection.channel.leave();
    }
  }
}
