'use strict';

const jQuery = typeof jQuery == 'undefined' ? require('jquery') : jQuery;

require('./common/tooltips');
require('./transform')(jQuery, Fieldwork);

if (window && !Object.prototype.hasOwnProperty.call(window, 'Fieldwork'))
    window.Fieldwork = Fieldwork;

module.exports = Fieldwork;