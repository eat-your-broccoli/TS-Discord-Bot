import { CommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import { AudioPlayer, createAudioResource } from '@discordjs/voice';
import * as ytdl from 'discord-ytdl-core';
import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import join from '../../utility/Voice/join';

export default class TestCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('testyt', 'test');
    this.lang = new ScopedLanguageHandler('commands.radio');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix} [command]`;
    this.example = `${this.prefix}
    \n${this.prefix} [command]`;

    this.commandOptions = [];
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Now playing test yt song');

    let channel: VoiceChannel;
    const { member } = interaction;
    if (member instanceof GuildMember && member.voice.channel) {
      channel = member.voice.channel as VoiceChannel;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const stream = await ytdl('https://www.youtube.com/watch?v=QnL5P0tFkwM', {
      filter: 'audioonly',
      opusEncoded: true,
      encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
    });

    const resource = createAudioResource(stream);

    const connection = join(channel);
    const player = new AudioPlayer();
    player.on('error', (err) => console.error(err));
    player.on('stateChange', (stateChange) => console.log({ stateChange }));

    player.play(resource);

    connection.subscribe(player);
    connection.on('error', (err) => console.error(err));
    console.log(connection);
  }
}
