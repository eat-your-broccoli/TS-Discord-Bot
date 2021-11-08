"use strict";
exports.__esModule = true;
/**
 * models command configuration
 */
var CommandConfig = /** @class */ (function () {
    function CommandConfig() {
        // command can only be executed in bot channel
        this.botChannelOnly = false;
        // command can only be performed by owner
        this.ownerOnly = false;
    }
    return CommandConfig;
}());
exports["default"] = CommandConfig;
