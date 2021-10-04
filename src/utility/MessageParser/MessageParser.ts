import ParsedMessage from './ParsedMessage';

/**
 * parses incoming chat messages from discord
 *
 * argument names are suffixed by a dash
 * argument values can be encapsulated by quotation marks
 *
 * @example
 * /somecommand --message Hello Guys => args['message'] == 'Hello'
 * /somecommand --message "Hello Guys" => args['message'] == 'Hello Guys'
 */
export default class MessageParser {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  /**
   * parses arguments
   * @param {string[]} splitMsg - the messages's content split by spaces
   *
   * argument names start with a dash "-"
   * argument values can be enclosed by quotation marks `"` if they contain whitespaces
   *
   * arguments that have no value passed will default to an empty string.
   * It's up to implementation to handle this
   */
  parseArguments(splitMsg: string[]): Record<string, string> {
    const args: Record<string, string> = {};
    let arg: string | null = null;

    for (let i = 0; i < splitMsg.length; i += 1) {
      const str = splitMsg[i].trim();

      // arguments start with a dash
      const isArg = str.startsWith('-');
      if (isArg) {
        let argName = str;
        // remove only preceding dashes
        // replaceAll would replace all dashes
        while (argName.startsWith('-')) {
          argName = argName.replace('-', '');
        }
        arg = argName;
        if (args[arg] == null) {
          args[arg] = '';
        }
      } else if (arg) {
        args[arg] = str;
        arg = null;
      }
    }
    return args;
  }

  /**
   * splits the message's content
   *
   * splits by spaces
   * use quotation marks for values that contain whitespaces
   *
   * e.g. /say --message "Hello guys"
   */
  splitMessageContent(): string[] {
    const args = [];
    const strLength = this.message.length;
    let strAggregate = '';
    let hasQuoteMarksStarted = false;
    for (let i = 0; i < strLength; i += 1) {
      const char = this.message.charAt(i);
      if (char === '"') {
        if (hasQuoteMarksStarted) {
          // parse part
          args.push(strAggregate);
          strAggregate = '';
          hasQuoteMarksStarted = false;
        } else {
          hasQuoteMarksStarted = true;
        }
      } else if (hasQuoteMarksStarted) {
        strAggregate += (char);
      } else if (char === ' ') {
        args.push(strAggregate);
        strAggregate = '';
      } else {
        strAggregate += (char);
      }
    }
    if (strAggregate.length) {
      args.push(strAggregate);
    }
    if (hasQuoteMarksStarted) {
      throw new Error(`Invalid Syntax. Quotation Mark not terminated at string: ${this.message}`);
    }

    // filter empty arg names
    return args.filter((arg) => arg.length);
  }

  /**
   * parses a message to a [ParsedMessage]
   * @return {ParsedMessage}
   */
  parse(): ParsedMessage {
    const splitMessage = this.splitMessageContent();
    const args = this.parseArguments(splitMessage);
    return new ParsedMessage({ args, splitMessage });
  }
}
