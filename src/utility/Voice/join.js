"use strict";
exports.__esModule = true;
var voice_1 = require("@discordjs/voice");
function join(channel) {
    return (0, voice_1.joinVoiceChannel)({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });
}
exports["default"] = join;
