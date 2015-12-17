'use strict';

const Sanitizer = require('./Sanitizer');

class ValueSanitizer extends Sanitizer {

    /**
     * Sanitize the value
     * @param {string} value
     * @returns {string}
     */
    sanitizeValue(value) {
        return value;
    }

    sanitize(field) {
        field.setValue(this.sanitizeValue(field.getValue()));
    }
}

module.exports = ValueSanitizer;