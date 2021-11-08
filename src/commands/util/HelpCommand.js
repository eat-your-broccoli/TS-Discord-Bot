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
var Messages_1 = require("../../utility/Messages/Messages");
var EmbedCategory_1 = require("../../utility/Messages/EmbedCategory");
var ScopedLanguageHandler_1 = require("../../utility/Lang/ScopedLanguageHandler");
var HelpCommand = /** @class */ (function (_super) {
    __extends(HelpCommand, _super);
    function HelpCommand() {
        var _this = _super.call(this, 'help', 'util') || this;
        _this.lang = null;
        _this.lang = new ScopedLanguageHandler_1["default"]('commands.util.help');
        _this.description = _this.lang.get('description');
        _this.usage = _this.prefix + " [command]";
        _this.example = _this.prefix + "\n    \n" + _this.prefix + " [command]";
        _this.commandOptions = [
            new builders_1.SlashCommandStringOption().setName('commandname').setDescription('name of the command you want to know more about')
                .setRequired(false),
        ];
        return _this;
    }
    HelpCommand.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var commandName, reply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commandName = interaction.options.getString('commandname');
                        if (commandName)
                            reply = this.commandHelp(commandName);
                        else
                            reply = this.generalHelp();
                        return [4 /*yield*/, interaction.reply({ embeds: [reply] })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * prints help for a single command
     * @param commandStr
     */
    HelpCommand.prototype.commandHelp = function (commandStr) {
        var command = this.commands[commandStr] || this.commands["/" + commandStr];
        if (command == null) {
            // error
            throw new Error(this.lang.get('error.unknownCommand', { commandName: commandStr }));
        }
        else {
            var title = command.commandName;
            var description = command.description;
            var categories = command.getHelpEmbedCategory();
            return Messages_1["default"].createRichText({ title: title, description: description, categories: categories });
        }
    };
    /**
     * print all available commands to the chat, ordered by category
     */
    HelpCommand.prototype.generalHelp = function () {
        var title = 'Commands';
        var commandsByCategory = this.sortCommandsByCategory();
        var messageCategories = [];
        Object.keys(commandsByCategory)
            .forEach(function (key) {
            var embedCat = new EmbedCategory_1["default"](key, '', false);
            commandsByCategory[key].forEach(function (c) {
                embedCat.text += Messages_1["default"].toInlineBlock("" + c.prefix);
                embedCat.text += "\t" + c.description;
                embedCat.text += '\n';
            });
            messageCategories.push(embedCat);
        });
        return Messages_1["default"].createRichText({ title: title, categories: messageCategories });
    };
    /**
     * sorts commands by category
     */
    HelpCommand.prototype.sortCommandsByCategory = function () {
        var commandsByCategory = {};
        Object.values(this.commands).forEach(function (c) {
            var cat = c.category;
            if (commandsByCategory[cat] == null)
                commandsByCategory[cat] = [];
            commandsByCategory[cat].push(c);
        });
        return commandsByCategory;
    };
    /**
     * get commands and shorthands from the discord bot
     * @param context
     */
    HelpCommand.prototype.configure = function (_a) {
        var context = _a.context;
        if (context == null) {
            throw new Error("Error while configuring " + this + ". Needs context set");
        }
        this.commands = context.commands || {};
        this.shorthands = context.shorthands || {};
    };
    return HelpCommand;
}(Command_1["default"]));
exports["default"] = HelpCommand;
