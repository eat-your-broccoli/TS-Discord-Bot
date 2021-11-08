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
var Command_1 = require("../Command");
var ScopedLanguageHandler_1 = require("../../utility/Lang/ScopedLanguageHandler");
var getAudioPlayer_1 = require("../../utility/Radio/getAudioPlayer");
var getSongQueue_1 = require("../../utility/Radio/getSongQueue");
/**
 * pauses or resumes player
 */
var PauseCommand = /** @class */ (function (_super) {
    __extends(PauseCommand, _super);
    function PauseCommand() {
        var _this = _super.call(this, 'pause', 'radio') || this;
        _this.lang = null;
        _this.lang = new ScopedLanguageHandler_1["default"]('commands.radio.pause');
        _this.description = _this.lang.get('description');
        _this.usage = "" + _this.prefix;
        _this.example = "" + _this.prefix;
        _this.commandOptions = [];
        return _this;
    }
    PauseCommand.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var queue, player, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queue = (0, getSongQueue_1.getSongQueue)(interaction.guildId);
                        player = (0, getAudioPlayer_1["default"])(interaction.guildId);
                        if (!(!queue || !queue.isPlaying || !player)) return [3 /*break*/, 2];
                        message = 'Currently there is no song played that can be paused';
                        return [4 /*yield*/, interaction.reply({ content: message, ephemeral: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        if (!(player.state.status === 'playing')) return [3 /*break*/, 4];
                        player.pause();
                        return [4 /*yield*/, interaction.reply({ content: 'Paused player' })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(player.state.status === 'paused')) return [3 /*break*/, 6];
                        player.unpause();
                        return [4 /*yield*/, interaction.reply({ content: 'Unpaused player' })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, interaction.reply({ content: "Player is in unhandled state: " + player.state.status })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return PauseCommand;
}(Command_1["default"]));
exports["default"] = PauseCommand;
