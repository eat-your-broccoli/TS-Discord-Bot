import {
  CommandInteraction,
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
      const message = 'Currently there is no song played that can be skipped';
      await interaction.reply({ content: message, ephemeral: true });
      return;
    }

    const { currentSong } = queue;
    await playNextSongInQueue(player, queue);
    await interaction.reply({ content: `${currentSong.title} skipped`, ephemeral: true });
  }
}
