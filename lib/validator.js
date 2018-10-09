'use strict';

var core       = require('./core');

function Validator(form, data) {
    this.form = form;
    this.method = data.method;
    this.error = data.error;
    this.data = data;
    this.inflictedFields = data.inflictedFields;
    this.valid = false;
}

Validator.prototype.validate = function () {
    this.valid = true;
    if (core.formValidators[this.method])
        if (!((core.formValidators[this.method])(this.form, this))) {
            alert(this.error);
            this.valid = false;
        }
    return this.valid;
};

Validator.prototype.isValid = function () {
    return this.valid;
};

module.exports = Validator;