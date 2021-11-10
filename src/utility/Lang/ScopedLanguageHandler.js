"use strict";
exports.__esModule = true;
var LanguageHandler_1 = require("./LanguageHandler");
/**
 * scopes the language handler for less bloated calls
 * normal: get('commands.util.help.description)
 * scoped to 'commands.util.help': get('description')
 */
var ScopedLanguageHandler = /** @class */ (function () {
    function ScopedLanguageHandler(scope) {
        if (scope === void 0) { scope = ''; }
        this.scope = scope;
        this.handler = LanguageHandler_1["default"];
    }
    ScopedLanguageHandler.prototype.get = function (key, valObj) {
        return this.getScoped(key, valObj);
    };
    ScopedLanguageHandler.prototype.getScoped = function (key, valObj) {
        var unscopedKey = this.scope + "." + key;
        return this.getUnscoped(unscopedKey, valObj);
    };
    ScopedLanguageHandler.prototype.getUnscoped = function (key, valObj) {
        return this.handler.get(key, valObj);
    };
    return ScopedLanguageHandler;
}());
exports["default"] = ScopedLanguageHandler;
