'use strict';

const Field = require('./Field');

class Checkbox extends Field {

    arm() {
        this.element.on('change.fw', () => this.blur());
        this.element.parent().on('click.fw', () => {
            setTimeout(() => this.validate(), 50);
        });
    }

    static applies($field, fieldData) {
        return $field.is('[type="checkbox"]');
    }
}

module.exports = Checkbox;