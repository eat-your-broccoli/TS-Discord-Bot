import {
  CommandInteraction, GuildMember, MessageEmbed, VoiceChannel,
} from 'discord.js';
import { SlashCommandChannelOption } from '@discordjs/builders';
import Command from '../Command';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import join from '../../utility/Voice/join';

export default class JoinCommand extends Command {
  private lang: ScopedLanguageHandler;

  constructor() {
    super('join', 'util');
    this.lang = new ScopedLanguageHandler('commands.util.join');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix} // joins your voice channel\n${this.prefix} [<#VOICE_CHANNEL_ID>]\n${this.prefix} --channel <#VOICE_CHANNEL_ID>`;
    this.example = `${this.prefix}\n${this.prefix} <#12345>\n${this.prefix} --channel <#12345>`;

    this.commandOptions = [
      new SlashCommandChannelOption()
        .setName('channel')
        .setDescription('the channel to join')
        .setRequired(false),
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    let channel = interaction.options.getChannel('channel');
    if (channel == null) {
      const { member } = interaction;
      if (member instanceof GuildMember && member.voice.channel) {
        channel = member.voice.channel;
      }
    }
    if (channel == null) {
      const message = new MessageEmbed();
      message.setTitle('No channel found to join');
      message.setColor('YELLOW');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }
    if (!(channel instanceof VoiceChannel)) {
      const message = new MessageEmbed();
      message.setTitle('Channel is not a voice channel');
      message.setColor('RED');
      await interaction.reply({ embeds: [message], ephemeral: true });
      return;
    }
    join(channel);
    const message = new MessageEmbed();
    message.setTitle('Joined channel ✌');
    message.setColor('GREEN');
    await interaction.reply({ embeds: [message], ephemeral: true });
  }
}
