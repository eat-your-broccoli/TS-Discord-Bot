"use strict";
exports.__esModule = true;
var Queue = /** @class */ (function () {
    function Queue(guildId, text, voice, songs) {
        this.isPlaying = false;
        this.guildId = guildId;
        this.text = text;
        this.voice = voice;
        this.songs = songs || [];
    }
    Queue.prototype.getNextSong = function () {
        var song = this.songs.shift();
        this.currentSong = song;
        this.preloadNextSong();
        return song;
    };
    Queue.prototype.preloadNextSong = function () {
        var _this = this;
        if (this.songs.length > 0) {
            this.songs[0].loadResource()
                .then(function () {
                console.log("preloaded resource: " + _this.songs[0].title);
            })["catch"](function (err) {
                console.error("error while preloading resource: " + err);
            });
        }
    };
    Queue.prototype.setPlaying = function (v) {
        this.isPlaying = v;
    };
    return Queue;
}());
exports["default"] = Queue;
