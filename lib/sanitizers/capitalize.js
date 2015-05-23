'use strict';

module.exports = function (value) {
    return value.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
};