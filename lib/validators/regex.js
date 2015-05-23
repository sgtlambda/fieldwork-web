'use strict';

module.exports = function (field, validator) {
    var match = /\/(.*)\/([igm]*)/.exec(validator.pattern);
    return field.getValue().match(new RegExp(match[1], match[2]));
};