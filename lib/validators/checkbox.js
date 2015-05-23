'use strict';

module.exports = function (field, validator) {
    return validator.checked === field.element.is(":checked");
};