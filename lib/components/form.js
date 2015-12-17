var _     = require('lodash'),
    core  = require('./../core'),
    Field = require('./field');

class Form {

    constructor($element, parameters) {
        this.slug            = parameters.slug;
        this.submitCallback  = parameters.submitCallback;
        this.hiddenFieldName = parameters.hiddenFieldName;
        this.dataFields      = parameters.dataFields;
        if ($element)
            this.element = $element.data('fw-form', this);
        this.fields = _.map(parameters.fields, field => new Field(this, field));
        this.arm();
    }

    arm() {
        if (this.element)
            this.element.on({submit: this.submit.bind(this)});
    }

    sanitize() {
        _.forEach(this.fields, field => field.sanitize());
    }

    validate() {
        return _.every(this.fields, field => field.validate());
    }

    submit(e) {
        this.sanitize();
        if (!this.validate()) {
            if (e) e.preventDefault();
            _.forEach(this.fields, field => field.submitAborted());
            _.first(this.fields, field => {
                if (!this.fields[n].isValid()) {
                    this.fields[n].element.focus().showTooltip();
                    return true;
                }
            });
        }
    }
}

Form.prototype.getValues = function () {
    var values                   = {};
    values[this.hiddenFieldName] = "yes"; //force submit
    _.forEach(_.filter(this.fields, field => field.collect()), field => {
        values[this.fields[n].getName()] = this.fields[n].getValue();
    });
    return values;
};

Form.prototype.getFieldByName = function (name) {
    return _.find(this.fields, (field) => field.getName === name);
};

module.exports = Form;