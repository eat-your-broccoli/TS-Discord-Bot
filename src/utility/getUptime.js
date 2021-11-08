"use strict";
exports.__esModule = true;
// solution taken from
// https://stackoverflow.com/a/28705478/16001266
function format(uptimeAsNumber) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(uptimeAsNumber / (60 * 60));
    var minutes = Math.floor((uptimeAsNumber % (60 * 60)) / 60);
    var seconds = Math.floor(uptimeAsNumber % 60);
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}
function getUptime() {
    var uptime = process.uptime();
    return format(uptime);
}
exports["default"] = getUptime;
