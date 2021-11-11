import { CommandInteraction, MessageEmbed } from 'discord.js';

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
      const message = new MessageEmbed();
      message.setTitle('No player active');
      message.setColor('YELLOW');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }
    const channel = getVoiceChannel(interaction);
    const isInSameChannel = !!player.playable.find((c) => c.joinConfig.channelId === channel?.id);
    if (!channel || isInSameChannel === false) {
      const message = new MessageEmbed();
      message.setTitle('Error');
      message.setDescription('You have to be in the same channel as the player');
      message.setColor('RED');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }

    const vol = interaction.options.getNumber('volume');
    if (vol === undefined || vol < 0 || vol > 100) {
      const message = new MessageEmbed();
      message.setTitle('Error');
      message.setDescription('Volume has to be between 0 and 100');
      message.setColor('RED');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }

    const newVol = vol / 1000;

    (player.state as AudioPlayerPlayingState).resource.volume.setVolumeDecibels(newVol);
    const message = new MessageEmbed();
    message.setTitle('Success');
    message.setDescription(`Volume set to ${newVol}`);
    message.setColor('RED');
    await interaction.reply({ embeds: [message], ephemeral: true });
  }
}
