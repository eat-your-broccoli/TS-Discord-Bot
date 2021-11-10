"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
function getVoiceChannel(interaction) {
    var member = interaction.member;
    if (member instanceof discord_js_1.GuildMember && member.voice.channel) {
        return member.voice.channel;
    }
    return null;
}
exports["default"] = getVoiceChannel;
