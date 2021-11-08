"use strict";
exports.__esModule = true;
/**
 * @class EmbedCategory
 * A category is comparable to a chapter.
 * Used in Discord's MessageEmbed
 */
var EmbedCategory = /** @class */ (function () {
    function EmbedCategory(title, text, inline) {
        if (inline === void 0) { inline = false; }
        this.title = title;
        this.text = text;
        this.inline = inline;
    }
    return EmbedCategory;
}());
exports["default"] = EmbedCategory;
