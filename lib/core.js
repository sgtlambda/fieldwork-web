'use strict';

var $ = typeof jQuery == 'undefined' ? require('jquery') : jQuery;
var _ = require('lodash');
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

    sanitizers: {
        uppercase:  require('./sanitizers/uppercase'),
        lowercase:  require('./sanitizers/lowercase'),
        capitalize: require('./sanitizers/capitalize'),
        regexp:     require('./sanitizers/regex'),
        iban:       require('./sanitizers/iban'),
        number:     require('./sanitizers/number.js')
    }
};

module.exports = core;