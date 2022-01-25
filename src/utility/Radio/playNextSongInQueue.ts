import { AudioPlayer } from '@discordjs/voice';
// eslint-disable-next-line import/no-cycle
import Queue from './Queue';
// eslint-disable-next-line import/no-cycle
import { deleteQueue } from './getSongQueue';
// eslint-disable-next-line import/no-cycle
import VolumeManager from './VolumeManager';
// eslint-disable-next-line import/no-cycle
import RadioControls from './RadioControls';
import Song from './Song';

export default async function playNextSongInQueue(player: AudioPlayer, queue: Queue):
Promise<void> {
  queue.currentSong?.resource.volume.setVolume(0);
  if (queue.songs.length === 0 && queue.config.autoplay) {
    queue.radioControls?.setFooter('fetching song from recommendations ...');
    console.log(`queue is exhausted, fetch song from youtube recommendations for ${queue.currentSong?.title}`);
    const rec = await queue.currentSong?.getRecommendations();
    if (rec && rec.length > 0) {
      // find song that wasn't played before
      const lastPlayedSongs = queue.history.map((h) => h.id);
      const r = rec.find((recs) => !lastPlayedSongs.includes(recs.id));
      if (r) {
        const newSong = await Song.fromYoutube(Song.idToYoutubeLink(r.id));
        queue.addSong(newSong);
      }
    } else {
      queue.radioControls?.setFooter('fetching recommendations failed');
    }
  }

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
