// eslint-disable-next-line no-unused-vars
import {
  ColorResolvable,
  DiscordAPIError, Message, MessageAttachment, MessageEmbed, TextBasedChannels, TextChannel,
} from 'discord.js';

import EmbedCategory from './EmbedCategory';

export default class Messages {
  /**
     * send a string text in a channel
     * @param {Message} m
     * @param {String} outgoing
     * @param {Channel || null} channel
     */
  static sendSimpleText(
    m: Message, outgoing: string, channel?: TextChannel,
  ): Promise<Message> {
    if (channel) {
      return channel.send(outgoing);
    }
    return m.channel.send(outgoing);
  }

  /**
   * send a string text in a channel
   * @param {Message} m
   * @param text
   * @return {Promise<Message>}
   */
  static replySimpleText(m: Message, text: string): Promise<Message> {
    return m.reply(text);
  }

  /**
     * creates a rich text object
     * @param {string} title
     * @param {string} description
     * @param {[{title: string, text: string, inline: boolean}]}categories
     * @param color
     * @return {MessageEmbed}
     */
  static createRichText({
    title, description = '', categories = [], color,
  }: {
    title: string,
    description?: string,
    categories: EmbedCategory[],
    color?: ColorResolvable
  }): MessageEmbed {
    const richText = new MessageEmbed();
    if (title && typeof title === 'string') {
      richText.setTitle(title);
    }
    if (description && typeof description === 'string' && description.length) {
      richText.setDescription(description);
    }
    if (categories && Array.isArray(categories)) {
      categories.forEach((cat) => {
        if (cat && typeof cat === 'object') {
          richText.addField(cat.title || '', cat.text || '', cat.inline || false);
        }
      });
    }
    if (color) {
      richText.setColor(color);
    }
    richText.setTimestamp(new Date());
    return richText;
  }

  /**
   * creates an EmbedCategory used in discord for richText messages
   * @param title
   * @param text
   * @param inline
   */
  static createCategory(title: string, text: string, inline = false): EmbedCategory {
    return new EmbedCategory(title, text, inline);
  }

  /**
     * sends a rich Text
     * @param {Message}msg
     * @param {MessageEmbed} richText
     * @param {Channel || null} channel
     */
  static sendRichText(
    msg: Message, richText: MessageEmbed, channel?: TextChannel,
  ): Promise<Message> {
    if (channel) {
      return channel.send({ embeds: [richText] });
    }
    return msg.channel.send({ embeds: [richText] });
  }

  /**
     * replies to a message with a rich text
     * @param {Message}msg
     * @param {MessageEmbed} richText
     * @return {Promise<Message>}
     */
  static replyRichText(msg: Message, richText: MessageEmbed): Promise<Message> {
    return msg.reply({ embeds: [richText] });
  }

  /**
   * converts string to an discord code block
   * @param text
   */
  static toBlock(text: string): string {
    return `\`\`\`${text}\`\`\``;
  }

  /**
   * converts string to an inline block string
   * @param text
   */
  static toInlineBlock(text: string): string {
    return `\`${text}\``;
  }

  /**
   * converts array to a string
   * @param {String[]} array
   * @param {boolean = true} escape makes entries inline block elements
   * @return {string}
   */
  static arrayToString(array: string[], escape = true): string {
    let str = '';
    array.forEach((item) => {
      str += `${escape ? Messages.toInlineBlock(item) : item}\n`;
    });
    return str;
  }

  /**
   *
   * @param {Message }msg
   * @param {MessageEmbed} reply
   * @param {MessageAttachment} attachment
   * @param {TextChannel} channel
   */
  static async sendAttachment(
    msg: Message, reply: MessageEmbed, attachment: MessageAttachment, channel?: TextChannel,
  ): Promise<Message> {
    const sendingChannel: TextBasedChannels = channel || msg.channel;
    return sendingChannel.send({ embeds: [reply], files: [attachment] })
      .catch((e: DiscordAPIError) => {
        if (e && e.code === 40005) {
          throw new Error('Discord only supports up to 8MB files, maybe reduce quality');
        }
        throw e;
      });
  }

  /**
     * creates a discord js attachment
     * @param buffer
     * @param name
     * @return {MessageAttachment}
     */
  static createAttachment(buffer: Buffer, name: string): MessageAttachment {
    return new MessageAttachment(buffer, name);
  }
}
