import * as fs from 'fs';
import getByNestedKey from '../getByNestedKey';

/**
 * abstraction layer between language json file and ouput
 * supports easy change of localization file
 * supports string template processing
 * templates are enclosed by double curly brackets
 */
export class LanguageHandler {
  // parsed localization file
  dictionary: any;

  // name of lang. equals name of file in assets/lang/{language}.json
  language: string;

  constructor(language = 'german') {
    this.language = language;
    if (this.language !== 'test') this.updateDictionary();
  }

  // read, parse and store language file
  private updateDictionary() {
    const buffer = fs.readFileSync(`./assets/lang/${this.language}.json`);
    this.dictionary = JSON.parse(buffer.toString());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getByKey(key: string): string | Record<string, any> {
    return this.getFromDictByKey(this.dictionary, key);
  }

  /**
   * returns value at key
   * if valueObj is present and value is of type string, template processing is done on value
   */
  public get(key: string, valueObj?: Record<string, any>): string {
    try {
      if (this.dictionary == null) this.updateDictionary();
      const strAtKey = this.getByKey(key);
      if (valueObj == null) return <string>strAtKey;
      if (typeof strAtKey !== 'string') throw new Error(`Value at ${key} is not a string: ${strAtKey}`);
      return LanguageHandler.processTemplate(strAtKey, valueObj);
    } catch (e) {
      console.error(e);
      return '';
    }
  }

  private getFromDictByKey(dict: Record<string, any>, key: string): string | Record<string, any> {
    return getByNestedKey(dict, key);
  }

  // solution from
  // https://stackoverflow.com/questions/43261798/javascript-how-to-use-template-literals-with-json
  static processTemplate(expression: string, valueObj: Record<string, any> = {}): string {
    const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
    return expression.replace(templateMatcher,
      (substring, value) => <string>getByNestedKey(valueObj, value));
  }
}

const lang = new LanguageHandler();

export default lang;
