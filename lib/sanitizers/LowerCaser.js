'use strict';

const ValueSanitizer = require('./ValueSanitizer');

class LowerCaser extends ValueSanitizer {

    sanitizeValue(value) {
        return value.toLowerCase();
    }
}

module.exports = LowerCaser;