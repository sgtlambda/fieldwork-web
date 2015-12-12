'use strict';

require('./common/tooltips');
require('jquery-datetimepicker');
require('jquerysimplemask');

var _         = require('lodash'),
    $         = typeof jQuery == 'undefined' ? require('jquery') : jQuery,
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

require('./transform')($, Fieldwork);

if (window && !Object.prototype.hasOwnProperty.call(window, 'Fieldwork'))
    window.Fieldwork = Fieldwork;

module.exports = Fieldwork;