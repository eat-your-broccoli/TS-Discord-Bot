import Command from '../Command';
import Shorthand from '../Shorthand';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';

export default class RadioCommand extends Command {
  commands: Record<string, Command>;

  shorthands: Record<string, Shorthand>;

  lang: ScopedLanguageHandler = null;

  constructor() {
    super('radio', 'radio');
    this.lang = new ScopedLanguageHandler('commands.radio');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix} [command]`;
    this.example = `${this.prefix}
    \n${this.prefix} [command]`;
  }
}
