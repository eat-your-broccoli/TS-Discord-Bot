"use strict";
exports.__esModule = true;
var ytdlDiscord = require("discord-ytdl-core");
function createYtStream(link) {
    return ytdlDiscord(link, {
        filter: 'audioonly',
        opusEncoded: true,
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
        // eslint-disable-next-line no-bitwise
        highWaterMark: 1 << 26
    });
}
exports["default"] = createYtStream;
