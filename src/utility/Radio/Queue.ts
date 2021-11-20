import { TextChannel, VoiceChannel } from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';
import Song from './Song';
import RadioControls from './RadioControls';

export default class Queue {
  guildId: string;

  songs: Song[];

  text: TextChannel;

  voice: VoiceChannel;

  currentSong?: Song;

  isPlaying = false;

  connection?: VoiceConnection;

  radioControls: RadioControls;

  volume = -1;

  constructor(guildId: string, text: TextChannel, voice: VoiceChannel, songs?: Song[]) {
    this.guildId = guildId;
    this.text = text;
    this.voice = voice;
    this.songs = songs || [];
  }

  public getNextSong(): Song | null {
    const song = this.songs.shift();
    this.currentSong = song;
    this.preloadNextSong();
    return song;
  }

  public preloadNextSong(): void {
    if (this.songs.length > 0) {
      this.songs[0].loadResource()
        .then(() => {
          console.log(`preloaded resource: ${this.songs[0].title}`);
        })
        .catch((err) => {
          console.error(`error while preloading resource: ${err}`);
        });
    }
  }

  public setPlaying(v: boolean): void {
    this.isPlaying = v;
  }
}
