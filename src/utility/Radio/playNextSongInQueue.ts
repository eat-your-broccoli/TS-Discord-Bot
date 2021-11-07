import { AudioPlayer } from '@discordjs/voice';
import Queue from './Queue';
import { deleteQueue } from './getSongQueue';

export default async function playNextSongInQueue(player: AudioPlayer, queue: Queue):
Promise<void> {
  if (queue.songs.length > 0) {
    const song = queue.getNextSong();

    if (!song.resource) {
      await song.loadResource();
    }
    player.play(song.resource);
  } else {
    console.log('no more songs. stop player');
    queue.setPlaying(false);
    deleteQueue(queue.guildId);
    player.stop();
  }
}
