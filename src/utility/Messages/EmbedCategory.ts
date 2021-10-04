/**
 * @class EmbedCategory
 * A category is comparable to a chapter.
 * Used in Discord's MessageEmbed
 */
export default class EmbedCategory {
  title: string;

  text: string;

  inline: boolean;

  constructor(title: string, text: string, inline = false) {
    this.title = title;
    this.text = text;
    this.inline = inline;
  }
}
