'use strict';

/**
 * Registers the jQuery transform function
 * @param $
 * @param Fieldwork
 */
module.exports = function ($, Fieldwork) {

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
};