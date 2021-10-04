import lang, { LanguageHandler } from './LanguageHandler';

/**
 * scopes the language handler for less bloated calls
 * normal: get('commands.util.help.description)
 * scoped to 'commands.util.help': get('description')
 */
export default class ScopedLanguageHandler {
  scope: string;

  handler: LanguageHandler;

  constructor(scope = '') {
    this.scope = scope;
    this.handler = lang;
  }

  get(key: string, valObj?: Record<string, any>): string {
    return this.getScoped(key, valObj);
  }

  getScoped(key: string, valObj?: Record<string, any>): string {
    const unscopedKey = `${this.scope}.${key}`;
    return this.getUnscoped(unscopedKey, valObj);
  }

  getUnscoped(key: string, valObj?: Record<string, any>): string {
    return this.handler.get(key, valObj);
  }
}
