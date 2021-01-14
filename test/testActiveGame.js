const assert = require('chai').assert;
const ActiveGame = require('../app/objects/ActiveGame');

describe('hooks', function () {
    let activeGame;
    let ACTIVE_GAMES = [];

    beforeEach(function () {
        activeGame = new ActiveGame('123', 'P1ID', 'P2ID');
    });

    describe('ActiveGame.initialiseBoardState()', function () {
        let properlyInitialisedBoardState = '[[{"CoodinateID":"0,0","colour":"white"},{"CoodinateID":"0,1","colour":"black","checker":{"id":0,"team":"red","isKing":false}},{"CoodinateID":"0,2","colour":"white"},{"CoodinateID":"0,3","colour":"black","checker":{"id":1,"team":"red","isKing":false}},{"CoodinateID":"0,4","colour":"white"},{"CoodinateID":"0,5","colour":"black","checker":{"id":2,"team":"red","isKing":false}},{"CoodinateID":"0,6","colour":"white"},{"CoodinateID":"0,7","colour":"black","checker":{"id":3,"team":"red","isKing":false}}],[{"CoodinateID":"1,0","colour":"black","checker":{"id":4,"team":"red","isKing":false}},{"CoodinateID":"1,1","colour":"white"},{"CoodinateID":"1,2","colour":"black","checker":{"id":5,"team":"red","isKing":false}},{"CoodinateID":"1,3","colour":"white"},{"CoodinateID":"1,4","colour":"black","checker":{"id":6,"team":"red","isKing":false}},{"CoodinateID":"1,5","colour":"white"},{"CoodinateID":"1,6","colour":"black","checker":{"id":7,"team":"red","isKing":false}},{"CoodinateID":"1,7","colour":"white"}],[{"CoodinateID":"2,0","colour":"white"},{"CoodinateID":"2,1","colour":"black","checker":{"id":8,"team":"red","isKing":false}},{"CoodinateID":"2,2","colour":"white"},{"CoodinateID":"2,3","colour":"black","checker":{"id":9,"team":"red","isKing":false}},{"CoodinateID":"2,4","colour":"white"},{"CoodinateID":"2,5","colour":"black","checker":{"id":10,"team":"red","isKing":false}},{"CoodinateID":"2,6","colour":"white"},{"CoodinateID":"2,7","colour":"black","checker":{"id":11,"team":"red","isKing":false}}],[{"CoodinateID":"3,0","colour":"black"},{"CoodinateID":"3,1","colour":"white"},{"CoodinateID":"3,2","colour":"black"},{"CoodinateID":"3,3","colour":"white"},{"CoodinateID":"3,4","colour":"black"},{"CoodinateID":"3,5","colour":"white"},{"CoodinateID":"3,6","colour":"black"},{"CoodinateID":"3,7","colour":"white"}],[{"CoodinateID":"4,0","colour":"white"},{"CoodinateID":"4,1","colour":"black"},{"CoodinateID":"4,2","colour":"white"},{"CoodinateID":"4,3","colour":"black"},{"CoodinateID":"4,4","colour":"white"},{"CoodinateID":"4,5","colour":"black"},{"CoodinateID":"4,6","colour":"white"},{"CoodinateID":"4,7","colour":"black"}],[{"CoodinateID":"5,0","colour":"black","checker":{"id":0,"team":"blue","isKing":false}},{"CoodinateID":"5,1","colour":"white"},{"CoodinateID":"5,2","colour":"black","checker":{"id":1,"team":"blue","isKing":false}},{"CoodinateID":"5,3","colour":"white"},{"CoodinateID":"5,4","colour":"black","checker":{"id":2,"team":"blue","isKing":false}},{"CoodinateID":"5,5","colour":"white"},{"CoodinateID":"5,6","colour":"black","checker":{"id":3,"team":"blue","isKing":false}},{"CoodinateID":"5,7","colour":"white"}],[{"CoodinateID":"6,0","colour":"white"},{"CoodinateID":"6,1","colour":"black","checker":{"id":4,"team":"blue","isKing":false}},{"CoodinateID":"6,2","colour":"white"},{"CoodinateID":"6,3","colour":"black","checker":{"id":5,"team":"blue","isKing":false}},{"CoodinateID":"6,4","colour":"white"},{"CoodinateID":"6,5","colour":"black","checker":{"id":6,"team":"blue","isKing":false}},{"CoodinateID":"6,6","colour":"white"},{"CoodinateID":"6,7","colour":"black","checker":{"id":7,"team":"blue","isKing":false}}],[{"CoodinateID":"7,0","colour":"black","checker":{"id":8,"team":"blue","isKing":false}},{"CoodinateID":"7,1","colour":"white"},{"CoodinateID":"7,2","colour":"black","checker":{"id":9,"team":"blue","isKing":false}},{"CoodinateID":"7,3","colour":"white"},{"CoodinateID":"7,4","colour":"black","checker":{"id":10,"team":"blue","isKing":false}},{"CoodinateID":"7,5","colour":"white"},{"CoodinateID":"7,6","colour":"black","checker":{"id":11,"team":"blue","isKing":false}},{"CoodinateID":"7,7","colour":"white"}]]';

        it('should set ActiveGame.boardState to equal a properly set up board state', function () {
            activeGame.initialiseBoardState();
            assert.equal(JSON.stringify(activeGame.boardState), properlyInitialisedBoardState);
        })
    });


    describe('ActiveGame.determineGameover(), no reds', function () {
        it('should set gameOver = True, winningTeam = "Blue" and return true if no red pieces are in play', function () {
            activeGame.row0.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });
            activeGame.row1.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });
            activeGame.row2.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });

            assert.equal(activeGame.determineGameover(), true);
            assert.equal(activeGame.winningTeam, 'Blue');
            assert.equal(activeGame.gameOver, true);
        })
    });

    describe('ActiveGame.determineGameover(), some reds', function () {
        it('should set gameOver = False, winningTeam = "" and return False if some red pieces are in play', function () {
            activeGame.row0.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });

            assert.equal(activeGame.determineGameover(), false);
            assert.equal(activeGame.winningTeam, '');
            assert.equal(activeGame.gameOver, false);
        })
    });

    describe('ActiveGame.determineGameover(), no blues', function () {
        it('should set gameOver = True, winningTeam = "Red" and return true if no blue pieces are in play', function () {
            activeGame.row5.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });
            activeGame.row6.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });
            activeGame.row7.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });

            assert.equal(activeGame.determineGameover(), true);
            assert.equal(activeGame.winningTeam, 'Red');
            assert.equal(activeGame.gameOver, true);
        })
    });

    describe('ActiveGame.determineGameover(), some blues', function () {
        it('should set gameOver = False, winningTeam = "" and return False if some blue pieces are in play', function () {
            activeGame.row7.forEach(function (tile) {
                if(tile.isOccupied()){
                    tile.removeChecker();
                }
            });

            assert.equal(activeGame.determineGameover(), false);
            assert.equal(activeGame.winningTeam, '');
            assert.equal(activeGame.gameOver, false);
        })
    });


    describe('ActiveGame.switchCurrentTurn(), current turn is red', function () {
        it('should set currentTurn = "blue" if currentTurn is "red" and multi-capture play is false', function () {
            activeGame.currentTurn = 'red';
            activeGame.switchCurrentTurn();

            assert.equal(activeGame.currentTurn, 'blue');
        })
    })

    describe('ActiveGame.switchCurrentTurn(), current turn is blue', function () {
        it('should set currentTurn = "red" if currentTurn is "blue" and multi-capture play is false', function () {
            activeGame.currentTurn = 'blue';
            activeGame.switchCurrentTurn();

            assert.equal(activeGame.currentTurn, 'red');
        })
    })

    describe('ActiveGame.switchCurrentTurn(), making a multi-capture play is true', function () {
        it('should not alter current turn if multi-capture play is true', function () {
            activeGame.currentTurn = 'red';
            activeGame.makingAMultiCapturePlay = true;
            activeGame.switchCurrentTurn();

            assert.equal(activeGame.currentTurn, 'red');
        })
    })


    describe('ActiveGame.makeKings(), make red kings', function () {
        it('should set red checker = king if red checker is on row 7', function () {
            activeGame.row7[0].removeChecker();

            activeGame.row7[0].addChecker('1', 'red');

            activeGame.makeKings();

            assert.equal(activeGame.row7[0].getCheckerKing(), true);
        })
    });

    describe('ActiveGame.makeKings(), make blue kings', function () {
        it('should set blue checker = king if blue checker is on row 0', function () {
            activeGame.row0[1].removeChecker();

            activeGame.row0[1].addChecker('1', 'blue');

            activeGame.makeKings();

            assert.equal(activeGame.row0[1].getCheckerKing(), true);
        })
    });

    describe('ActiveGame.makeKings(), make no kings', function () {
        it('should set no checker = king if neither teams occupy and oppposing teams rear row', function () {


            assert.equal(activeGame.row0[1].getCheckerKing(), false);
            assert.equal(activeGame.row7[0].getCheckerKing(), false);
        })
    });

    describe('ActiveGame.doAttackingMove(), 0,1 to 2,3 / downward rightward', function () {
        it('should place checker on ending tile, remove checker from starting tile and remove checker from tile diagonally between the two', function () {
            let currentPosition = {
                y : 0,
                x : 1
            };

            let middlePosition = {
                y : 1,
                x : 2
            };

            let requestedPosition = {
                y : 2,
                x : 3
            };

            let startingTileCheckerID = activeGame.boardState[currentPosition.y][currentPosition.x].getCheckerID();

            activeGame.doAttackingMove(currentPosition, requestedPosition);
            //starting tile is not occupied
            assert.equal(activeGame.boardState[currentPosition.y][currentPosition.x].isOccupied(), false);
            //ending tile is occupied
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
            //checker being moved is original checker
            assert.equal(startingTileCheckerID, activeGame.boardState[requestedPosition.y][requestedPosition.x].getCheckerID());
            //checker being attacked is deleted
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
        })
    });

    describe('ActiveGame.doAttackingMove(), 0,7 to 2,5 / downward leftward', function () {
        it('should place checker on ending tile, remove checker from starting tile and remove checker from tile diagonally between the two', function () {
            let currentPosition = {
                y : 0,
                x : 7
            };

            let middlePosition = {
                y : 1,
                x : 6
            };

            let requestedPosition = {
                y : 2,
                x : 5
            };

            let startingTileCheckerID = activeGame.boardState[currentPosition.y][currentPosition.x].getCheckerID();

            activeGame.doAttackingMove(currentPosition, requestedPosition);
            //starting tile is not occupied
            assert.equal(activeGame.boardState[currentPosition.y][currentPosition.x].isOccupied(), false);
            //ending tile is occupied
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
            //checker being moved is original checker
            assert.equal(startingTileCheckerID, activeGame.boardState[requestedPosition.y][requestedPosition.x].getCheckerID());
            //checker being attacked is deleted
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
        })
    });

    describe('ActiveGame.doAttackingMove(), 6,3 to 4,1 / upward leftward', function () {
        it('should place checker on ending tile, remove checker from starting tile and remove checker from tile diagonally between the two', function () {
            let currentPosition = {
                y : 6,
                x : 3
            };

            let middlePosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 4,
                x : 1
            };

            let startingTileCheckerID = activeGame.boardState[currentPosition.y][currentPosition.x].getCheckerID();

            activeGame.doAttackingMove(currentPosition, requestedPosition);
            //starting tile is not occupied
            assert.equal(activeGame.boardState[currentPosition.y][currentPosition.x].isOccupied(), false);
            //ending tile is occupied
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
            //checker being moved is original checker
            assert.equal(startingTileCheckerID, activeGame.boardState[requestedPosition.y][requestedPosition.x].getCheckerID());
            //checker being attacked is deleted
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
        })
    });

    describe('ActiveGame.doAttackingMove(), 7,2 to 5,4 / upward rightward', function () {
        it('should place checker on ending tile, remove checker from starting tile and remove checker from tile diagonally between the two', function () {
            let currentPosition = {
                y : 7,
                x : 2
            };

            let middlePosition = {
                y : 6,
                x : 3
            };

            let requestedPosition = {
                y : 5,
                x : 4
            };

            let startingTileCheckerID = activeGame.boardState[currentPosition.y][currentPosition.x].getCheckerID();

            activeGame.doAttackingMove(currentPosition, requestedPosition);
            //starting tile is not occupied
            assert.equal(activeGame.boardState[currentPosition.y][currentPosition.x].isOccupied(), false);
            //ending tile is occupied
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
            //checker being moved is original checker
            assert.equal(startingTileCheckerID, activeGame.boardState[requestedPosition.y][requestedPosition.x].getCheckerID());
            //checker being attacked is deleted
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
        })
    });

    describe('ActiveGame.doTravelingMove(), 2,5 to 3,6 / downward rightward', function () {
        it('should replace checker at requested position with checker at current position, then delete checker at current position', function () {
            let currentPosition = {
                y : 2,
                x : 5
            };

            let requestedPosition = {
                y : 3,
                x : 6
            };

            let startingTileCheckerID = activeGame.boardState[currentPosition.y][currentPosition.x].getCheckerID();

            activeGame.doTravelingMove(currentPosition, requestedPosition);

            //starting tile is not occupied
            assert.equal(activeGame.boardState[currentPosition.y][currentPosition.x].isOccupied(), false);
            //ending tile is occupied
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
            //checker being moved is original checker
            assert.equal(startingTileCheckerID, activeGame.boardState[requestedPosition.y][requestedPosition.x].getCheckerID());
        })
    });

    describe('ActiveGame.doTravelingMove(), 2,5 to 3,6 / downward rightward', function () {
        it('should replace checker at requested position with checker at current position, then delete checker at current position', function () {
            let currentPosition = {
                y : 2,
                x : 5
            };

            let requestedPosition = {
                y : 3,
                x : 6
            };

            let startingTileCheckerID = activeGame.boardState[currentPosition.y][currentPosition.x].getCheckerID();

            activeGame.doTravelingMove(currentPosition, requestedPosition);

            //starting tile is not occupied
            assert.equal(activeGame.boardState[currentPosition.y][currentPosition.x].isOccupied(), false);
            //ending tile is occupied
            assert.equal(activeGame.boardState[requestedPosition.y][requestedPosition.x].isOccupied(), true);
            //checker being moved is original checker
            assert.equal(startingTileCheckerID, activeGame.boardState[requestedPosition.y][requestedPosition.x].getCheckerID());
        })
    });
});

