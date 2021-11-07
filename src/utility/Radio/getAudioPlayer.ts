import { AudioPlayer, AudioPlayerError, AudioPlayerStatus } from '@discordjs/voice';
import { getSongQueue } from './getSongQueue';
import playNextSongInQueue from './playNextSongInQueue';

const players: Record<string, AudioPlayer> = {};

export default function getAudioPlayer(guildId: string): AudioPlayer {
  const existingPlayer = players[guildId];
  if (existingPlayer) return existingPlayer;

  const player = new AudioPlayer();

  players[guildId] = player;

  // on Idle wait one minute before leaving
  player.on(AudioPlayerStatus.Idle, () => {
    console.log('player is idle. Playing next resource');
    const queue = getSongQueue(guildId);
    if (queue) playNextSongInQueue(player, queue).catch((err) => console.error('Error: playing next song in idle failed: ', err));
  });

  // print message which song is now played
  player.on(AudioPlayerStatus.Playing, () => {
    console.log('Player is playing');
  });

  // on error play next song
  player.on('error', (error) => {
    if (error instanceof AudioPlayerError) console.error(`Player Error: ${error.message} with resource ${error.resource.metadata}`);
    console.error(`Player Error: ${error.message} with resource ${error}`);
    const queue = getSongQueue(guildId);
    if (queue) playNextSongInQueue(player, queue).catch((err) => console.error('Error: playing next song after error failed: ', err));
  });

  return player;
}
