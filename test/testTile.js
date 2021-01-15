const assert = require('chai').assert;
const ActiveGame = require('../app/objects/ActiveGame');
const Tile = require('../app/objects/Tile');
const Checker = require('../app/objects/Checker');

describe('hooks', function () {
    // let activeGame;
    let tile;
    let checker;

    beforeEach(function () {
        // activeGame = new ActiveGame('123', 'P1ID', 'P2ID');
        tile = new Tile();
        // checker = new Checker(100, 'red');
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

    describe('Tile.addCoodinateID()', function () {
        it('should set Tile.CoodinateID to equal y & x input and return this.tile', function () {
            let y = 5;
            let x = 6;
            tile.addCoodinateID(y,x);
            assert.equal(tile.CoodinateID, '5,6');
            assert.equal(tile, tile.addCoodinateID(y, x));
        })
    });

    describe('Tile.addColour()', function () {
        it('should set Tile.colour to equal input and return this.tile', function () {
            let colour = 'red';

            tile.addColour(colour);
            assert.equal(tile.colour, colour);
            assert.equal(tile, tile.addColour(colour));
        })
    });

    describe('Tile.addColour()', function () {
        it('should set Tile.colour to equal input and return this.tile', function () {
            let colour = 'blue';

            tile.addColour(colour);
            assert.equal(tile.colour, colour);
            assert.equal(tile, tile.addColour(colour));
        })
    });

    describe('Tile.addColour()', function () {
        it('should set Tile.colour to equal input and return this.tile', function () {
            let colour = 'green';

            tile.addColour(colour);
            assert.equal(tile.colour, colour);
            assert.equal(tile, tile.addColour(colour));
        })
    });


    describe('Tile.addChecker()', function () {
        it('should set Tile.checker to equal checker input and return this.tile', function () {
            tile.addChecker(100, 'red');

            assert.equal(tile.checker.id, 100);
            assert.equal(tile.checker.team, 'red');

            assert.equal(tile, tile.addChecker(checker));
        })
    });

    describe('Tile.addChecker()', function () {
        it('should set Tile.checker to equal checker input and return this.tile', function () {
            tile.addChecker(101, 'blue');

            assert.equal(tile.checker.id, 101);
            assert.equal(tile.checker.team, 'blue');

            assert.equal(tile, tile.addChecker(checker));
        })
    });

    describe('Tile.addChecker()', function () {
        it('should set Tile.checker to equal checker input and return this.tile', function () {
            tile.addChecker(12213123101, 'hduiajndasmsakl');

            assert.equal(tile.checker.id, 12213123101);
            assert.equal(tile.checker.team, 'hduiajndasmsakl');

            assert.equal(tile, tile.addChecker(checker));
        })
    });

    describe('Tile.getBoardTileAsHTML()', function () {
        it('should return board tile as HTML', function () {
            let colour = 'undefined';
            let isOccupied = '';
            let coordinateID = 'undefined';
            let checkerAsHTML = '<div class="dot red king></div>';

            // let expectedBoardTileHTML = '<div class="boardTile ' + colour + ' ' + isOccupied + '" id="' + coordinateID + '">';

            let expectedBoardTileHTML = '<div class="boardTile ' + colour + ' ' + isOccupied +'" id="' + coordinateID + '">' +
                coordinateID +
                '</div>';

            assert.equal(tile.getBoardTileAsHTML(), expectedBoardTileHTML);
        })
    });

    describe('Tile.getBoardTileAsHTML()', function () {
        it('should return board tile as HTML', function () {
            let colour = 'black';
            let isOccupied = 'occupied';
            let coordinateID = '1,2';
            let checkerAsHTML = '<div class="dot red king"></div>';

            tile.addColour(colour);
            tile.addChecker(100, 'red');
            tile.checker.makeKing();
            tile.addCoodinateID(1,2);

            // let expectedBoardTileHTML = '<div class="boardTile ' + colour + ' ' + isOccupied + '" id="' + coordinateID + '">';

            let expectedBoardTileHTML = '<div class="boardTile ' + colour + ' ' + isOccupied +'" id="' + coordinateID + '">' +
                coordinateID +
                checkerAsHTML +
                '</div>';

            assert.equal(tile.getBoardTileAsHTML(), expectedBoardTileHTML);
        })
    });

    
});
