import {
  CommandInteraction, MessageEmbed,
} from 'discord.js';
import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';

import { getSongQueue } from '../../utility/Radio/getSongQueue';

export default class QueueCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('queue', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio.queue');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}
    \n${this.prefix} [command]`;

    this.commandOptions = [
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const queue = getSongQueue(interaction.guildId);
    const message = new MessageEmbed();
    message.setTitle('Song Queue');
    if (!queue) {
      message.addField('Songs', 'there are no songs in the queue', false);
      await interaction.reply({ embeds: [message] });
      return;
    }
    message.addField('Currently playing', `${queue.currentSong?.title}`);
    message.addField('Songs in Queue', `There are ${queue.songs.length} songs in queue`);

    // take the next 5 or less songs
    // take only their name
    // and join them to a string, separated by a line break
    const upcomingSongs = queue.songs.splice(0, Math.min(5, queue.songs.length)).map((s) => s.title).join('\n');
    message.addField('Upcoming Songs', upcomingSongs || 'No upcoming songs');

    await interaction.reply({ embeds: [message] });
  }
}
