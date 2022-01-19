import { ButtonInteraction } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';
import getAudioPlayer from '../../utility/Radio/getAudioPlayer';
import { getSongQueue } from '../../utility/Radio/getSongQueue';

export default class RadioControlInteraction {
  static handle(interaction: ButtonInteraction): void {
    switch (interaction.customId) {
      case 'radioControl.action.player.pause': this.pausePlayer(interaction); break;
      case 'radioControl.action.player.skip': this.skipPlayer(interaction); break;

      default: break;
    }
  }

  static pausePlayer(interaction: ButtonInteraction): void {
    const player = getAudioPlayer(interaction.guildId);
    if (player == null) throw new Error('player is null');
    if (player.state.status === AudioPlayerStatus.Playing) {
      player.pause();
    } else if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
    }
    interaction.deferUpdate().catch(console.error);
  }

  static skipPlayer(interaction: ButtonInteraction): void {
    const queue = getSongQueue(interaction.guildId);
    queue?.skip();
    interaction.deferUpdate().catch(console.error);
  }
}
