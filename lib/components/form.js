var _         = require('lodash'),
    Validator = require('./../validator'),
    core      = require('./../core'),
    Field     = require('./field');

function Form($form, formData) {
  this.slug            = formData.slug;
  this.submitCallback  = formData.submitCallback;
  this.hiddenFieldName = formData.hiddenFieldName;
  this.dataFields      = formData.dataFields;
  if ($form)
    this.element = $form.data('fw-form', this);
  this.fields     = [];
  this.validators = [];
  var n;
  for (n in formData.fields)
    this.fields.push(new Field(this, formData.fields[n]));
  for (n in formData.liveValidators)
    this.validators.push(new Validator(this, formData.liveValidators[n]));
  if ($form)
    $form.on({submit: this.submit.bind(this)});
  core.callHook('post_instantiate_form', [this]);
}

Form.prototype.sanitize = function () {
  for (var n in this.fields) {
    if (this.fields[n].sanitize) {
      this.fields[n].sanitize(false);
    }
  }
};

Form.prototype.validate = function () {
  var fieldsValid = true;
  var n;
  for (n in this.fields) {
    if (this.fields[n].validate && !this.fields[n].validate())
      fieldsValid = false;
  }
  if (fieldsValid)
    for (n in this.validators)
      if (!this.validators[n].validate())
        break;
};

Form.prototype.isValid = function () {
  var n;
  for (n in this.fields)
    if (!this.fields[n].isValid())
      return false;
  for (n in this.validators)
    if (!this.validators[n].isValid())
      return false;
  return true;
};

Form.prototype.submit = function (e) {
  this.sanitize();
  this.validate();
  if (!this.isValid()) {
    if (e)
      e.preventDefault();
    var n;
    for (n in this.fields)
      if (this.fields[n].cancelSubmit)
        this.fields[n].cancelSubmit();
    for (n in this.fields)
      if (this.fields[n].isValid && !this.fields[n].isValid()) {
        this.fields[n].element.focus().jtShow();
        break;
      }
  } else if (this.submitCallback !== "") {
    var fn = window[this.submitCallback];
    if (typeof fn === 'function')
      fn(e, this);
  }
  //Fieldwork.performCallback(this.slug, Fieldwork.SUBMITCALLBACK, this, null, e);
};

Form.prototype.getValues = function () {
  var values                   = {};
  values[this.hiddenFieldName] = "yes"; //force submit
  for (var n in this.fields)
    if (this.fields[n].hasValue())
      values[this.fields[n].getName()] = this.fields[n].getValue();
  return values;
};

Form.prototype.getFieldByName = function (name) {
  return _.find(this.fields, function (field) {
    return field.getName() === name;
  });
};

module.exports = Form;
