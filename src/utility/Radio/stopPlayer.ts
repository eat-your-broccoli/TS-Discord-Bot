import { deleteQueue } from './getSongQueue';
// eslint-disable-next-line import/no-cycle
import getAudioPlayer from './getAudioPlayer';

export default function stopPlayer(guildId: string): void {
  deleteQueue(guildId);
  const player = getAudioPlayer(guildId);
  if (player) {
    console.log('stopping player');
    player.stop(true);
    player.playable.forEach((c) => {
      if (c.joinConfig.guildId === guildId) c.destroy();
    });
  }
}
