import {
  CommandInteraction,
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
    await leaveVoiceChannel(interaction.guild);
    await interaction.reply('Okay :( If you don\'t want me...');
  }
}
