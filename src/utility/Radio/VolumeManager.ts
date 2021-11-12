import * as sqlite from 'sqlite3';

const table = 'volume';

const db = new sqlite.Database('./data/volume/volume.db');
const defaultVolume = 35;

export default class VolumeManager {
  public static async init(): Promise<void> {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS ${table} (guildId TEXT UNIQUE, vol INTEGER)`);
    });
  }

  public static async get(guildId: string): Promise<number> {
    const val: any = await this.getFromTable(guildId);
    if (val == null && val !== 0) {
      await this.set(guildId, defaultVolume);
      return defaultVolume;
    }
    return (val.vol);
  }

  public static async set(guildId: string, volume: number): Promise<void> {
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
