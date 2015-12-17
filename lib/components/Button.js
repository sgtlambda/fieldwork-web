'use strict';

const Field = require('./Field');

class Button extends Field {

    constructor($field, parameters) {
        super($field, parameters);
        this.clicked = false;
    }

    arm() {
        return super.arm();
        this.on({
            click: () => (this.clicked = true)
        });
    }

    submitAborted() {
        this.clicked = false;
    }

    collect() {
        return this.clicked;
    }

    static applies($field, parameters) {
        return parameters.isButton;
    }
}

module.exports = Button;