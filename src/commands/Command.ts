import { Message } from 'discord.js';
import CommandConfig from './CommandConfig';
import Executable from './Executable';
import EmbedCategory from '../utility/Messages/EmbedCategory';
import MessageHandler from '../utility/Messages/MessageHandler';
import ParsedMessage from '../utility/MessageParser/ParsedMessage';
import MessageParser from '../utility/MessageParser/MessageParser';

/**
 * represents a base command
 */
export default class Command implements Executable {
  // the commands prefix, e.g. `/help` for the help-command
  public readonly prefix: string;

  public readonly commandName: string;

  public readonly category: string;

  public readonly config: CommandConfig;

  public description: string;

  public usage: string;

  public example: string;

  constructor(prefix: string, category = 'misc', config: CommandConfig = new CommandConfig()) {
    this.prefix = `/${prefix}`;
    this.commandName = prefix;
    this.category = category || prefix;
    this.config = config;
  }

  /**
   * execute command
   * performs config check and handles error
   */
  async execute(message: Message): Promise<void> {
    try {
      this.checkConfig();
      const parsedMessage = new MessageParser(message.content).parse();
      await this.run(message, parsedMessage);
    } catch (err) {
      this.handleError(message, err);
    }
  }

  /**
   * Run the command
   * this excludes config checks and error handling
   * run method shall be overwritten by Commands extending from this class
   */
  async run(message: Message, parsedMessage: ParsedMessage): Promise<void> {
    throw new Error(`stump: ${message.content} ${parsedMessage}`);
  }

  /**
   * handles error on a basic level
   */
  handleError(message: Message, error: Error): Promise<Message> {
    return MessageHandler.replySimpleText(message, error.message);
  }

  /**
   * checks config pre-execution
   */
  checkConfig(): void {
    if (this.config.ownerOnly) {
      throw new Error('you are not owner');
    }
  }

  /**
   * returns help text for this command
   */
  getHelpEmbedCategory(): EmbedCategory[] {
    const categories: EmbedCategory[] = [];
    categories.push(
      new EmbedCategory('Usage', MessageHandler.toBlock(this.usage)),
    );

    categories.push(
      new EmbedCategory('Beispiele', MessageHandler.toBlock(this.example)),
    );
    return categories;
  }
}
