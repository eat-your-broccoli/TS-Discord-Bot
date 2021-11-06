import * as ytdlDiscord from 'discord-ytdl-core';
import { opus as Opus } from 'prism-media/typings/opus';
import { FFmpeg } from 'prism-media';

export default function createYtStream(link: string) : Opus.Encoder | FFmpeg {
  return ytdlDiscord(link, {
    filter: 'audioonly',
    opusEncoded: true,
    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
  });
}
