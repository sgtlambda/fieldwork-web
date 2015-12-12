"use strict";

var $            = typeof jQuery == 'undefined' ? require('jquery') : jQuery,
    events       = require('events'),
    EventEmitter = require('util').EventEmitter,
    core         = require('./../core');

class Field extends EventEmitter {

    /**
     * @param {Form} form
     * @param {jQuery} $field
     * @param {Object} fieldData
     * @constructor
     */
    constructor(form, $field, fieldData) {
        this.form    = form;
        this.element = $field;
        this.element.data('fw-field', this);
        this.touched              = false;
        this.valid                = false;
        this.valueWhenLastFocused = '';
        this.fieldData            = fieldData;
        this.validators           = fieldData.validators;
        this.sanitizers           = fieldData.sanitizers;
        if (fieldData.hasOwnProperty('dtConfig') && $.fn.datetimepicker) {
            this.element.datetimepicker(fieldData.dtConfig);
        }
        this.arm();
    }

    arm() {
        this.element.on({
            blur:  () => this.blur(),
            focus: () => this.focus(),
            keyup: (e) => this.keyUp(e, this)
        });
    }

    dearm() {
        this.element.off('.fw');
    }

    /**
     * Gets the field data for this field
     * @returns {object}
     */
    getFieldData() {
        return this.fieldData;
    }

    /**
     * @returns {jQuery.<HTMLInputElement>}
     */
    getElement() {
        return this.element;
    }

    blur() {
        if (!this.touched || (this.getValue() === '' && this.valueWhenLastFocused === ''))
            return;
        this.sanitize(false);
        this.validate();
    }

    focus() {
        this.valueWhenLastFocused = this.getValue();
        this.touched              = true;
        this.element.addClass("input-touched");
    }

    keyUp() {
        this.sanitize(true);
    }

    cancelSubmit() {
        this.clicked = false;
    }

    /**
     * Runs through all the validators and returns whether the current value is value
     * @returns {boolean|string} True if valid, an error when invalid
     */
    isValid() {
        for (var v in this.validators) {
            var validator = this.validators[v];
            var method    = validator.method;
            if ((core.validators.hasOwnProperty(method)))
                if (!( (core.validators[method])(this, validator) ))
                    return validator.error;
        }
        return true;
    }

    validate() {
        var validity = this.getValidityStatus();
        if (validity === true)
            this.setValid();
        else
            this.setInvalid(validity);
        return validity === true;
    }

    sanitize() {
        var val    = this.getValue();
        var oldVal = val;
        for (var s in this.sanitizers)
            if ((core.sanitizers[this.sanitizers[s].method]))
                if (!realtime || this.sanitizers[s].realtime)
                    val = (core.sanitizers[this.sanitizers[s].method])(val, this.sanitizers[s]);
        if (oldVal !== val)
            this.setValue(val);
    }

    useToolTips() {
        return true;
    }

    getName() {
        return this.element.attr('name');
    }

    hasValue() {
        return (!this.isButton || this.clicked);
    }

    getValue() {
        return this.element.val();
    }

    setValue(val) {
        this.element.val(val);
    }

    setInvalid(error) {
        this.element.removeClass("valid").addClass("invalid");
        if (this.useTooltips) {
            this.element.jtLink(error, ['focus'], []);
        }
        this.valid = false;
        this.emit('invalid', error);
    }

    setValid() {
        this.element.removeClass("invalid");
        if (this.validators.length)
            this.element.addClass("valid");
        if (this.useTooltips) {
            this.element.jtUnlink();
        }
        this.valid = true;
        this.emit('valid');
    }
}

module.exports = Field;