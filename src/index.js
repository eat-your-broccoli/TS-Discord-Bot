"use strict";
exports.__esModule = true;
require("./config/dotenv");
var DiscordBot_1 = require("./DiscordBot");
var HelpCommand_1 = require("./commands/util/HelpCommand");
var StatusCommand_1 = require("./commands/util/StatusCommand");
var JoinCommand_1 = require("./commands/util/JoinCommand");
var Globals_1 = require("./utility/Globals");
var LeaveCommand_1 = require("./commands/util/LeaveCommand");
var RadioCommand_1 = require("./commands/radio/RadioCommand");
var YoutubeTestCommand_1 = require("./commands/develop/YoutubeTestCommand");
var QueueCommand_1 = require("./commands/radio/QueueCommand");
var SkipCommand_1 = require("./commands/radio/SkipCommand");
var PauseCommand_1 = require("./commands/radio/PauseCommand");
var VolumeCommand_1 = require("./commands/radio/VolumeCommand");
var commands = [
    new HelpCommand_1["default"](),
    new StatusCommand_1["default"](),
    new JoinCommand_1["default"](),
    new LeaveCommand_1["default"](),
    new RadioCommand_1["default"](),
    new QueueCommand_1["default"](),
    new SkipCommand_1["default"](),
    new PauseCommand_1["default"](),
    new VolumeCommand_1["default"](),
];
if (process.env.NODE_ENV.indexOf('dev') >= 0) {
    console.log('add dev commands');
    commands.push(new YoutubeTestCommand_1["default"]());
}
var bot = new DiscordBot_1["default"](commands, []);
bot.start(process.env.DISCORD_BOT_TOKEN);
Globals_1["default"].bot = bot;
process.on('unhandledError', function (error) {
    console.error('unhandled error: ', error);
});
