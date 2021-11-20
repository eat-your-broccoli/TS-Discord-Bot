import {
  EmbedFieldData,
  Message, MessageActionRow, MessageButton, MessageEmbed,
} from 'discord.js';
import type Queue from './Queue';
import Song from './Song';

export default class RadioControls {
  parent: Message;

  message: MessageEmbed;

  rowPlayer: MessageActionRow;

  constructor(queue: Queue) {
    this.message = new MessageEmbed();
    this.setSong(queue.currentSong);
    this.createOrUpdateField({ name: 'Volume', value: `${queue.volume} / 100`, inline: true });
    this.createOrUpdateField({ name: 'Next Songs', value: `There are ${queue.songs.length} in queue`, inline: false });
    this.message.setURL(queue.currentSong?.link);

    this.rowPlayer = new MessageActionRow();
    this.rowPlayer.addComponents([
      new MessageButton()
        .setLabel('||')
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.pause'),
      new MessageButton()
        .setLabel('▶')
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.unpause'),
      new MessageButton()
        .setLabel('▶▶')
        .setStyle('SECONDARY')
        .setCustomId('radioControl.action.player.skip'),
    ]);
  }

  public setSong(song?: Song): void {
    this.message.setTitle(`Playing: ${song?.title}`);
    this.message.setColor('BLUE');
    this.createOrUpdateField({ name: 'Length', value: song?.length || '-', inline: true });
    this.createOrUpdateField({ name: 'Link', value: song?.link || '-', inline: true });
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
    this.message.footer = { text };
  }

  public async updateMessage(): Promise<void> {
    this.parent = await this.parent.edit({ embeds: [this.message], components: [this.rowPlayer] });
  }
}
