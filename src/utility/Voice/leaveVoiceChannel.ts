import type { Guild, GuildMember } from 'discord.js';

export default function leaveVoiceChannel(guild: Guild): Promise<GuildMember> {
  console.log('voice:', guild.me.voice);
  return guild.me.voice.disconnect();
}
