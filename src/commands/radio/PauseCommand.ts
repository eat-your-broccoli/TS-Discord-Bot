import { CommandInteraction } from 'discord.js';

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
      const message = 'Currently there is no song played that can be paused';
      await interaction.reply({ content: message, ephemeral: true });
      return;
    }

    if (player.state.status === 'playing') {
      player.pause();
      await interaction.reply({ content: 'Paused player' });
    } else if (player.state.status === 'paused') {
      player.unpause();
      await interaction.reply({ content: 'Unpaused player' });
    } else {
      await interaction.reply({ content: `Player is in unhandled state: ${player.state.status}` });
    }
  }
}
