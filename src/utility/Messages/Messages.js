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
// eslint-disable-next-line no-unused-vars
var discord_js_1 = require("discord.js");
var EmbedCategory_1 = require("./EmbedCategory");
var Messages = /** @class */ (function () {
    function Messages() {
    }
    /**
       * send a string text in a channel
       * @param {Message} m
       * @param {String} outgoing
       * @param {Channel || null} channel
       */
    Messages.sendSimpleText = function (m, outgoing, channel) {
        if (channel) {
            return channel.send(outgoing);
        }
        return m.channel.send(outgoing);
    };
    /**
     * send a string text in a channel
     * @param {Message} m
     * @param text
     * @return {Promise<Message>}
     */
    Messages.replySimpleText = function (m, text) {
        return m.reply(text);
    };
    /**
       * creates a rich text object
       * @param {string} title
       * @param {string} description
       * @param {[{title: string, text: string, inline: boolean}]}categories
       * @param color
       * @return {MessageEmbed}
       */
    Messages.createRichText = function (_a) {
        var title = _a.title, _b = _a.description, description = _b === void 0 ? '' : _b, _c = _a.categories, categories = _c === void 0 ? [] : _c, color = _a.color;
        var richText = new discord_js_1.MessageEmbed();
        if (title && typeof title === 'string') {
            richText.setTitle(title);
        }
        if (description && typeof description === 'string' && description.length) {
            richText.setDescription(description);
        }
        if (categories && Array.isArray(categories)) {
            categories.forEach(function (cat) {
                if (cat && typeof cat === 'object') {
                    richText.addField(cat.title || '', cat.text || '', cat.inline || false);
                }
            });
        }
        if (color) {
            richText.setColor(color);
        }
        richText.setTimestamp(new Date());
        return richText;
    };
    /**
     * creates an EmbedCategory used in discord for richText messages
     * @param title
     * @param text
     * @param inline
     */
    Messages.createCategory = function (title, text, inline) {
        if (inline === void 0) { inline = false; }
        return new EmbedCategory_1["default"](title, text, inline);
    };
    /**
       * sends a rich Text
       * @param {Message}msg
       * @param {MessageEmbed} richText
       * @param {Channel || null} channel
       */
    Messages.sendRichText = function (msg, richText, channel) {
        if (channel) {
            return channel.send({ embeds: [richText] });
        }
        return msg.channel.send({ embeds: [richText] });
    };
    /**
       * replies to a message with a rich text
       * @param {Message}msg
       * @param {MessageEmbed} richText
       * @return {Promise<Message>}
       */
    Messages.replyRichText = function (msg, richText) {
        return msg.reply({ embeds: [richText] });
    };
    /**
     * converts string to an discord code block
     * @param text
     */
    Messages.toBlock = function (text) {
        return "```" + text + "```";
    };
    /**
     * converts string to an inline block string
     * @param text
     */
    Messages.toInlineBlock = function (text) {
        return "`" + text + "`";
    };
    /**
     * converts array to a string
     * @param {String[]} array
     * @param {boolean = true} escape makes entries inline block elements
     * @return {string}
     */
    Messages.arrayToString = function (array, escape) {
        if (escape === void 0) { escape = true; }
        var str = '';
        array.forEach(function (item) {
            str += (escape ? Messages.toInlineBlock(item) : item) + "\n";
        });
        return str;
    };
    /**
     *
     * @param {Message }msg
     * @param {MessageEmbed} reply
     * @param {MessageAttachment} attachment
     * @param {TextChannel} channel
     */
    Messages.sendAttachment = function (msg, reply, attachment, channel) {
        return __awaiter(this, void 0, void 0, function () {
            var sendingChannel;
            return __generator(this, function (_a) {
                sendingChannel = channel || msg.channel;
                return [2 /*return*/, sendingChannel.send({ embeds: [reply], files: [attachment] })["catch"](function (e) {
                        if (e && e.code === 40005) {
                            throw new Error('Discord only supports up to 8MB files, maybe reduce quality');
                        }
                        throw e;
                    })];
            });
        });
    };
    /**
       * creates a discord js attachment
       * @param buffer
       * @param name
       * @return {MessageAttachment}
       */
    Messages.createAttachment = function (buffer, name) {
        return new discord_js_1.MessageAttachment(buffer, name);
    };
    return Messages;
}());
exports["default"] = Messages;
