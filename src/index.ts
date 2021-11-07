import './config/dotenv';
import DiscordBot from './DiscordBot';
import HelpCommand from './commands/util/HelpCommand';
import StatusCommand from './commands/util/StatusCommand';
import JoinCommand from './commands/util/JoinCommand';
import globals from './utility/Globals';
import LeaveCommand from './commands/util/LeaveCommand';
import RadioCommand from './commands/radio/RadioCommand';
import YoutubeTestCommand from './commands/develop/YoutubeTestCommand';
import QueueCommand from './commands/radio/QueueCommand';

const commands = [
  new HelpCommand(),
  new StatusCommand(),
  new JoinCommand(),
  new LeaveCommand(),
  new RadioCommand(),
  new QueueCommand(),
];

if (process.env.NODE_ENV.indexOf('dev') >= 0) {
  console.log('add dev commands');
  commands.push(new YoutubeTestCommand());
}

const bot = new DiscordBot(commands, []);
bot.start(process.env.DISCORD_BOT_TOKEN);

globals.bot = bot;

process.on('unhandledError', (error: Error) => {
  console.error('unhandled error: ', error);
});
