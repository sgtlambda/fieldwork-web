var $        = require('jquery'),
    tooltips = require('./../common/tooltips'),
    core     = require('./../core');

/**
 * @param {Form} form
 * @param {Object} fieldData
 * @constructor
 */
function Field(form, fieldData) {
    this.form = form;
    this.element = $("#" + fieldData.id);
    this.touched = false;
    this.valid = false;
    this.valueWhenLastFocused = '';
    this.validators = fieldData.validators;
    this.sanitizers = fieldData.sanitizers;
    if (fieldData.hasOwnProperty('dtConfig')) {
        this.element.datetimepicker(fieldData.dtConfig);
    }
    this.isButton = fieldData.isButton === true;
    this.clicked = false;
    var field = this;
    this.element.on({
        blur:  function () {
            field.blur();
        },
        focus: function () {
            field.focus();
        },
        click: function () {
            field.clicked = true;
        },
        keyup: function (e) {
            field.keyup(e, this);
        }
    });
    if (this.element.is('[type="checkbox"]')) {
        this.element.on('change', function () {
            field.blur();
        });
        this.element.parent().click(function () {
            setTimeout(function () {
                field.validate();
            }, 50);
        });
    }
    if (this.element.is('.radios-group')) {
        this.element.click(function () {
            setTimeout(function () {
                field.validate();
            }, 50);
        });
    }
    if (this.element.is('select')) {
        this.element.select2(fieldData.select2);
    }
}

Field.prototype.blur = function () {
    if (!this.touched || (this.getValue() === '' && this.valueWhenLastFocused === ''))
        return;
    this.sanitize(false);
    this.validate();
};

Field.prototype.focus = function () {
    this.valueWhenLastFocused = this.getValue();
    field.touched = true;
    field.element.addClass("input-touched");
};

Field.prototype.keyup = function (e, field) {
    //this.sanitize(true);
};

Field.prototype.cancelSubmit = function () {
    this.clicked = false;
};

/**
 * Runs through all the validators and returns whether the current value is value
 * @returns {boolean|string} True if valid, an error when invalid
 */
Field.prototype.getValidityStatus = function () {
    for (var v in this.validators) {
        var validator = this.validators[v];
        var method = validator.method;
        if ((core.validators.hasOwnProperty(method)))
            if (!( (core.validators[method])(this, validator) ))
                return validator.error;
    }
    return true;
};

Field.prototype.validate = function () {
    var validity = this.getValidityStatus();
    if (validity === true)
        this.setValid();
    else
        this.setInvalid(validity);
    return validity === true;
};

Field.prototype.sanitize = function (realtime) {
    var val = this.getValue();
    var oldVal = val;
    for (var s in this.sanitizers)
        if ((core.sanitizers[this.sanitizers[s].method]))
            if (!realtime || this.sanitizers[s].realtime)
                val = (core.sanitizers[this.sanitizers[s].method])(val, this.sanitizers[s]);
    if (oldVal !== val)
        this.setValue(val);
};

Field.prototype.getName = function () {
    return this.element.attr('name');
};

Field.prototype.hasValue = function () {
    return (!this.isButton || this.clicked);
};

Field.prototype.getValue = function () {
    if (this.element.val() == this.element.attr('placeholder'))
        return '';
    return this.element.val();
};

Field.prototype.setValue = function (val) {
    this.element.val(val);
};

Field.prototype.setInvalid = function (error) {
    this.element.removeClass("valid").addClass("invalid");
    this.element.jtLink(error, ['focus'], []);
    this.valid = false;
};

Field.prototype.setValid = function () {
    this.element.removeClass("invalid");
    if (this.validators.length)
        this.element.addClass("valid");
    this.element.jtUnlink();
    this.valid = true;
};

Field.prototype.isValid = function () {
    return this.valid;
};

module.exports = Field;