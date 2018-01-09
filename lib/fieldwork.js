'use strict';

require('./common/tooltips');

var $         = require('./jquery-compat'),
    core      = require('./core'),
    Validator = require('./validator'),
    Form      = require('./components/Form'),
    Field     = require('./components/Field');

var Fieldwork = {
    validators: core.validators,
    sanitizers: core.sanitizers,
    ee:         core.ee,
    Validator:  Validator,
    Form:       Form,
    Field:      Field
};

$.fn.fieldwork = function (data) {
    var $this = $(this);
    if ($this.is('form'))
        return new Fieldwork.Form($(this), data);
    else {
        var id = $this.attr('id');
        return new Fieldwork.Form(null, {
            slug:   '_anonymous_form',
            fields: {id: data}
        });
    }
};

if (window && !Object.prototype.hasOwnProperty.call(window, 'Fieldwork'))
    window.Fieldwork = Fieldwork;

module.exports = Fieldwork;