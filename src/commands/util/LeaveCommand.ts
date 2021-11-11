import {
  CommandInteraction, MessageEmbed,
} from 'discord.js';
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

  async execute(interaction: CommandInteraction): Promise<void> {
    const channelId = await leaveVoiceChannel(interaction.guild);
    const message = new MessageEmbed();
    if (channelId == null) {
      message.setTitle('I wasn\'t even in a channel, man :(');
      message.setColor('YELLOW');
    } else {
      message.setTitle('Left channel');
      message.setColor('GREEN');
    }
    await interaction.reply({ embeds: [message], ephemeral: true });
  }
}
