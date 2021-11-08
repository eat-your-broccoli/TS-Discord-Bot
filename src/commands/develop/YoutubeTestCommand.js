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
var voice_1 = require("@discordjs/voice");
var ytdl = require("discord-ytdl-core");
var Command_1 = require("../Command");
var ScopedLanguageHandler_1 = require("../../utility/Lang/ScopedLanguageHandler");
var join_1 = require("../../utility/Voice/join");
var TestCommand = /** @class */ (function (_super) {
    __extends(TestCommand, _super);
    function TestCommand() {
        var _this = _super.call(this, 'testyt', 'test') || this;
        _this.lang = null;
        _this.lang = new ScopedLanguageHandler_1["default"]('commands.radio');
        _this.description = _this.lang.get('description');
        _this.usage = _this.prefix + " [command]";
        _this.example = _this.prefix + "\n    \n" + _this.prefix + " [command]";
        _this.commandOptions = [];
        return _this;
    }
    TestCommand.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, member, stream, resource, connection, player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, interaction.reply('Now playing test yt song')];
                    case 1:
                        _a.sent();
                        member = interaction.member;
                        if (member instanceof discord_js_1.GuildMember && member.voice.channel) {
                            channel = member.voice.channel;
                        }
                        return [4 /*yield*/, ytdl('https://www.youtube.com/watch?v=QnL5P0tFkwM', {
                                filter: 'audioonly',
                                opusEncoded: true,
                                encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
                            })];
                    case 2:
                        stream = _a.sent();
                        resource = (0, voice_1.createAudioResource)(stream);
                        connection = (0, join_1["default"])(channel);
                        player = new voice_1.AudioPlayer();
                        player.on('error', function (err) { return console.error(err); });
                        player.on('stateChange', function (stateChange) { return console.log({ stateChange: stateChange }); });
                        player.play(resource);
                        connection.subscribe(player);
                        connection.on('error', function (err) { return console.error(err); });
                        console.log(connection);
                        return [2 /*return*/];
                }
            });
        });
    };
    return TestCommand;
}(Command_1["default"]));
exports["default"] = TestCommand;
