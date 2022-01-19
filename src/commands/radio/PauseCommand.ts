import { CommandInteraction, MessageEmbed } from 'discord.js';

import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import getAudioPlayer from '../../utility/Radio/getAudioPlayer';
import { getSongQueue } from '../../utility/Radio/getSongQueue';

/**
 * pauses or resumes player
 */
export default class PauseCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('pause', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio.pause');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;

    this.commandOptions = [
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const queue = getSongQueue(interaction.guildId);
    const player = getAudioPlayer(interaction.guildId);
    if (!queue || !queue.isPlaying || !player) {
      const message = new MessageEmbed();
      message.setTitle('Error');
      message.setDescription('There is currently no player running');
      message.setColor('YELLOW');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }

    if (player.state.status === 'playing') {
      player.pause();
      const message = new MessageEmbed();
      message.setTitle('Success');
      message.setDescription('Paused player');
      message.setColor('GREEN');
      await interaction.reply({ embeds: [message] });
    } else if (player.state.status === 'paused') {
      player.unpause();
      const message = new MessageEmbed();
      message.setTitle('Success');
      message.setDescription('Unpaused player');
      message.setColor('GREEN');
      await interaction.reply({ embeds: [message] });
    } else {
      player.pause();
      const message = new MessageEmbed();
      message.setTitle('Error');
      message.setDescription(`Player is in unhandled state: ${player.state.status}`);
      message.setColor('RED');
      await interaction.reply({ embeds: [message] });
      return;
    }

    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, Number(process.env.INTERACTION_REPLY_DELETE_TIME));
  }
}
