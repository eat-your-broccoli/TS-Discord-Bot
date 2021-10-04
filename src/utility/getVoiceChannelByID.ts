import { VoiceChannel } from 'discord.js';
import Globals from './Globals';

function getVoiceChannelByID(id: string): Promise<VoiceChannel> {
  return new Promise((resolve, reject) => {
    Globals.bot.client.channels.fetch(id).then((channel) => {
      if (channel instanceof VoiceChannel) {
        resolve(channel);
      } else {
        reject(new Error('Channel is no voice channel'));
      }
    }).catch((err) => reject(err));
  });
}

export default getVoiceChannelByID;
