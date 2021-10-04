import './config/dotenv';
import DiscordBot from './DiscordBot';
import HelpCommand from './commands/util/HelpCommand';
import StatusCommand from './commands/util/StatusCommand';

const bot = new DiscordBot([new HelpCommand(), new StatusCommand()], []);
bot.start(process.env.DISCORD_BOT_TOKEN);
