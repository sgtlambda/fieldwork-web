"use strict";

var $            = typeof jQuery == 'undefined' ? require('jquery') : jQuery,
    _            = require('lodash'),
    events       = require('events'),
    EventEmitter = require('util').EventEmitter,
    core         = require('./../core');

class Field extends EventEmitter {

    /**
     * @param {jQuery} $field
     * @param {Object} parameters
     * @constructor
     */
    constructor($field, parameters) {
        this.element = $field;
        this.element.data('fw-field', this);
        this.touched              = false;
        this.valid                = false;
        this.valueWhenLastFocused = '';
        this.parameters           = parameters;
        this.validators           = parameters.validators;
        this.sanitizers           = parameters.sanitizers;
        this.arm();
    }

    getTooltipTarget() {
        return this.element;
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
        return this.parameters;
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
        let valid = this.isValid();
        if (valid === true)
            this.setValid();
        else
            this.setInvalid(valid);
        return valid === true;
    }

    sanitize() {
        _.forEach(this.sanitizers, sanitizer => sanitizer.sanitize(this));
    }

    useToolTips() {
        return true;
    }

    getName() {
        return this.element.attr('name');
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
            this.element.linkTooltip(error, ['focus'], []);
        }
        this.valid = false;
        this.emit('invalid', error);
    }

    setValid() {
        this.element.removeClass("invalid");
        if (this.validators.length)
            this.element.addClass("valid");
        if (this.useTooltips)
            this.element.unlinkTooltip();
        this.valid = true;
        this.emit('valid');
    }

    /**
     * Whether or not the value of this field should be sent to the server
     * @return {boolean}
     */
    collect() {
        return true;
    }

    /**
     * Called when the form was about to be submitted, but the submit was aborted last-minute
     */
    submitAborted() {

    }

    /**
     * Whether this class applies to the provided field element and field data
     * @param $field
     * @param parameters
     * @returns {boolean}
     */
    static applies($field, parameters) {
        return true;
    }
}

module.exports = Field;