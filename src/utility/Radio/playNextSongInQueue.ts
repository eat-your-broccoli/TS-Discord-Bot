import { AudioPlayer } from '@discordjs/voice';
// eslint-disable-next-line import/no-cycle
import Queue from './Queue';
// eslint-disable-next-line import/no-cycle
import { deleteQueue } from './getSongQueue';
// eslint-disable-next-line import/no-cycle
import VolumeManager from './VolumeManager';
import RadioControls from './RadioControls';

export default async function playNextSongInQueue(player: AudioPlayer, queue: Queue):
Promise<void> {
  if (queue.songs.length > 0) {
    const song = queue.getNextSong();
    const volume = VolumeManager.volumeToDecimal(queue.volume);
    if (!song.resource) {
      await song.loadResource();
    }
    player.play(song.resource);
    song.resource.volume.setVolume(volume);

    if (queue.radioControls) {
      // delete last radio controls
      console.log('radio controls already exist');
      queue.radioControls.setSong(song);
      queue.radioControls.updateNextSong(queue);
      await queue.radioControls.updateMessage();
    } else {
      queue.radioControls = new RadioControls(queue);
      queue.radioControls.parent = await queue.text.send({
        embeds: [queue.radioControls.message],
        components: [queue.radioControls.rowPlayer],
      });
    }
  } else {
    console.log('no more songs. stop player');
    queue.setPlaying(false);
    deleteQueue(queue.guildId);
    player.stop();
  }
}
