const assert = require('chai').assert;
const ActiveGame = require('../app/objects/ActiveGame');
const Tile = require('../app/objects/Tile');
const Checker = require('../app/objects/Checker');

describe('hooks', function () {
    let checker;

    beforeEach(function () {
        checker = new Checker(100, 'red');
    });

    describe('Tile.addCoodinateID()', function () {
        it('should set Tile.CoodinateID to equal y & x input and return this.tile', function () {
            let y = 0;
            let x = 0;
            tile.addCoodinateID(y,x);
            assert.equal(tile.CoodinateID, '0,0');
            assert.equal(tile, tile.addCoodinateID(y, x));
        })
    });

});
