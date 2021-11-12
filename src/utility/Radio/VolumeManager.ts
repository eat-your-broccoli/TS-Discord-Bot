import * as sqlite from 'sqlite3';
import { AudioPlayerPlayingState } from '@discordjs/voice';
// eslint-disable-next-line import/no-cycle
import getAudioPlayer from './getAudioPlayer';

const table = 'volume';

const db = new sqlite.Database('./data/volume/volume.db');
const defaultVolume = 35;

export default class VolumeManager {
  public static async init(): Promise<void> {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS ${table} (guildId TEXT UNIQUE, vol INTEGER)`);
    });
  }

  public static async set(guildId: string, volume: number): Promise<void> {
    await this.setInDB(guildId, volume);
    const player = getAudioPlayer(guildId);
    if (!player) return;
    const newVol = volume / 100;
    (player.state as AudioPlayerPlayingState).resource.volume.setVolume(newVol);
  }

  public static async get(guildId: string): Promise<number> {
    const val: any = await this.getFromTable(guildId);
    if (val == null && val !== 0) {
      await this.setInDB(guildId, defaultVolume);
      return defaultVolume;
    }
    return ((val.vol) / 100);
  }

  public static async setInDB(guildId: string, volume: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT OR REPLACE INTO ${table} (guildId, vol) VALUES(${String(guildId)}, ${Number(volume)});`;
      db.run(sql, [], (err: Error, row: any) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(row);
      });
    });
  }

  private static getFromTable(guildId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT vol FROM ${table} WHERE guildId = ${String(guildId)}`;
      db.get(sql, [], (err, row) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        resolve(row);
      });
    });
  }
}
