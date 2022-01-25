import { TextChannel, VoiceChannel } from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';
import Song from './Song';
// eslint-disable-next-line import/no-cycle
import RadioControls from './RadioControls';
// eslint-disable-next-line import/no-cycle
import playNextSongInQueue from './playNextSongInQueue';
// eslint-disable-next-line import/no-cycle
import getAudioPlayer from './getAudioPlayer';
import QueueConfig from './QueueConfig';

const historyMaxLength = 5;

export default class Queue {
  guildId: string;

  songs: Song[];

  history: Song[];

  text: TextChannel;

  voice: VoiceChannel;

  currentSong?: Song;

  isPlaying = false;

  connection?: VoiceConnection;

  radioControls: RadioControls;

  volume = -1;

  config: QueueConfig;

  constructor(guildId: string, text: TextChannel, voice: VoiceChannel, songs?: Song[]) {
    this.guildId = guildId;
    this.text = text;
    this.voice = voice;
    this.songs = songs || [];
    this.config = new QueueConfig();
    this.history = [];
  }

  public getNextSong(): Song | null {
    if (this.config.historyMode === true) {
      this.addToHistory(this.currentSong);
    }
    this.currentSong = this.songs.shift();
    this.preloadNextSong();
    return this.currentSong;
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

  public skip(): void {
    playNextSongInQueue(getAudioPlayer(this.guildId), this).catch(console.error);
    this.radioControls?.setFooter(`${this.currentSong?.title} skipped`);
    this.radioControls?.updateNextSong(this);
    this.radioControls?.updateMessage().catch(console.error);
  }

  public addSong(song: Song): void {
    console.log(`added ${song.title} to queue`);
    this.songs.push(song);
    this.radioControls?.setFooter(`${song?.title} added`);
    this.radioControls?.updateNextSong(this);
    this.radioControls?.updateMessage().catch(console.error);
  }

  public toggleAutoplay(): void {
    this.config.autoplay = !this.config.autoplay;
    console.log(`updating autoplay ${this.config.autoplay}`);
    this.radioControls.updateRowPlayer();
    this.radioControls.updateMessage().catch(console.error);
  }

  private addToHistory(song: Song): void {
    if (song == null) return;
    song.resource = null;
    this.history.push(song);
    while (this.history.length > historyMaxLength) {
      this.history.shift();
    }
  }
}
