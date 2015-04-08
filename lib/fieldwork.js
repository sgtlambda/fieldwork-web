require('./common/tooltips');
require('select2');

var _         = require('lodash'),
    $         = require('jquery'),
    Validator = require('./validator'),
    Form      = require('./components/Form'),
    Field     = require('./components/Field');

var Fieldwork = {
    Validator: Validator,
    Form:      Form,
    Field:     Field
};

$.fn.fieldwork = function (formData) {
    return new Fieldwork.Form($(this), formData);
};

module.exports = Fieldwork;