import {
  CommandInteraction, MessageEmbed,
} from 'discord.js';
import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import playNextSongInQueue from '../../utility/Radio/playNextSongInQueue';
import getAudioPlayer from '../../utility/Radio/getAudioPlayer';
import { getSongQueue } from '../../utility/Radio/getSongQueue';

/**
 * skips the currently played song
 */
export default class SkipCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('skip', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio.skip');
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
      message.setTitle('Currently there is no song played that can be skipped');
      message.setColor('YELLOW');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }

    const { currentSong } = queue;
    await playNextSongInQueue(player, queue);
    const message = new MessageEmbed();
    message.setTitle('Success');
    message.setDescription(`${currentSong.title} skipped`);
    message.setColor('GREEN');
    await interaction.reply({ embeds: [message], ephemeral: true });
  }
}
