import './config/dotenv';
import DiscordBot from './DiscordBot';
import HelpCommand from './commands/util/HelpCommand';
import StatusCommand from './commands/util/StatusCommand';
import JoinCommand from './commands/util/JoinCommand';
import globals from './utility/Globals';
import LeaveCommand from './commands/util/LeaveCommand';

const bot = new DiscordBot([
  new HelpCommand(),
  new StatusCommand(),
  new JoinCommand(),
  new LeaveCommand(),
], []);
bot.start(process.env.DISCORD_BOT_TOKEN);

globals.bot = bot;
