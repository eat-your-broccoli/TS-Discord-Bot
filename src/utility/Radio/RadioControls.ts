import {
  EmbedFieldData,
  Message, MessageActionRow, MessageButton, MessageEmbed,
} from 'discord.js';
import Messages from '../Messages/Messages';
import type Queue from './Queue';
import Song from './Song';

const lblPause = '||';
const lblPlay = '▶';

export default class RadioControls {
  parent: Message;

  message: MessageEmbed;

  rowPlayer: MessageActionRow;

  constructor(queue: Queue) {
    this.message = new MessageEmbed();
    this.setSong(queue.currentSong);
    this.createOrUpdateField({ name: 'Volume', value: `${queue.volume} / 100`, inline: true });
    this.updateNextSong(queue);
    this.message.setURL(queue.currentSong?.link);

    this.rowPlayer = new MessageActionRow();
    this.rowPlayer.addComponents(RadioControls.createRowPlayer(false));
  }

  public setSong(song?: Song): void {
    this.message.setTitle(`Playing: ${song?.title}`);
    this.message.setColor('BLUE');
    this.createOrUpdateField({ name: 'Length', value: song?.length || '-', inline: true });
    this.createOrUpdateField({ name: 'Link', value: song?.link || '-', inline: true });
  }

  public setVolume(volume: number): void {
    this.createOrUpdateField({ name: 'Volume', value: `${volume} / 100`, inline: true });
  }

  private createOrUpdateField(field: EmbedFieldData): void {
    const existing = this.message.fields.find((f) => f.name === field.name);
    if (existing) {
      existing.value = field.value;
      existing.inline = field.inline;
    } else {
      this.message.addFields(field);
    }
  }

  public setFooter(text: string): void {
    this.message.footer = { text: `ℹ: ${text}` };
  }

  public async updateMessage(): Promise<void> {
    this.parent = await this.parent.edit({ embeds: [this.message], components: [this.rowPlayer] });
  }

  public async deleteMessage(): Promise<void> {
    await this.parent.delete();
  }

  public pause(): void {
    this.rowPlayer.spliceComponents(0, this.rowPlayer.components.length);
    this.rowPlayer.addComponents(RadioControls.createRowPlayer(true));
  }

  public unpause(): void {
    this.rowPlayer.spliceComponents(0, this.rowPlayer.components.length);
    this.rowPlayer.addComponents(RadioControls.createRowPlayer(false));
  }

  public updateNextSong(queue: Queue): void {
    let nextSongs = '';
    for (let i = 0; i < Math.min(5, queue.songs.length); i += 1) {
      nextSongs += Messages.toInlineBlock(queue.songs[i].title);
      nextSongs += '\n';
    }
    if (nextSongs.length === 0) nextSongs = 'No songs in queue';
    else nextSongs = `(${queue.songs.length})\n${nextSongs}`;
    this.createOrUpdateField({ name: 'Next Songs', value: nextSongs, inline: false });
  }

  private static createRowPlayer(paused: boolean): MessageButton[] {
    return [
      new MessageButton()
        .setLabel(paused ? lblPlay : lblPause)
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.pause'),
      new MessageButton()
        .setLabel('▶▶')
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.skip'),
      new MessageButton()
        .setLabel('🔉')
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.volume.dec'),
      new MessageButton()
        .setLabel('🔊')
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.volume.inc'),
    ];
  }
}
