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
var builders_1 = require("@discordjs/builders");
var Command_1 = require("../Command");
var ScopedLanguageHandler_1 = require("../../utility/Lang/ScopedLanguageHandler");
var getAudioPlayer_1 = require("../../utility/Radio/getAudioPlayer");
var getVoiceChannel_1 = require("../../utility/Voice/getVoiceChannel");
/**
 * pauses or resumes player
 */
var VolumeCommand = /** @class */ (function (_super) {
    __extends(VolumeCommand, _super);
    function VolumeCommand() {
        var _this = _super.call(this, 'volume', 'radio') || this;
        _this.lang = null;
        _this.lang = new ScopedLanguageHandler_1["default"]('commands.radio.volume');
        _this.description = _this.lang.get('description');
        _this.usage = "" + _this.prefix;
        _this.example = "" + _this.prefix;
        _this.commandOptions = [
            new builders_1.SlashCommandNumberOption()
                .setName('volume')
                .setDescription('the volume between 0 and 100')
                .setRequired(true),
        ];
        return _this;
    }
    VolumeCommand.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var player, channel, isInSameChannel, vol;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = (0, getAudioPlayer_1["default"])(interaction.guildId);
                        if (!!player) return [3 /*break*/, 2];
                        return [4 /*yield*/, interaction.reply({ content: 'No player active', ephemeral: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        channel = (0, getVoiceChannel_1["default"])(interaction);
                        isInSameChannel = !!player.playable.find(function (c) { return c.joinConfig.channelId === (channel === null || channel === void 0 ? void 0 : channel.id); });
                        if (!(!channel || isInSameChannel === false)) return [3 /*break*/, 4];
                        return [4 /*yield*/, interaction.reply({ content: 'You have to be in the same channel as the player', ephemeral: true })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        vol = interaction.options.getNumber('volume');
                        if (!(vol === undefined || vol < 0 || vol > 200)) return [3 /*break*/, 6];
                        return [4 /*yield*/, interaction.reply({ content: "Invalid vol: " + vol, ephemeral: true })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                    case 6:
                        player.state.resource.volume.setVolumeLogarithmic(vol / 100);
                        return [4 /*yield*/, interaction.reply({ content: "player volume set to: " + vol, ephemeral: true })];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return VolumeCommand;
}(Command_1["default"]));
exports["default"] = VolumeCommand;
