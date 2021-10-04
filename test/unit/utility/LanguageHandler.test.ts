import { describe, it } from 'mocha';
import { expect } from 'chai';
import lang, { LanguageHandler } from '../../../src/utility/Lang/LanguageHandler';

describe('LanguageHandler', () => {
  it('get help text', () => {
    const helpText = lang.get('commands.util.help.description');
    expect(helpText).to.equal('Liste Bot-Commands oder genauere Hilfe zu einem Command');
  });

  it('process a complex template', () => {
    const langHandler = new LanguageHandler('test');
    langHandler.dictionary = {
      nested: {
        template: '{{user.name}} is {{user.age}} years old!',
      },
    };
    const user = { name: 'Einstein', age: 42 };
    const result = langHandler.get('nested.template', { user });
    expect(result).to.equal('Einstein is 42 years old!');
  });
});
