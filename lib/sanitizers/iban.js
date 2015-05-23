'use strict';

module.exports = function (value) {
    value = value.replace(/\s/g, '');
    if (!/[A-Z]{2}[0-9]{2}[A-Z]{4}/.test(value))
        return value;
    var chunks = value.match(/.{1,4}/g);
    if (chunks === null)
        return "";
    else
        return chunks.join(" ");
};