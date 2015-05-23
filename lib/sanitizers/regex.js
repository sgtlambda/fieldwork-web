'use strict';

module.exports = function (value, sanitizer) {
    var patt = new RegExp(sanitizer.regexp, sanitizer.regexpmod);
    return value.replace(patt, sanitizer.replace);
};