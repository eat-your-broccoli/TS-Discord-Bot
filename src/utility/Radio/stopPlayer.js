"use strict";
exports.__esModule = true;
var getSongQueue_1 = require("./getSongQueue");
// eslint-disable-next-line import/no-cycle
var getAudioPlayer_1 = require("./getAudioPlayer");
function stopPlayer(guildId) {
    (0, getSongQueue_1.deleteQueue)(guildId);
    var player = (0, getAudioPlayer_1["default"])(guildId);
    if (player) {
        console.log('stopping player');
        player.stop(true);
        player.playable.forEach(function (c) {
            if (c.joinConfig.guildId === guildId)
                c.destroy();
        });
    }
}
exports["default"] = stopPlayer;
