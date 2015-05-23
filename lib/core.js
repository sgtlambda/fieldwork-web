var $ = require('jquery');
var events = require('events');

var core = {

    /**
     * Global event emitter instance for the fieldwork core
     */
    ee:             new events.EventEmitter(),

    //validators for fields
    validators:     {
        regex:    require('./validators/regex'),
        checkbox: require('./validators/checkbox'),
        radio:    require('./validators/radio')
    },

    //validators for forms. naming should be improved
    formValidators: {},

    hooks: {
        post_instantiate_form: [
            function setMasks(form) {
                if (form.element)
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
    callHook: function (hook, args) {
        if (this.hooks.hasOwnProperty(hook)) {
            _.each(this.hooks[hook], function (func) {
                func.apply(this, args);
            });
        }
    },

    sanitizers: {
        uppercase:  require('./sanitizers/uppercase'),
        lowercase:  require('./sanitizers/lowercase'),
        capitalize: require('./sanitizers/capitalize'),
        regexp:     require('./sanitizers/regex'),
        iban:       require('./sanitizers/iban'),
    }
};

module.exports = core;