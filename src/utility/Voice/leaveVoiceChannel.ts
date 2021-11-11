import type { Guild } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

export default function leaveVoiceChannel(guild: Guild): string {
  const vc = getVoiceConnection(guild.id);
  vc?.destroy();
  return vc?.joinConfig.channelId;
}
