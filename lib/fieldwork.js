require('./common/tooltips');
require('jquery-datetimepicker');
require('jquerysimplemask');
require('select2');

var _         = require('lodash'),
    $         = require('jquery'),
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

$.fn.fieldwork = function (formData) {
    return new Fieldwork.Form($(this), formData);
};

if (window && !Object.prototype.hasOwnProperty.call(window, 'Fieldwork'))
    window.Fieldwork = Fieldwork;

module.exports = Fieldwork;