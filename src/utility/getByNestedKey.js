"use strict";
exports.__esModule = true;
function getByNestedKey(obj, key) {
    var o = obj;
    var s = key;
    s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
    // eslint-disable-next-line no-param-reassign
    s = s.replace(/^\./, ''); // strip a leading dot
    var a = s.split('.');
    // eslint-disable-next-line no-plusplus
    for (var i = 0, n = a.length; i < n && o; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        }
        else {
            return;
        }
    }
    // eslint-disable-next-line consistent-return
    return o;
}
exports["default"] = getByNestedKey;
