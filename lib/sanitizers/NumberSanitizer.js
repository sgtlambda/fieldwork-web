'use strict';

const ValueSanitizer     = require('./ValueSanitizer');
const escapeStringRegexp = require('escape-string-regexp');
const _                  = require('lodash');

class NumberSanitizer extends ValueSanitizer {

    sanitizeValue(value) {
        var primaryRadix = this.parameters.radixes[0];
        var radixEscaped = '(' + _.map(this.parameters.radixes, function (radix) {
                return escapeStringRegexp(radix);
            }).join('|') + ')';

        value = value.replace(new RegExp('[^0-9' + radixEscaped + ']+', 'g'), '');

        var floatVal = parseFloat(value.replace(new RegExp('[' + radixEscaped + ']+', 'g'), '.'));

        if (isNaN(floatVal))
            return '';

        var roundedFloatVal = Math.round(floatVal / this.parameters.precision) * this.parameters.precision;

        return String(roundedFloatVal)
            .replace(/(?!\.\d*)0{4,}1$/, '')
            .replace('.', primaryRadix);
    }
}

module.exports = NumberSanitizer;