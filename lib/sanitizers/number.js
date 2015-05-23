'use strict';

var escapeStringRegexp = require('escape-string-regexp');
var _ = require('lodash');

module.exports = function (value, sanitizer) {

    if (value === '')
        return '';

    var radixes = sanitizer.radixes;
    var primaryRadix = radixes[0];
    var precision = sanitizer.precision;
    var radixEscaped = '(' + _.map(radixes, function (radix) {
            return escapeStringRegexp(radix);
        }).join('|') + ')';

    // Remove all character other than 0-9 and the radixes string
    value = value.replace(new RegExp('[^0-9' + radixEscaped + ']+', 'g'), '');

    var floatVal = parseFloat(value.replace(new RegExp('[' + radixEscaped + ']+', 'g'), '.'));
    var roundedFloatVal = Math.round(floatVal / precision) * precision;

    return String(roundedFloatVal)

        // Fixes the weird rounding bug
        .replace(/(?!\.\d*)0{4,}1$/, '')

        // Replaces the dot with the original radix char
        .replace('.', primaryRadix);
};