import './config/dotenv';
import DiscordBot from './DiscordBot';
import HelpCommand from './commands/util/HelpCommand';

const bot = new DiscordBot([new HelpCommand()], []);
bot.start(process.env.DISCORD_BOT_TOKEN);
