require('./common/tooltips');
require('select2');

var _         = require('lodash'),
    $         = require('jquery'),
    Validator = require('./validator'),
    Form      = require('./components/Form'),
    Field     = require('./components/Field');

Fieldwork.Validator = Validator;
Fieldwork.Form = Form;
Fieldwork.Field = Field;

$.fn.fieldwork = function (formData) {
    return new Form($(this), formData);
};

module.exports = Fieldwork;