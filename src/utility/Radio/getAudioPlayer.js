"use strict";
exports.__esModule = true;
exports.getOrCreateAudioPlayer = void 0;
var voice_1 = require("@discordjs/voice");
var getSongQueue_1 = require("./getSongQueue");
var playNextSongInQueue_1 = require("./playNextSongInQueue");
// eslint-disable-next-line import/no-cycle
var stopPlayer_1 = require("./stopPlayer");
var players = {};
function createAudioPlayer(guildId) {
    var player = new voice_1.AudioPlayer();
    players[guildId] = player;
    // on Idle wait one minute before leaving
    player.on(voice_1.AudioPlayerStatus.Idle, function () {
        console.log('player finished playing and is in idle');
        var queue = (0, getSongQueue_1.getSongQueue)(guildId);
        if (queue) {
            console.log("members in the voice channel: " + queue.voice.members.size);
            if (queue.voice.members.size === 1) {
                console.log('there are no active connections (excluding me) in the voice channel.');
                (0, stopPlayer_1["default"])(guildId);
            }
            else
                (0, playNextSongInQueue_1["default"])(player, queue)["catch"](function (err) { return console.error('Error: playing next song in idle failed: ', err); });
        }
        else {
            console.log('queue is empty. TODO close connection');
            (0, stopPlayer_1["default"])(guildId);
        }
    });
    // print message which song is now played
    player.on(voice_1.AudioPlayerStatus.Playing, function () {
        var _a;
        var queue = (0, getSongQueue_1.getSongQueue)(guildId);
        var title = ((_a = queue === null || queue === void 0 ? void 0 : queue.currentSong) === null || _a === void 0 ? void 0 : _a.title) || 'unknown';
        console.log("Player is now playing: " + title);
    });
    // on error play next song
    player.on('error', function (error) {
        if (error instanceof voice_1.AudioPlayerError)
            console.error("Player Error: " + error.message + " with resource " + error.resource.metadata);
        else
            console.error("Player Error: " + error);
    });
    return player;
}
function getAudioPlayer(guildId) {
    return players[guildId];
}
exports["default"] = getAudioPlayer;
function getOrCreateAudioPlayer(guildId) {
    var existingPlayer = players[guildId];
    if (existingPlayer)
        return existingPlayer;
    return createAudioPlayer(guildId);
}
exports.getOrCreateAudioPlayer = getOrCreateAudioPlayer;
