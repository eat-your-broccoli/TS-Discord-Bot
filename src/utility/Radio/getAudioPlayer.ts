import { AudioPlayer, AudioPlayerError, AudioPlayerStatus } from '@discordjs/voice';
import { getSongQueue } from './getSongQueue';
import playNextSongInQueue from './playNextSongInQueue';

const players: Record<string, AudioPlayer> = {};

function createAudioPlayer(guildId: string): AudioPlayer {
  const player = new AudioPlayer();

  players[guildId] = player;

  // on Idle wait one minute before leaving
  player.on(AudioPlayerStatus.Idle, () => {
    console.log('player finished playing and is in idle');
    const queue = getSongQueue(guildId);
    if (queue) {
      console.log(`members in the voice channel: ${queue.voice.members.size}`);
      if (queue.voice.members.size === 1) {
        console.log('there are no active connections in the voice channel.');
      } else playNextSongInQueue(player, queue).catch((err) => console.error('Error: playing next song in idle failed: ', err));
    } else {
      console.log('queue is empty. TODO close connection');
    }
  });

  // print message which song is now played
  player.on(AudioPlayerStatus.Playing, () => {
    const queue = getSongQueue(guildId);
    const title = queue?.currentSong?.title || 'unknown';
    console.log(`Player is now playing: ${title}`);
  });

  // on error play next song
  player.on('error', (error) => {
    if (error instanceof AudioPlayerError) console.error(`Player Error: ${error.message} with resource ${error.resource.metadata}`);
    else console.error(`Player Error: ${error}`);
    const queue = getSongQueue(guildId);
    if (queue) playNextSongInQueue(player, queue).catch((err) => console.error('Error: playing next song after error failed: ', err));
  });

  return player;
}

export default function getAudioPlayer(guildId: string): AudioPlayer | null {
  return players[guildId];
}

export function getOrCreateAudioPlayer(guildId: string): AudioPlayer {
  const existingPlayer = players[guildId];
  if (existingPlayer) return existingPlayer;

  return createAudioPlayer(guildId);
}
