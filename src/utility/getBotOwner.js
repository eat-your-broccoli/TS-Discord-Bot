"use strict";
exports.__esModule = true;
function getBotOwner() {
    return new Promise(function (resolve) {
        resolve(process.env.OWNER_ID);
    });
}
exports["default"] = getBotOwner;
