import type { Guild, GuildMember } from 'discord.js';

export default function leaveVoiceChannel(guild: Guild): Promise<GuildMember> {
  return guild.me.voice.disconnect();
}
