import * as sqlite from 'sqlite3';
import { AudioPlayerPlayingState } from '@discordjs/voice';
import * as fs from 'fs';
// eslint-disable-next-line import/no-cycle
import getAudioPlayer from './getAudioPlayer';
import { getSongQueue } from './getSongQueue';

const table = 'volume';

const dir = './data/volume/';
let db: sqlite.Database;
const defaultVolume = 35;

export default class VolumeManager {
  public static async init(): Promise<void> {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    db = new sqlite.Database(`${dir}volume.db`);
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS ${table} (guildId TEXT UNIQUE, vol INTEGER)`);
    });
  }

  public static async set(guildId: string, volume: number): Promise<void> {
    const queue = getSongQueue(guildId);
    const oldVol = queue?.volume || defaultVolume;
    if (volume > 40 && volume > oldVol + 20) throw new Error('Volume cannot be changed by steps larger than 20');
    await this.setInDB(guildId, volume);
    if (queue) queue.volume = volume;
    const player = getAudioPlayer(guildId);
    if (!player) return;
    const newVol = this.volumeToDecimal(volume);
    (player.state as AudioPlayerPlayingState).resource.volume.setVolume(newVol);
  }

  public static async get(guildId: string): Promise<number> {
    const val: any = await this.getFromTable(guildId);
    if (val == null) {
      await this.setInDB(guildId, defaultVolume);
      return (this.volumeToDecimal(defaultVolume));
    }
    return (this.volumeToDecimal(val.vol));
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

  public static volumeToDecimal(vol: number) {
    return vol / 100;
  }
}
