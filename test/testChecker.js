const assert = require('chai').assert;
const ActiveGame = require('../app/objects/ActiveGame');
const Tile = require('../app/objects/Tile');
const Checker = require('../app/objects/Checker');

describe('hooks', function () {
    let checker;

    beforeEach(function () {
        checker = new Checker(100, 'red');
    });

    describe('Checker.getAsHTML()', function () {
        it('should return checker as HTML', function () {
            let expectedCheckerHTML = '<div class="dot red"></div>';

            assert.equal(checker.getAsHTML(), expectedCheckerHTML);
        })
    });

    describe('Checker.getAsHTML(), checker is king', function () {
        it('should return checker as HTML', function () {
            let expectedCheckerHTML = '<div class="dot red king"></div>';
            checker.isKing = true;
            assert.equal(checker.getAsHTML(), expectedCheckerHTML);
        })
    });


    describe('Checker.makeKing()', function () {
        it('should set isKing true', function () {
            checker.makeKing();
            assert.equal(checker.isKing, true);
        })
    });

    describe('Checker.makeKing()', function () {
        it('should set isKing true', function () {
            assert.equal(checker.isKing, false);
        })
    });

});
