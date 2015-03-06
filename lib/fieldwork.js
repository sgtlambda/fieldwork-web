var _         = require('lodash'),
    $         = require('jquery'),
    tooltips  = require('./tooltips'),
    Validator = require('./validator'),
    Form      = require('./form'),
    Field     = require('./field');

var Fieldwork = {
    AJAXCALLBACK:     0,
    SUBMITCALLBACK:   1,
    i:                {
        callbacks: []
    },
    //validators for fields
    validators:       {
        regex:    function (field, validator) {
            var match = /\/(.*)\/([igm]*)/.exec(validator.pattern);
            return field.getValue().match(new RegExp(match[1], match[2]));
        },
        checkbox: function (field, validator) {
            return validator.checked === field.element.is(":checked");
        }
    },
    //validators for forms. naming should be improved
    formValidators:   {
        radio: function (form, validator) {
            var name = validator.inflictedFields[0];
            return form.element.find('[name="' + name + '"]:checked').length > 0;
        }
    },
    sanitizers:       {
        uppercase:  function (value, sanitizer) {
            return value.toUpperCase();
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
    },
    registerCallback: function (slug, on, fn) {
        this.i.callbacks.push({
            slug: slug,
            on:   on,
            fn:   fn
        });
        return this;
    },
    retrieveCallback: function (slug, on) {
        return _.findWhere(this.i.callbacks, {
            slug: slug,
            on:   on
        });
    },
    performCallback:  function (slug, on, form, data, e) {
        var callback = this.retrieveCallback(slug, on);
        if (callback !== undefined)
            callback.fn(form, data, e);
    },
    ajaxSubmitForm:   function (form) {
        $.ajax({
            url:      '/ajax/' + form.ajaxMethod + '/',
            data:     form.getValues(),
            dataType: 'json',
            type:     'POST',
            success:  function (data) {
                Fieldwork.performCallback(
                    form.ajaxMethod,
                    Fieldwork.AJAXCALLBACK,
                    form,
                    data, {
                        type:    Fieldwork.AJAXCALLBACK,
                        instant: false
                    }
                );
            },
            error:    function () {
                if (console)
                    console.log('Fieldwork Ajax encountered an error');
            }
        });
    }
};

Fieldwork.Validator = Validator;
Fieldwork.Form = Form;
Fieldwork.Field = Field;

$.fn.fieldwork = function (formData) {
    new Form($(this), formData);
};

Fieldwork.processForms = function () {
    $(".invisible-target-button:not(.processed)").each(function () {
        var $this = $(this);
        $this.addClass('processed');
        $("#target-" + $this.attr('id')).on({
            click: function () {
                $this.click();
            }
        });
    });
};

$(function () {
    $('[data-input-mask]').each(function () {
        var $this = $(this);
        var mask = $this.data('input-mask');
        $this.simpleMask({
            mask: mask
        });
    });
    Fieldwork.processForms();
});

module.exports = Fieldwork;