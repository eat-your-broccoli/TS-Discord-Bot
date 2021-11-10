"use strict";
exports.__esModule = true;
exports.deleteQueue = exports.getOrCreateSongQueue = exports.getSongQueue = void 0;
var Queue_1 = require("./Queue");
var queues = {};
function getSongQueue(guildId) {
    return queues[guildId];
}
exports.getSongQueue = getSongQueue;
function getOrCreateSongQueue(guildId, text, voice) {
    var existingQueue = getSongQueue(guildId);
    if (existingQueue)
        return existingQueue;
    console.debug('creating queue for guild:', guildId);
    queues[guildId] = new Queue_1["default"](guildId, text, voice);
    return queues[guildId];
}
exports.getOrCreateSongQueue = getOrCreateSongQueue;
function deleteQueue(guildId) {
    console.debug('deleting queue for guild:', guildId);
    queues[guildId] = undefined;
}
exports.deleteQueue = deleteQueue;
