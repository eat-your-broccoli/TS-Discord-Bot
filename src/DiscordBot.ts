import { Client, Message, Intents } from 'discord.js';
// eslint-disable-next-line import/no-cycle
import Command from './commands/Command';
// eslint-disable-next-line import/no-cycle
import Shorthand from './commands/Shorthand';
import Executable from './commands/Executable';
// eslint-disable-next-line import/no-cycle
import HelpCommand from './commands/util/HelpCommand';

/**
 * wrapping discord bot api in nice wrapper class
 */
export default class DiscordBot {
  public client: Client;

  public commands: Record<string, Command>;

  public shorthands: Record<string, Shorthand>;

  constructor(commands: Command[] = [], shorthands: Shorthand[] = []) {
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    this.commands = this.executableArrayToRecord<Command>(commands);
    this.shorthands = this.executableArrayToRecord<Shorthand>(shorthands);

    this.configureCommands();
    this.registerEvents();
  }

  /**
   * registers Events to listen to
   */
  registerEvents(): void {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
    this.client.on('error', (error) => {
      console.error('DiscordBot.onError(): ', error);
    });

    this.client.on('messageCreate', async (msg: Message) => {
      const executable = this.findMatchingExecutable(msg.content);
      if (executable) {
        await executable.execute(msg)
          .catch((err: Error) => {
            console.log(err);
          });
      }
    });
  }

  findMatchingExecutable(msgContent: string): Executable | null {
    const command = this.findMatchingCommand(msgContent);
    if (command) return command;
    return this.findMatchingShorthand(msgContent);
  }

  /**
   * matches Message's prefix with with Command's Prefix
   * @param {string} msgContent
   */
  findMatchingCommand(msgContent: string): Executable | null {
    let msgPrefix = '';
    const splitMsg: string[] = msgContent.split(' ');
    if (splitMsg.length) {
      // eslint-disable-next-line prefer-destructuring
      msgPrefix = splitMsg[0];
    }
    return this.commands[msgPrefix];
  }

  /**
   * matches messages first char against Shorthands prefix
   * @param {String} msgContent
   * @return {*}
   */
  findMatchingShorthand(msgContent: string): Executable | null {
    const content = msgContent.trim();
    const firstChar = content && content.length ? content.charAt(0) : '';
    return this.shorthands[firstChar];
  }

  /**
   * starts discord bot
   * @param {String}token
   */
  start(token: string): void {
    this.client.login(token)
      .then(() => {
        console.log('Bot has successfully started');
      }).catch((err) => {
        console.error('Bot failed to start. Reason: ', err);
      });
  }

  /**
   * parses an array of commands to object
   * the commands prefix is the key in the object
   * @param commands
   * @return {{}}
   */
  commandArrayToObject(commands: Command[] = []): Record<string, Command> {
    const commandsObj: Record<string, Command> = {};
    commands.forEach((c) => {
      if (commandsObj[c.prefix]) {
        throw new Error(`Duplicate command for ${c.prefix}`);
      }
      commandsObj[c.prefix] = c;
    });
    return commandsObj;
  }

  /**
   * parses an array of commands to object
   * the commands prefix is the key in the object
   * @return {{}}
   * @param executables
   */
  executableArrayToRecord<Type extends Executable>(executables: Type[] = []): Record<string, Type> {
    const commandsObj: Record<string, Type> = {};
    executables.forEach((c) => {
      if (c == null) {
        throw new Error('command is null');
      }
      let prefix = '';
      if (c instanceof Shorthand || c instanceof Command) prefix = c.prefix;
      if (commandsObj[prefix]) {
        throw new Error(`Duplicate command for ${prefix}`);
      }
      commandsObj[prefix] = c;
    });
    return commandsObj;
  }

  configureCommands(): void {
    Object.values(this.commands).forEach((c) => {
      if (c instanceof HelpCommand) {
        c.configure({ context: this });
      }
    });
  }
}
