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

    describe('Tile.getCheckerAsHTML()', function () {
        it('should return checker as HTML', function () {
            let expectedCheckerAsHTML = '<div class="dot red"></div>';
            tile.addChecker(101, 'red');
            assert.equal(tile.getCheckerAsHTML(), expectedCheckerAsHTML);
        })
    });

    describe('Tile.getCheckerAsHTML()', function () {
        it('should return checker as HTML', function () {
            let expectedCheckerAsHTML = '<div class="dot blue"></div>';
            tile.addChecker(102, 'blue');
            assert.equal(tile.getCheckerAsHTML(), expectedCheckerAsHTML);
        })
    });

    describe('Tile.getCheckerAsHTML(), checker not set', function () {
        it('should return checker as HTML', function () {
            let expectedCheckerAsHTML = '';
            assert.equal(tile.getCheckerAsHTML(), expectedCheckerAsHTML);
        })
    });

    describe('Tile.getCheckerID()', function () {
        it('should return checker ID', function () {
            let expectedCheckerID = '';
            assert.equal(tile.getCheckerID(), expectedCheckerID);
        })
    });

    describe('Tile.getCheckerID()', function () {
        it('should return checker ID', function () {
            let expectedCheckerID = '100';
            tile.addChecker(100, 'blue');
            assert.equal(tile.getCheckerID(), expectedCheckerID);
        })
    });

    describe('Tile.getCheckerID()', function () {
        it('should return checker ID', function () {
            let expectedCheckerID = '101';
            tile.addChecker(101, 'blue');
            assert.equal(tile.getCheckerID(), expectedCheckerID);
        })
    });


    describe('Tile.getCheckerTeam()', function () {
        it('should return checker team', function () {
            let expectedCheckerTeam = 'blue';
            tile.addChecker(101, 'blue');
            assert.equal(tile.getCheckerTeam(), expectedCheckerTeam);
        })
    });

    describe('Tile.getCheckerTeam()', function () {
        it('should return checker team', function () {
            let expectedCheckerTeam = 'red';
            tile.addChecker(101, 'red');
            assert.equal(tile.getCheckerTeam(), expectedCheckerTeam);
        })
    });

    describe('Tile.getCheckerTeam(), checker not set', function () {
        it('should return checker team', function () {
            let expectedCheckerTeam = '';
            assert.equal(tile.getCheckerTeam(), expectedCheckerTeam);
        })
    });



    describe('Tile.getCheckerKing(), checker not set', function () {
        it('should return checker king status', function () {
            let expectedCheckerKing = false;
            assert.equal(tile.getCheckerKing(), expectedCheckerKing);
        })
    });

    describe('Tile.getCheckerKing(), checker set', function () {
        it('should return checker king status', function () {
            let expectedCheckerKing = true;
            tile.addChecker(101, 'red').makeCheckerKing();
            assert.equal(tile.getCheckerKing(), expectedCheckerKing);
        })
    });



    describe('Tile.removeChecker()', function () {
        it('should set checker as undefined', function () {
            tile.addChecker(101, 'red');
            tile.removeChecker();
            assert.equal(tile.checker, undefined);
        })
    });


    describe('Tile.placeChecker()', function () {
        it('should set checker as checker input', function () {
            let checker = new Checker(101, 'red');
            tile.placeChecker(checker);
            assert.equal(JSON.stringify(tile.checker),JSON.stringify(checker));
        })
    });

    describe('Tile.placeChecker()', function () {
        it('should set checker as checker input', function () {
            let checker = new Checker(100, 'blue');
            tile.placeChecker(checker);
            assert.equal(JSON.stringify(tile.checker),JSON.stringify(checker));
        })
    });


    describe('Tile.makeCheckerKing()', function () {
        it('should set checker as checker king', function () {
            let checker = new Checker(100, 'blue');
            tile.placeChecker(checker);
            tile.makeCheckerKing();
            assert.equal(tile.checker.isKing, true);
        })
    });

    describe('Tile.makeCheckerKing(), checker not set', function () {
        it('should set checker as checker king', function () {
            let checker = new Checker(100, 'blue');
            tile.makeCheckerKing();
            assert.equal(tile.checker, undefined);
        })
    });



    describe('Tile.isOccupied(), checker not set', function () {
        it('should return true if checker is set', function () {
            let checker = new Checker(100, 'blue');
            assert.equal(tile.isOccupied(), false);
        })
    });

    describe('Tile.isOccupied(), set', function () {
        it('should return true if checker is set', function () {
            let checker = new Checker(101, 'red');
            tile.placeChecker(checker);
            assert.equal(tile.isOccupied(), true);
        })
    });
});
