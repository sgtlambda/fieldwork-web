'use strict';

const ValueSanitizer = require('./ValueSanitizer');

class Capitalizer extends ValueSanitizer {

    sanitizeValue(value) {
        return value.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    }
}

module.exports = Capitalizer;