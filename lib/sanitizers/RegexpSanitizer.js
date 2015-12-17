'use strict';

const ValueSanitizer = require('./ValueSanitizer');

class RegexpSanitizer extends ValueSanitizer {

    sanitizeValue(value) {
        var patt = new RegExp(this.parameters.regexp, this.parameters.regexpmod);
        return value.replace(patt, this.parameters.replace);
    }
}

module.exports = RegexpSanitizer;