import { CommandInteraction } from 'discord.js';

import { AudioPlayerPlayingState } from '@discordjs/voice';
import { SlashCommandNumberOption } from '@discordjs/builders';
import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import getAudioPlayer from '../../utility/Radio/getAudioPlayer';
import getVoiceChannel from '../../utility/Voice/getVoiceChannel';

/**
 * pauses or resumes player
 */
export default class VolumeCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('volume', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio.volume');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;

    this.commandOptions = [
      new SlashCommandNumberOption()
        .setName('volume')
        .setDescription('the volume between 0 and 100')
        .setRequired(true),
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const player = getAudioPlayer(interaction.guildId);
    if (!player) {
      await interaction.reply({ content: 'No player active', ephemeral: true });
      return;
    }
    const channel = getVoiceChannel(interaction);
    const isInSameChannel = !!player.playable.find((c) => c.joinConfig.channelId === channel?.id);
    if (!channel || isInSameChannel === false) {
      await interaction.reply({ content: 'You have to be in the same channel as the player', ephemeral: true });
      return;
    }

    const vol = interaction.options.getNumber('volume');
    if (vol === undefined || vol < 0 || vol > 200) {
      await interaction.reply({ content: `Invalid vol: ${vol}`, ephemeral: true });
      return;
    }

    (player.state as AudioPlayerPlayingState).resource.volume.setVolumeLogarithmic(vol / 100);
    await interaction.reply({ content: `player volume set to: ${vol}`, ephemeral: true });
  }
}
