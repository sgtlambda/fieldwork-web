var $ = require('jquery');
var events = require('events');

var core = {

    /**
     * Global event emitter instance for the fieldwork core
     */
    ee:             new events.EventEmitter(),

    //validators for fields
    validators:     {
        regex:    function (field, validator) {
            var match = /\/(.*)\/([igm]*)/.exec(validator.pattern);
            return field.getValue().match(new RegExp(match[1], match[2]));
        },
        checkbox: function (field, validator) {
            return validator.checked === field.element.is(":checked");
        },
        radio:    function (field, validator) {
            var checkedInput = field.element.find('input[type="radio"]:checked');
            if (!checkedInput.length) return false;
            return validator.any ? true : checkedInput.value() === validator.value;
        }
    },

    //validators for forms. naming should be improved
    formValidators: {
        radio: function (form, validator) {
            var name = validator.inflictedFields[0];
            return form.element.find('[name="' + name + '"]:checked').length > 0;
        }
    },

    hooks:          {
        post_instantiate_form: [
            function setMasks(form) {
                form.element.find('[data-input-mask]').each(function () {
                    var $this = $(this);
                    var mask = $this.data('input-mask');
                    $this.simpleMask({
                        mask: mask
                    });
                });
            }
        ]
    },

    /**
     * Calls the given hook with the provided array of arguments
     * @param {string} hook
     * @param {Array} args
     */
    callHook:       function (hook, args) {
        if (this.hooks.hasOwnProperty(hook)) {
            _.each(this.hooks[hook], function (func) {
                func.apply(this, args);
            });
        }
    },

    sanitizers:     {
        uppercase:  function (value, sanitizer) {
            return value.toUpperCase();
        },
        lowercase:  function (value, sanitizer) {
            return value.toLowerCase();
        },
        capitalize: function (value, sanitizer) {
            return value.replace(/(?:^|\s)\S/g, function (a) {
                return a.toUpperCase();
            });
        },
        regexp:     function (value, sanitizer) {
            var patt = new RegExp(sanitizer.regexp, sanitizer.regexpmod);
            return value.replace(patt, sanitizer.replace);
        },
        iban:       function (value, sanitizer) {
            value = value.replace(/\s/g, '');
            if (!/[A-Z]{2}[0-9]{2}[A-Z]{4}/.test(value))
                return value;
            var chunks = value.match(/.{1,4}/g);
            if (chunks === null)
                return "";
            else
                return chunks.join(" ");
        }
    }
};

module.exports = core;