"use strict";
exports.__esModule = true;
function leaveVoiceChannel(guild) {
    console.log('voice:', guild.me.voice);
    return guild.me.voice.disconnect();
}
exports["default"] = leaveVoiceChannel;
