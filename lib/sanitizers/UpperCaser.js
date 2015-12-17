'use strict';

const ValueSanitizer = require('./ValueSanitizer');

class UpperCaser extends ValueSanitizer {

    sanitizeValue(value) {
        return value.toUpperCase();
    }
}

module.exports = UpperCaser;