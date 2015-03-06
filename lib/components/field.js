var $ = require('jquery');

function Field(form, fieldData) {
    this.form = form;
    this.element = $("#" + fieldData.id);
    this.touched = false;
    this.valid = false;
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
            field.touched = true;
            field.element.addClass("input-touched");
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
}

Field.prototype.blur = function () {
    if (!this.touched) return;
    this.sanitize(false);
    this.validate();
};

Field.prototype.keyup = function (e, field) {
    //this.sanitize(true);
};

Field.prototype.cancelSubmit = function () {
    this.clicked = false;
};

Field.prototype.validate = function () {
    var val = this.getValue();
    var valid = true;
    for (var v in this.validators)
        if ((Fieldwork.validators[this.validators[v].method])) {
            if (this.element.attr("placeholder") === val) val = ""; // TODO this is not quite right
            if (!( (Fieldwork.validators[this.validators[v].method])(this, this.validators[v]) )) {
                this.setInvalid(this.validators[v].error);
                valid = false;
                break;
            }
        }
    if (valid)
        this.setValid();
    return valid;
};

Field.prototype.sanitize = function (realtime) {
    var val = this.getValue();
    var oldVal = val;
    for (var s in this.sanitizers)
        if ((Fieldwork.sanitizers[this.sanitizers[s].method]))
            if (!realtime || this.sanitizers[s].realtime)
                val = (Fieldwork.sanitizers[this.sanitizers[s].method])(val, this.sanitizers[s]);
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