/**
 * Discord Chat Message parsed for easier handling
 */
export default class ParsedMessage {
  // message arguments prefixed by a dash
  public args: Record<string, string>;

  // message split by spaces, handles quotation marks
  public splitMessage: string[];

  // index where an argument first appeared
  public argsStartAt: number;

  // indicates if message has arguments
  public hasArgs: boolean;

  /**
     *
     * @param {{}} args
     * @param {String[]} splitMessage
     */
  constructor({ args, splitMessage }:
  { args: Record<string, string>, splitMessage: string[] }) {
    this.args = args;
    this.splitMessage = splitMessage;
    this.argsStartAt = this.getArgsStart();
    this.hasArgs = this.argsStartAt >= 0;
  }

  /**
     * returns where start index of args is
     * @return {number}
     */
  getArgsStart(): number {
    return this.splitMessage.findIndex((m) => m && m.startsWith('-'));
  }

  /**
   * returns an argument from this ParsedMessage, either with it's arg name or
   * at the specified index
   * @param argName
   * @param index
   * @desc
   * first checks if an argument with supplied argName exists.
   * If not, it checks the message at the index
   *
   */
  getArg(argName: string = null, index: number = null): string {
    if (argName && this.args && this.args[argName]) {
      return this.args[argName];
    }
    if ((index || index === 0) && this.splitMessage.length >= (index + 1)) {
      const str = this.splitMessage[index].trim();
      return !str.startsWith('-') ? str : null;
    }
    return null;
  }
}
