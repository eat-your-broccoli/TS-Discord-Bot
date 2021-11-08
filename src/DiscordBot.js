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
var discord_js_1 = require("discord.js");
var dist_1 = require("@discordjs/rest/dist");
var v9_1 = require("discord-api-types/v9");
var Command_1 = require("./commands/Command");
// eslint-disable-next-line import/no-cycle
var Shorthand_1 = require("./commands/Shorthand");
// eslint-disable-next-line import/no-cycle
var HelpCommand_1 = require("./commands/util/HelpCommand");
var getToken_1 = require("./utility/getToken");
var getClientId_1 = require("./utility/getClientId");
var getGuildId_1 = require("./utility/getGuildId");
/**
 * wrapping discord bot api in nice wrapper class
 */
var DiscordBot = /** @class */ (function () {
    function DiscordBot(commands, shorthands) {
        var _this = this;
        if (commands === void 0) { commands = []; }
        if (shorthands === void 0) { shorthands = []; }
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
            ]
        });
        commands.forEach(function (c) { c.client = _this.client; });
        this.commands = this.executableArrayToRecord(commands);
        this.shorthands = this.executableArrayToRecord(shorthands);
        this.configureCommands();
        this.registerEvents();
        this.registerSlashCommands((0, getToken_1["default"])(), (0, getClientId_1["default"])(), (0, getGuildId_1["default"])());
    }
    /**
     * registers Events to listen to
     */
    DiscordBot.prototype.registerEvents = function () {
        var _this = this;
        this.client.on('ready', function () {
            console.log("Logged in as " + _this.client.user.tag + "!");
        });
        this.client.on('error', function (error) {
            console.error('DiscordBot.onError(): ', error);
        });
        this.client.on('interactionCreate', function (interaction) { return __awaiter(_this, void 0, void 0, function () {
            var executable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (interaction.isCommand() === false)
                            return [2 /*return*/];
                        executable = this.findMatchingExecutable(interaction.commandName);
                        if (!executable) return [3 /*break*/, 2];
                        return [4 /*yield*/, executable.go(interaction)["catch"](function (err) {
                                console.log(err);
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    DiscordBot.prototype.findMatchingExecutable = function (msgContent) {
        var command = this.findMatchingCommand(msgContent);
        if (command)
            return command;
        return this.findMatchingShorthand(msgContent);
    };
    /**
     * matches Message's prefix with with Command's Prefix
     * @param {string} msgContent
     */
    DiscordBot.prototype.findMatchingCommand = function (msgContent) {
        var msgPrefix = '';
        var splitMsg = msgContent.split(' ');
        if (splitMsg.length) {
            // eslint-disable-next-line prefer-destructuring
            msgPrefix = splitMsg[0];
        }
        return this.commands[msgPrefix];
    };
    /**
     * matches messages first char against Shorthands prefix
     * @param {String} msgContent
     * @return {*}
     */
    DiscordBot.prototype.findMatchingShorthand = function (msgContent) {
        var content = msgContent.trim();
        var firstChar = content && content.length ? content.charAt(0) : '';
        return this.shorthands[firstChar];
    };
    /**
     * starts discord bot
     * @param {String}token
     */
    DiscordBot.prototype.start = function (token) {
        this.client.login(token)
            .then(function () {
            console.log('Bot has successfully started');
        })["catch"](function (err) {
            console.error('Bot failed to start. Reason: ', err);
        });
    };
    /**
     * parses an array of commands to object
     * the commands prefix is the key in the object
     * @return {{}}
     * @param executables
     */
    DiscordBot.prototype.executableArrayToRecord = function (executables) {
        if (executables === void 0) { executables = []; }
        var commandsObj = {};
        executables.forEach(function (c) {
            if (c == null) {
                throw new Error('command is null');
            }
            var prefix = '';
            if (c instanceof Shorthand_1["default"] || c instanceof Command_1["default"])
                prefix = c.prefix;
            if (commandsObj[prefix]) {
                throw new Error("Duplicate command for " + prefix);
            }
            commandsObj[prefix] = c;
        });
        return commandsObj;
    };
    DiscordBot.prototype.configureCommands = function () {
        var _this = this;
        Object.values(this.commands).forEach(function (c) {
            if (c instanceof HelpCommand_1["default"]) {
                c.configure({ context: _this });
            }
        });
    };
    DiscordBot.prototype.registerSlashCommands = function (token, clientId, guildId) {
        var commands = [];
        Object.values(this.commands).forEach(function (c) {
            if (c.slashCommand == null)
                c.createSlashCommand();
            commands.push(c.slashCommand.toJSON());
        });
        var restApi = new dist_1.REST({ version: '9' }).setToken(token);
        restApi.put(v9_1.Routes.applicationGuildCommands(clientId, guildId), { body: commands })
            .then(function () { return console.log('Successfully registered application commands'); })["catch"](function (err) {
            console.error("Failed to register slash commands: " + err.message);
            throw err;
        });
    };
    return DiscordBot;
}());
exports["default"] = DiscordBot;
