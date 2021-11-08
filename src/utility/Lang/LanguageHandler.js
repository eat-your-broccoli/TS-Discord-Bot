"use strict";
exports.__esModule = true;
exports.LanguageHandler = void 0;
var fs = require("fs");
var getByNestedKey_1 = require("../getByNestedKey");
/**
 * abstraction layer between language json file and ouput
 * supports easy change of localization file
 * supports string template processing
 * templates are enclosed by double curly brackets
 */
var LanguageHandler = /** @class */ (function () {
    function LanguageHandler(language) {
        if (language === void 0) { language = 'german'; }
        this.language = language;
        if (this.language !== 'test')
            this.updateDictionary();
    }
    // read, parse and store language file
    LanguageHandler.prototype.updateDictionary = function () {
        var buffer = fs.readFileSync("./assets/lang/" + this.language + ".json");
        this.dictionary = JSON.parse(buffer.toString());
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LanguageHandler.prototype.getByKey = function (key) {
        return this.getFromDictByKey(key);
    };
    /**
     * returns value at key
     * if valueObj is present and value is of type string, template processing is done on value
     */
    LanguageHandler.prototype.get = function (key, valueObj) {
        try {
            if (this.dictionary == null)
                this.updateDictionary();
            var strAtKey = this.getByKey(key);
            if (valueObj == null)
                return strAtKey;
            if (typeof strAtKey !== 'string') { // noinspection ExceptionCaughtLocallyJS
                throw new Error("Value at " + key + " is not a string: " + strAtKey);
            }
            return LanguageHandler.processTemplate(strAtKey, valueObj);
        }
        catch (e) {
            console.error(e);
            return '';
        }
    };
    LanguageHandler.prototype.getFromDictByKey = function (key) {
        return (0, getByNestedKey_1["default"])(this.dictionary, key);
    };
    // solution from
    // https://stackoverflow.com/questions/43261798/javascript-how-to-use-template-literals-with-json
    LanguageHandler.processTemplate = function (expression, valueObj) {
        if (valueObj === void 0) { valueObj = {}; }
        var templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
        return expression.replace(templateMatcher, function (substring, value) { return (0, getByNestedKey_1["default"])(valueObj, value); });
    };
    return LanguageHandler;
}());
exports.LanguageHandler = LanguageHandler;
var lang = new LanguageHandler();
exports["default"] = lang;
