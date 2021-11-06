import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import { SlashCommandStringOption } from '@discordjs/builders';
import * as ytdl from 'ytdl-core';
import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';
import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import getAudioPlayer from '../../utility/Radio/getAudioPlayer';
import join from '../../utility/Voice/join';
import createYtSteam from '../../utility/Radio/createYtSteam';

export default class RadioCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('play', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix} [command]`;
    this.example = `${this.prefix}
    \n${this.prefix} [command]`;

    this.commandOptions = [
      new SlashCommandStringOption()
        .setRequired(true)
        .setName('link')
        .setDescription('Youtube link to the song you want to play'),
    ];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const link = interaction.options.getString('link');
    if (!link) throw new Error('invalid link');

    let channel: VoiceChannel;
    if (interaction.member instanceof GuildMember) {
      channel = interaction.member.voice.channel as VoiceChannel;
    }
    if (channel == null) throw new Error('you are not in a VoiceChannel');

    const player = getAudioPlayer(interaction.guildId);

    const songInfo = await ytdl.getBasicInfo(link);
    if (!songInfo) throw new Error('no video found');
    await interaction.reply(`Now playing: ${songInfo}`);

    const stream = await createYtSteam(link);

    const resource = createAudioResource(stream);

    const connection = join(channel);
    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('leaving now');
      connection.disconnect();
    });

    player.on('error', (err) => {
      console.log(`leaving now due to error: ${err}`);
      connection.disconnect();
    });
  }
}
