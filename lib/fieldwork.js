'use strict';

require('./common/tooltips');
require('jquery-datetimepicker');
require('jquerysimplemask');
require('select2');

var _         = require('lodash'),
    $         = typeof jQuery == 'undefined' ? require('jquery') : jQuery,
    core      = require('./core'),
    Validator = require('./validator'),
    Form      = require('./components/Form'),
    Field     = require('./components/Field');

var Fieldwork = {
  validators:     core.validators,
  formValidators: core.formValidators,
  sanitizers:     core.sanitizers,
  ee:             core.ee,
  Validator:      Validator,
  Form:           Form,
  Field:          Field
};

/**
 * Transform the jQuery element to either a Fieldwork form or Fieldwork field
 * @param {Object} data
 * @returns {Object}
 */
$.fn.fieldwork = function (data) {
  var $this = $(this);
  if ($this.is('form'))
    return new Fieldwork.Form($(this), data);
  else if ($this.is('select') || $this.is('input') || $this.is('textarea'))
    return new Fieldwork.Field(null, data);
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
