import { AudioResource, createAudioResource } from '@discordjs/voice';
import * as ytdl from 'ytdl-core';
import { relatedVideo } from 'ytdl-core';
import createYtSteam from './createYtSteam';

/**
 * a Song that can be played by a Player
 */
export default class Song {
  id: string;

  title: string;

  link: string;

  length: string;

  resource?: AudioResource;

  public async loadResource(): Promise<AudioResource> {
    if (!this.resource) {
      const stream = await createYtSteam(this.link);
      this.resource = createAudioResource(stream, { inlineVolume: true });
    }

    return this.resource;
  }

  public async getRecommendations(): Promise<relatedVideo[]> {
    const info = await ytdl.getInfo(this.link);
    return info.related_videos;
  }

  public static async fromYoutube(link: string): Promise<Song> {
    const songInfo = await ytdl.getBasicInfo(link);
    if (!songInfo) throw new Error(`invalid YouTube link: ${link}`);

    const song = new Song();
    song.title = songInfo.videoDetails.title;
    song.link = link;
    song.id = songInfo.videoDetails.videoId;

    return song;
  }

  public static idToYoutubeLink(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`;
  }
}
