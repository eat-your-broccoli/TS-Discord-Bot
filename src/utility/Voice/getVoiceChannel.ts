import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js';

export default function getVoiceChannel(interaction: CommandInteraction): VoiceChannel {
  const { member } = interaction;
  if (member instanceof GuildMember && member.voice.channel) {
    return member.voice.channel as VoiceChannel;
  }
  return null;
}
