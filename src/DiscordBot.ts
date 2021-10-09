import {
  Client, Intents, CommandInteraction,
} from 'discord.js';

import { REST } from '@discordjs/rest/dist';
import { Routes } from 'discord-api-types/v9';
import Command from './commands/Command';
// eslint-disable-next-line import/no-cycle
import Shorthand from './commands/Shorthand';
import Executable from './commands/Executable';
// eslint-disable-next-line import/no-cycle
import HelpCommand from './commands/util/HelpCommand';
import getToken from './utility/getToken';
import getClientId from './utility/getClientId';
import getGuildId from './utility/getGuildId';

/**
 * wrapping discord bot api in nice wrapper class
 */
export default class DiscordBot {
  public client: Client;

  public commands: Record<string, Command>;

  public shorthands: Record<string, Shorthand>;

  constructor(commands: Command[] = [], shorthands: Shorthand[] = []) {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });
    this.commands = this.executableArrayToRecord<Command>(commands);
    this.shorthands = this.executableArrayToRecord<Shorthand>(shorthands);

    this.configureCommands();
    this.registerEvents();
    this.registerSlashCommands(getToken(), getClientId(), getGuildId());
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

    this.client.on('interactionCreate', async (interaction: CommandInteraction) => {
      if (interaction.isCommand() === false) return;
      const executable = this.findMatchingExecutable(interaction.commandName);
      if (executable) {
        await executable.go(interaction)
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

  registerSlashCommands(token: string, clientId: string, guildId: string): void {
    const commands: any[] = [];
    Object.values(this.commands).forEach((c) => {
      if (c.slashCommand == null) c.createSlashCommand();
      commands.push(c.slashCommand.toJSON());
    });
    const restApi = new REST({ version: '9' }).setToken(token);
    restApi.put(Routes.applicationGuildCommands(
      clientId, guildId,
    ), { body: commands })
      .then(() => console.log('Successfully registered application commands'))
      .catch((err) => {
        console.error(`Failed to register slash commands: ${err.message}`);
        throw err;
      });
  }
}
