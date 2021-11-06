import { AudioPlayer } from '@discordjs/voice';

const players: Record<string, AudioPlayer> = {};

export default function getAudioPlayer(guildId: string): AudioPlayer {
  const existingPlayer = players[guildId];
  if (existingPlayer) return existingPlayer;

  players[guildId] = new AudioPlayer();
  return players[guildId];
}
