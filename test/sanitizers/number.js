'use strict';

require('./../support/bootstrap');

var number = require('./../../lib/sanitizers/number');

describe('Number sanitizer', function () {

    it('sanitize float values', function () {

        var sanitizer = {
            radixes:   ['.', ','],
            precision: 0.01
        };

        number('0.a1', sanitizer).should.equal('0.1');
        number('.1', sanitizer).should.equal('0.1');
        number('a,777', sanitizer).should.equal('0.78');
        number('', sanitizer).should.equal('');
        number('0.565464', sanitizer).should.equal('0.57');

    });

    it('should round values', function () {

        var sanitizer = {
            radixes:   ['.', ','],
            precision: 5
        };

        number('7', sanitizer).should.equal('5');
        number('1-8!!%', sanitizer).should.equal('20');

    });

});