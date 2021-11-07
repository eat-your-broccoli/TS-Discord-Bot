import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as ytdl from 'ytdl-core';
import createYtSteam from './createYtSteam';

/**
 * a Song that can be played by a Player
 */
export default class Song {
  title: string;

  link: string;

  resource?: AudioResource;

  public async loadResource(): Promise<AudioResource> {
    if (!this.resource) {
      const stream = await createYtSteam(this.link);
      this.resource = createAudioResource(stream);
    }

    return this.resource;
  }

  public static async fromYoutube(link: string): Promise<Song> {
    const songInfo = await ytdl.getBasicInfo(link);
    if (!songInfo) throw new Error(`invalid YouTube link: ${link}`);

    const song = new Song();
    song.title = songInfo.videoDetails.title;
    song.link = link;

    return song;
  }
}
