"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var builders_1 = require("@discordjs/builders");
var voice_1 = require("@discordjs/voice");
var Command_1 = require("../Command");
var ScopedLanguageHandler_1 = require("../../utility/Lang/ScopedLanguageHandler");
var getAudioPlayer_1 = require("../../utility/Radio/getAudioPlayer");
var join_1 = require("../../utility/Voice/join");
var Song_1 = require("../../utility/Radio/Song");
var getSongQueue_1 = require("../../utility/Radio/getSongQueue");
var playNextSongInQueue_1 = require("../../utility/Radio/playNextSongInQueue");
/**
 * adds a song to the queue
 */
var RadioCommand = /** @class */ (function (_super) {
    __extends(RadioCommand, _super);
    function RadioCommand() {
        var _this = _super.call(this, 'play', 'radio') || this;
        _this.lang = null;
        _this.lang = new ScopedLanguageHandler_1["default"]('commands.radio');
        _this.description = _this.lang.get('description');
        _this.usage = "" + _this.prefix;
        _this.example = "" + _this.prefix;
        _this.commandOptions = [
            new builders_1.SlashCommandStringOption()
                .setRequired(true)
                .setName('link')
                .setDescription('Youtube link to the song you want to play'),
        ];
        return _this;
    }
    RadioCommand.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var link, channel, song, queue, player, connection_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        link = interaction.options.getString('link');
                        if (!link)
                            throw new Error('invalid link');
                        if (interaction.member instanceof discord_js_1.GuildMember) {
                            channel = interaction.member.voice.channel;
                        }
                        if (channel == null)
                            throw new Error('you are not in a VoiceChannel');
                        return [4 /*yield*/, Song_1["default"].fromYoutube(link)];
                    case 1:
                        song = _a.sent();
                        queue = (0, getSongQueue_1.getOrCreateSongQueue)(interaction.guildId, interaction.channel, channel);
                        queue.songs.push(song);
                        return [4 /*yield*/, interaction.reply("Added `" + song.title + "` to queue")];
                    case 2:
                        _a.sent();
                        player = (0, getAudioPlayer_1.getOrCreateAudioPlayer)(interaction.guildId);
                        if (!!queue.isPlaying) return [3 /*break*/, 4];
                        queue.isPlaying = true;
                        connection_1 = (0, join_1["default"])(queue.voice);
                        queue.connection = connection_1;
                        // https://discordjs.guide/voice/voice-connections.html#handling-disconnects
                        connection_1.on(voice_1.VoiceConnectionStatus.Disconnected, function () { return __awaiter(_this, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('connection entered state disconnected');
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, Promise.race([
                                                (0, voice_1.entersState)(connection_1, voice_1.VoiceConnectionStatus.Signalling, 5000),
                                                (0, voice_1.entersState)(connection_1, voice_1.VoiceConnectionStatus.Connecting, 5000),
                                            ])];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _a.sent();
                                        console.log('connection seems to be unrecoverable. destroying connection');
                                        // Seems to be a real disconnect which SHOULDN'T be recovered from
                                        connection_1.destroy();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        connection_1.subscribe(player);
                        return [4 /*yield*/, (0, playNextSongInQueue_1["default"])(player, queue)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RadioCommand;
}(Command_1["default"]));
exports["default"] = RadioCommand;
