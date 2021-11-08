import {
  CommandInteraction, GuildMember, VoiceChannel,
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
      await interaction.reply('no channel found to join');
      return;
    }
    if (!(channel instanceof VoiceChannel)) {
      await interaction.reply('channel is no VoiceChannel');
      return;
    }
    join(channel);
    await interaction.reply('Success ✌');
  }
}
