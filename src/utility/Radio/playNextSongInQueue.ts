import { AudioPlayer } from '@discordjs/voice';
import Queue from './Queue';
// eslint-disable-next-line import/no-cycle
import stopPlayer from './stopPlayer';

export default async function playNextSongInQueue(player: AudioPlayer, queue: Queue):
Promise<void> {
  if (queue.songs.length > 0) {
    const song = queue.getNextSong();

    if (!song.resource) {
      await song.loadResource();
    }
    player.play(song.resource);
    song.resource.volume.setVolume(0.2);
  } else {
    console.log('no more songs. stop player');
    stopPlayer(queue.guildId);
  }
}
