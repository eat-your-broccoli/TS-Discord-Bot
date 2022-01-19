import {
  CommandInteraction, GuildMember, MessageEmbed, TextChannel, VoiceChannel,
} from 'discord.js';
import { SlashCommandStringOption } from '@discordjs/builders';
import { entersState, VoiceConnectionStatus } from '@discordjs/voice';
import * as ytsr from 'ytsr';
import { Video } from 'ytsr';
import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import { getOrCreateAudioPlayer } from '../../utility/Radio/getAudioPlayer';
import join from '../../utility/Voice/join';
import Song from '../../utility/Radio/Song';
import { getOrCreateSongQueue } from '../../utility/Radio/getSongQueue';
import playNextSongInQueue from '../../utility/Radio/playNextSongInQueue';
import Messages from '../../utility/Messages/Messages';
import stopPlayer from '../../utility/Radio/stopPlayer';
import VolumeManager from '../../utility/Radio/VolumeManager';

/**
 * adds a song to the queue
 */
export default class RadioCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('play', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix}`;
    this.example = `${this.prefix}`;

    this.commandOptions = [
      new SlashCommandStringOption()
        .setRequired(false)
        .setName('link')
        .setDescription('Youtube link to the song you want to play'),
      new SlashCommandStringOption()
        .setRequired(false)
        .setName('search')
        .setDescription('Keywords of the song you want to play'),
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    let link = interaction.options.getString('link');
    const searchStr = interaction.options.getString('search');
    if (!link && !searchStr) throw new Error('pass either a link or a search string as argument');

    // if there is a search, look up and use first item's link
    if (searchStr) {
      const results = await ytsr(searchStr, { limit: 2 });
      if (results && results.items && results.items.length) {
        link = (results.items[0] as Video).url;
      } else {
        throw new Error(`No Video found with searchStr: ${searchStr}`);
      }
    }
    const song = await Song.fromYoutube(link);

    if (song == null) throw new Error('No song found');
    let channel: VoiceChannel;
    if (interaction.member instanceof GuildMember) {
      channel = interaction.member.voice.channel as VoiceChannel;
    }
    if (channel == null) throw new Error('you are not in a VoiceChannel');

    const queue = getOrCreateSongQueue(
      interaction.guildId, interaction.channel as TextChannel, channel,
    );

    if (queue.volume === -1) {
      queue.volume = await VolumeManager.get(interaction.guildId) * 100;
    }

    queue.songs.push(song);
    const message = new MessageEmbed();
    message.setTitle('Added Song');
    message.setDescription(`Added ${Messages.toInlineBlock(song.title)} to queue`);
    message.setColor('GREEN');
    await interaction.reply({ embeds: [message] });

    setTimeout(() => {
      interaction.deleteReply().catch(console.error);
    }, Number(process.env.INTERACTION_REPLY_DELETE_TIME));

    const player = getOrCreateAudioPlayer(interaction.guildId);

    if (!queue.isPlaying) {
      queue.isPlaying = true;
      const connection = join(queue.voice);
      queue.connection = connection;

      // https://discordjs.guide/voice/voice-connections.html#handling-disconnects
      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        console.log('connection entered state disconnected');
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
          // Seems to be reconnecting to a new channel - ignore disconnect
        } catch (error) {
          console.log('connection seems to be unrecoverable. destroying connection');
          // Seems to be a real disconnect which SHOULDN'T be recovered from
          stopPlayer(interaction.guildId);
          connection.destroy();
        }
      });
      connection.subscribe(player);
      await playNextSongInQueue(player, queue);
    }
  }
}
