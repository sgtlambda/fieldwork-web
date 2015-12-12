'use strict';

const Field = require('./Field');

class Button extends Field {

    constructor(form, $field, fieldData) {
        super(form, $field, fieldData);
        this.clicked = false;
    }

    arm() {
        return super.arm();
        this.on({
            click: () => (this.clicked = true)
        });
    }

    static applies($field, fieldData) {
        return fieldData.isButton;
    }
}

module.exports = Button;