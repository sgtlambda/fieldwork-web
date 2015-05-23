'use strict';

module.exports = function (field, validator) {
    var checkedInput = field.element.find('input[type="radio"]:checked');
    if (!checkedInput.length) return false;
    return validator.any ? true : checkedInput.value() === validator.value;
};