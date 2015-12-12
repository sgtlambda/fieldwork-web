'use strict';

const _     = require('lodash');
const Field = require('./Field');

class Select extends Field {

    arm() {
        var options = _.assign(fieldData.select2, {
            containerCssClass: 'fw-select2'
        });
        this.element.select2(options);
        var fixWidth = () => this.element.next('.select2').css('width', '');
        setTimeout(fixWidth, 1);
        setTimeout(fixWidth, 500);
    }

    static applies($field, fieldData) {
        return this.element.is('select') && fieldData.select2;
    }
}

module.exports = Select;