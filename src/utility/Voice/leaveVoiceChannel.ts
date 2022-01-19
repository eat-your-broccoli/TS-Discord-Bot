import type { Guild } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import stopPlayer from '../Radio/stopPlayer';

export default function leaveVoiceChannel(guild: Guild): string {
  const vc = getVoiceConnection(guild.id);
  vc?.destroy();
  stopPlayer(guild.id);
  return vc?.joinConfig.channelId;
}
