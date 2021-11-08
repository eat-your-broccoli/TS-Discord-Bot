"use strict";
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
var CommandConfig_1 = require("./CommandConfig");
var EmbedCategory_1 = require("../utility/Messages/EmbedCategory");
var Messages_1 = require("../utility/Messages/Messages");
/**
 * represents a base command
 */
var Command = /** @class */ (function () {
    function Command(prefix, category, config) {
        if (category === void 0) { category = 'misc'; }
        if (config === void 0) { config = new CommandConfig_1["default"](); }
        this.commandOptions = [];
        this.prefix = prefix;
        this.commandName = prefix;
        this.category = category || prefix;
        this.config = config;
    }
    /**
     * execute command
     * performs config check and handles error
     */
    Command.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("stump: " + interaction);
            });
        });
    };
    /**
     * handles error on a basic level
     */
    Command.prototype.handleError = function (interaction, error) {
        console.error(error);
        if (interaction.replied) {
            interaction.channel.send(error.message)["catch"]();
            return;
        }
        interaction.reply(error.message)["catch"]();
    };
    /**
     * checks config pre-execution
     */
    Command.prototype.checkConfig = function () {
        if (this.config.ownerOnly) {
            throw new Error('you are not owner');
        }
    };
    /**
     * returns help text for this command
     */
    Command.prototype.getHelpEmbedCategory = function () {
        var categories = [];
        categories.push(new EmbedCategory_1["default"]('Usage', Messages_1["default"].toBlock(this.usage)));
        categories.push(new EmbedCategory_1["default"]('Beispiele', Messages_1["default"].toBlock(this.example)));
        return categories;
    };
    Command.prototype.createSlashCommand = function () {
        var _this = this;
        this.slashCommand = new builders_1.SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription(this.description);
        this.commandOptions.forEach(function (opt) {
            if (opt instanceof builders_1.SlashCommandStringOption)
                _this.slashCommand.addStringOption(opt);
            else if (opt instanceof builders_1.SlashCommandChannelOption)
                _this.slashCommand.addChannelOption(opt);
            else if (opt instanceof builders_1.SlashCommandUserOption)
                _this.slashCommand.addUserOption(opt);
            else if (opt instanceof builders_1.SlashCommandNumberOption)
                _this.slashCommand.addNumberOption(opt);
            else {
                throw new Error("unsupported command option: " + opt.type);
            }
        });
    };
    Command.prototype.go = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execute(interaction)["catch"](function (err) { return _this.handleError(interaction, err); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Command;
}());
exports["default"] = Command;
