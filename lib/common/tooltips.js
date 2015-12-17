'use strict';

const jQuery = typeof jQuery == 'undefined' ? require('jquery') : jQuery;
const _      = require('lodash');

var FwTooltips = {

    active:        -1,
    activeTooltip: -1,
    container:     0,
    trackInterval: -1,

    /**
     * Finds the most relevant element to be tracked
     * @param elmt
     * @returns {*}
     */
    resolveTrackingElement: function (elmt) {
        if (elmt.is('[type="checkbox"]'))
            return elmt.parent();
        if (elmt.is('select.initialized')) {
            var $ul = elmt.prev('ul');
            if ($ul.length)
                return jQuery('[data-activates=' + $ul.attr('id') + ']');
        }
        return elmt;
    },

    /**
     * Positions the tooltip underneath the element
     * @param {jQuery} tooltip
     * @param {jQuery} elmt
     */
    positionTooltip: function (tooltip, elmt) {
        var elmtOffset = this.resolveTrackingElement(elmt).offset();
        tooltip.css({
            top:  elmtOffset.top + elmt.outerHeight(),
            left: Math.round(elmtOffset.left + elmt.outerWidth() / 2 - tooltip.outerWidth() / 2)
        });
    },

    track: function () {
        if (!this.resolveTrackingElement(this.active).is(":visible"))
            this.dismiss();
        else
            this.positionTooltip(this.activeTooltip, this.active);
    },

    startTrack: function () {
        this.trackInterval = window.setInterval(function () {
            FwTooltips.track();
        }, 30);
        jQuery(document).on({
            'scroll.jt': function () {
                FwTooltips.track();
            }
        });
    },

    dismiss: function () {
        if (this.trackInterval !== -1) {
            window.clearInterval(this.trackInterval);
            this.trackInterval = -1;
        }
        jQuery(document).off('.jt');
        if (this.activeTooltip !== -1) {
            this.activeTooltip.stop().animate({
                opacity: 0
            }, {
                duration: 200,
                complete: function () {
                    jQuery(this).remove();
                }
            });
        }
        this.active = this.activeTooltip = -1;
    },

    isActive: function (elmt) {
        if (this.active !== -1)
            return this.active[0] === elmt[0];
        return false;
    }
};

jQuery.fn.linkTooltip = function (html, showOn, hideOn) {
    this.data('jt', {
        html: html
    });
    _.forEach(showOn, (showOnEvent) => this.on(showOnEvent + '.fw', () => jQuery(this).showTooltip()), this);
    _.forEach(hideOn, (hideOnEvent) => this.on(hideOnEvent + '.fw', () => jQuery(this).hideTooltip()), this);
};

jQuery.fn.unlinkTooltip = function () {
    var elmt = this;
    elmt.hideTooltip();
    elmt.removeData('jt');
    elmt.removeData('jt-tt');
    elmt.off('.fw');
};

jQuery.fn.showTooltip = function () {
    var elmt = this;
    if (!FwTooltips.isActive(elmt)) {
        if (FwTooltips.active !== -1)
            FwTooltips.dismiss();
        FwTooltips.active = elmt;
        if (_.isUndefined(elmt.data('jt')))
            return;
        var newTooltip = jQuery('<div class="jt-wrapper"><div class="jt-arrow"></div><div class="jt-inner">' + elmt.data('jt').html + '</div></div>').css({
            opacity: 0
        }).stop().animate({
            opacity: 0.95
        }, {
            duration: 200
        });
        jQuery('body').append(newTooltip);
        FwTooltips.positionTooltip(newTooltip, elmt);
        FwTooltips.activeTooltip = newTooltip;
        FwTooltips.startTrack();
    }
    return this;
};

jQuery.fn.hideTooltip = function () {
    var elmt = this;
    if (FwTooltips.isActive(elmt))
        FwTooltips.dismiss();
    return this;
};

module.exports = FwTooltips;