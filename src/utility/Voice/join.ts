import type { StageChannel, VoiceChannel } from 'discord.js';
import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice';

export default function join(channel: VoiceChannel | StageChannel): VoiceConnection {
  return joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });
}
