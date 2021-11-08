"use strict";
exports.__esModule = true;
var fs = require("fs");
function getVersion() {
    return new Promise(function (resolve, reject) {
        fs.promises.readFile('./package.json').then(function (data) {
            var parsed = JSON.parse(data.toString());
            var version = parsed.version;
            resolve(version);
        })["catch"](function (err) { return reject(err); });
    });
}
exports["default"] = getVersion;
