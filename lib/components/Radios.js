'use strict';

const Field = require('./Field');

class Radios extends Field {

    arm() {
        this.element.click(() => setTimeout(() => this.validate(), 50));
    }

    static applies($field, fieldData) {
        return $field.is('.radios-group');
    }
}

module.exports = Radios;