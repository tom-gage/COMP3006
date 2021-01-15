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

    describe('ActiveGame.doTravelingMove(), 5,2 to 6,1 / downward leftward', function () {
        it('should replace checker at requested position with checker at current position, then delete checker at current position', function () {
            let currentPosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 6,
                x : 1
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

    describe('ActiveGame.doTravelingMove(), 5,6 to 4,5 / upward leftward', function () {
        it('should replace checker at requested position with checker at current position, then delete checker at current position', function () {
            let currentPosition = {
                y : 5,
                x : 6
            };

            let requestedPosition = {
                y : 4,
                x : 5
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

    describe('ActiveGame.doTravelingMove(), 5,2 to 4,3 / upward rightward', function () {
        it('should replace checker at requested position with checker at current position, then delete checker at current position', function () {
            let currentPosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 4,
                x : 3
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


    describe('ActiveGame.canMakeValidAttackingMove(), blue attack forward', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 5,
                x : 4
            };

            activeGame.nextTurn = 'red';
            activeGame.row4[3].addChecker(100, 'red');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), blue attack forward', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 5,
                x : 4
            };

            activeGame.nextTurn = 'red';
            activeGame.row4[5].addChecker(100, 'red');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), red attack forward', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 2,
                x : 3
            };

            activeGame.nextTurn = 'blue';
            activeGame.row3[2].addChecker(100, 'blue');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), red attack forward', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 2,
                x : 5
            };

            activeGame.nextTurn = 'blue';
            activeGame.row3[6].addChecker(100, 'blue');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), red attack backward', function () {
        it('if checker can make valid attack, return true', function () {
            activeGame.initialiseBlankBoardState();

            let currentPosition = {
                y : 4,
                x : 3
            };

            activeGame.row4[3].addChecker(100, 'red').checker.makeKing();

            activeGame.nextTurn = 'blue';
            activeGame.row3[2].addChecker(101, 'blue');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), red attack backward', function () {
        it('if checker can make valid attack, return true', function () {
            activeGame.initialiseBlankBoardState();

            let currentPosition = {
                y : 4,
                x : 4
            };

            activeGame.row4[4].addChecker(100, 'red').checker.makeKing();

            activeGame.nextTurn = 'blue';
            activeGame.row3[5].addChecker(101, 'blue');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), blue attack backward', function () {
        it('if checker can make valid attack, return true', function () {
            activeGame.initialiseBlankBoardState();

            let currentPosition = {
                y : 4,
                x : 3
            };

            activeGame.row4[3].addChecker(100, 'blue').checker.makeKing();

            activeGame.nextTurn = 'red';
            activeGame.row5[2].addChecker(101, 'red');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), blue attack backward', function () {
        it('if checker can make valid attack, return true', function () {
            activeGame.initialiseBlankBoardState();

            let currentPosition = {
                y : 4,
                x : 3
            };

            activeGame.row4[3].addChecker(100, 'blue').checker.makeKing();

            activeGame.nextTurn = 'red';
            activeGame.row5[4].addChecker(101, 'red');

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), true);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), no red attack available', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 2,
                x : 1
            };

            activeGame.nextTurn = 'blue';

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), false);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), no blue attack available', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 5,
                x : 6
            };

            activeGame.nextTurn = 'red';

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), false);
        })
    });

    describe('ActiveGame.canMakeValidAttackingMove(), no attack available, starting tile empty', function () {
        it('if checker can make valid attack, return true', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            activeGame.nextTurn = 'red';

            assert.equal(activeGame.canMakeValidAttackingMove(currentPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), current tile is null', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : -1,
                x : -1
            };

            let requestedPosition = {
                y : 1,
                x : 1
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), requested tile is null', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 1
            };

            let requestedPosition = {
                y : 0,
                x : -1
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), ending tile is occupied', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 1
            };

            let requestedPosition = {
                y : 0,
                x : 3
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), starting tile not occupied', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 1,
                x : 1
            };

            let requestedPosition = {
                y : 3,
                x : 3
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacked tile does not exist', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 1
            };

            let requestedPosition = {
                y : 4,
                x : 3
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacked tile is on same team', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 1,
                x : 6
            };

            let requestedPosition = {
                y : 3,
                x : 4
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move blue forward left is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            let requestedPosition = {
                y : 2,
                x : 1
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'blue');
            activeGame.boardState[3][2].addChecker(101, 'red');
            activeGame.nextTurn = 'red';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move blue forward right is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            let requestedPosition = {
                y : 2,
                x : 5
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'blue');
            activeGame.boardState[3][4].addChecker(101, 'red');
            activeGame.nextTurn = 'red';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move blue backward right is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            let requestedPosition = {
                y : 6,
                x : 5
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'blue').checker.makeKing();
            activeGame.boardState[5][4].addChecker(101, 'red');
            activeGame.nextTurn = 'red';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move blue backward left is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            let requestedPosition = {
                y : 6,
                x : 1
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'blue').checker.makeKing();
            activeGame.boardState[5][2].addChecker(101, 'red');
            activeGame.nextTurn = 'red';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });



    describe('ActiveGame.validateAttackingMove(), attacking move red forward left is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 5,
                x : 2
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'red');
            activeGame.boardState[4][3].addChecker(101, 'blue');
            activeGame.nextTurn = 'blue';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move red forward right is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 5,
                x : 6
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'red');
            activeGame.boardState[4][5].addChecker(101, 'blue');
            activeGame.nextTurn = 'blue';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move red backward right is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 1,
                x : 6
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'red').checker.makeKing();
            activeGame.boardState[2][5].addChecker(101, 'blue');
            activeGame.nextTurn = 'blue';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move red backward left is valid', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 1,
                x : 2
            };

            activeGame.initialiseBlankBoardState();

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(100, 'red').checker.makeKing();
            activeGame.boardState[2][3].addChecker(101, 'blue');
            activeGame.nextTurn = 'blue';

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move is illegal', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 5
            };

            let requestedPosition = {
                y : 0,
                x : 2
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateAttackingMove(), attacking move is illegal', function () {
        it('should return true if checker can make valid attack, false if not', function () {
            let currentPosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 6,
                x : 0
            };

            assert.equal(activeGame.validateAttackingMove(currentPosition, requestedPosition), false);
        })
    });



    describe('ActiveGame.validateTravelingMove(), travelling move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 5
            };

            let requestedPosition = {
                y : 3,
                x : 4
            };

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 3
            };

            let requestedPosition = {
                y : 3,
                x : 4
            };

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 4,
                x : 1
            };

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 4,
                x : 3
            };

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling king move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 4,
                x : 3
            };

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(101, 'blue').checker.makeKing();

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling king move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 4,
                x : 5
            };

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(101, 'blue').checker.makeKing();

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling king move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            let requestedPosition = {
                y : 3,
                x : 2
            };

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(101, 'red').checker.makeKing();

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling king move is legal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 4,
                x : 3
            };

            let requestedPosition = {
                y : 3,
                x : 4
            };

            activeGame.boardState[currentPosition.y][currentPosition.x].addChecker(101, 'red').checker.makeKing();

            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), true);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is illegal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 2,
                x : 7
            };

            let requestedPosition = {
                y : 3,
                x : 8
            };


            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is illegal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : -1,
                x : -1
            };

            let requestedPosition = {
                y : 0,
                x : 0
            };


            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is illegal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 3,
                x : 4
            };

            let requestedPosition = {
                y : 4,
                x : 3
            };


            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), false);
        })
    });

    describe('ActiveGame.validateTravelingMove(), travelling move is illegal', function () {
        it('should return true if checker can make valid travel move, false if not', function () {
            let currentPosition = {
                y : 0,
                x : 3
            };

            let requestedPosition = {
                y : 1,
                x : 2
            };


            assert.equal(activeGame.validateTravelingMove(currentPosition, requestedPosition), false);
        })
    });


    describe('ActiveGame.validateGameConditions(), game conditions invalid', function () {
        it('should return true if game conditions are valid, false if not', function () {
            let currentPosition = {
                y : 0,
                x : 3
            };

            let requestedPosition = {
                y : 1,
                x : 2
            };

            let currentPlayerID = 'P1ID';

            activeGame.gameOver = true;

            assert.equal(activeGame.validateGameConditions(currentPosition, requestedPosition, currentPlayerID), false);
        })
    });

    describe('ActiveGame.validateGameConditions(), game conditions invalid', function () {
        it('should return true if game conditions are valid, false if not', function () {
            let currentPosition = {
                y : 0,
                x : 3
            };

            let requestedPosition = {
                y : 1,
                x : 2
            };

            let currentPlayerID = 'P1ID';

            activeGame.currentTurn = 'blue';

            assert.equal(activeGame.validateGameConditions(currentPosition, requestedPosition, currentPlayerID), false);
        })
    });

    describe('ActiveGame.validateGameConditions(), game conditions invalid', function () {
        it('should return true if game conditions are valid, false if not', function () {
            let currentPosition = {
                y : 0,
                x : 3
            };

            let requestedPosition = {
                y : 1,
                x : 2
            };

            let currentPlayerID = 'P2ID';

            activeGame.currentTurn = 'red';

            assert.equal(activeGame.validateGameConditions(currentPosition, requestedPosition, currentPlayerID), false);
        })
    });

    describe('ActiveGame.validateGameConditions(), game conditions invalid', function () {
        it('should return true if game conditions are valid, false if not', function () {
            let currentPosition = {
                y : 5,
                x : 2
            };

            let requestedPosition = {
                y : 4,
                x : 3
            };

            let currentPlayerID = 'P1ID';

            activeGame.currentTurn = 'red';

            assert.equal(activeGame.validateGameConditions(currentPosition, requestedPosition, currentPlayerID), false);
        })
    });

    describe('ActiveGame.parsePosition(), position string valid', function () {
        it('should return position object from position string if string is valid', function () {
            let positionString = '1,2';

            let expectedPositionObject = {
                y : 1,
                x : 2
            };

            assert.equal(JSON.stringify(activeGame.parsePosition(positionString)), JSON.stringify(expectedPositionObject));
        })
    });

    describe('ActiveGame.parsePosition(), position string valid', function () {
        it('should return position object from position string if string is valid', function () {
            let positionString = '5,6';

            let expectedPositionObject = {
                y : 5,
                x : 6
            };

            assert.equal(JSON.stringify(activeGame.parsePosition(positionString)), JSON.stringify(expectedPositionObject));
        })
    });

    describe('ActiveGame.parsePosition(), position string invalid', function () {
        it('should return position object from position string if string is valid', function () {
            let positionString = '';

            let expectedPositionObject = null;

            assert.equal(JSON.stringify(activeGame.parsePosition(positionString)), JSON.stringify(expectedPositionObject));
        })
    });

    describe('ActiveGame.parsePosition(), position string invalid', function () {
        it('should return position object from position string if string is valid', function () {
            let positionString = 'hello';

            let expectedPositionObject = null;

            assert.equal(JSON.stringify(activeGame.parsePosition(positionString)), JSON.stringify(expectedPositionObject));
        })
    });

    describe('ActiveGame.parsePosition(), position string invalid', function () {
        it('should return position object from position string if string is valid', function () {
            let positionString = false;

            let expectedPositionObject = null;

            assert.equal(JSON.stringify(activeGame.parsePosition(positionString)), JSON.stringify(expectedPositionObject));
        })
    });


    describe('ActiveGame.makeMove(), travelling move invalid', function () {
        it('should check if move is valid, move checkers around the board and then set game conditions ', function () {
            let currentPosition = '2,3';

            let requestedPosition = '3,3';

            let currentPositionObject = {
                y : 2,
                x : 3
            };

            let requestedPositionObject = {
                y : 3,
                x : 2
            };

            let currentPlayerID = 'P1ID';

            let startingTileCheckerID = activeGame.getTileByPosition(currentPositionObject).getCheckerID();

            activeGame.makeMove(currentPosition, requestedPosition, currentPlayerID);

            assert.notEqual(activeGame.getTileByPosition(requestedPositionObject).getCheckerID(), startingTileCheckerID);

            assert.equal(activeGame.gameOver, false);
            assert.equal(activeGame.currentTurn, 'red');

            assert.equal(activeGame.makingAMultiCapturePlay, false);
            assert.equal(activeGame.checkerInPlay, null);
        })
    });

    describe('ActiveGame.makeMove(), travelling move valid', function () {
        it('should check if move is valid, move checkers around the board and then set game conditions ', function () {
            let currentPosition = '2,3';

            let requestedPosition = '3,2';

            let currentPositionObject = {
                y : 2,
                x : 3
            };

            let requestedPositionObject = {
                y : 3,
                x : 2
            };

            //
            let currentPlayerID = 'P1ID';
            let expectedCurrentTurn = 'blue';

            let startingTileCheckerID = activeGame.getTileByPosition(currentPositionObject).getCheckerID();

            activeGame.makeMove(currentPosition, requestedPosition, currentPlayerID);

            //checker moved successfully
            assert.equal(activeGame.getTileByPosition(requestedPositionObject).getCheckerID(), startingTileCheckerID);

            //game isn't over
            assert.equal(activeGame.gameOver, false);
            //turn has switched
            assert.equal(activeGame.currentTurn, expectedCurrentTurn);
            //not making a multi-capture play
            assert.equal(activeGame.makingAMultiCapturePlay, false);
            assert.equal(activeGame.checkerInPlay, null);
        })
    });

    describe('ActiveGame.makeMove(), attacking move valid', function () {
        it('should check if move is valid, move checkers around the board and then set game conditions ', function () {
            let currentPosition = '2,3';

            let requestedPosition = '4,1';

            let currentPositionObject = {
                y : 2,
                x : 3
            };

            let attackedPositionObject = {
                y : 3,
                x : 2
            };

            let requestedPositionObject = {
                y : 4,
                x : 1
            };

            //player ones turn, red teams turn
            let currentPlayerID = 'P1ID';
            let expectedCurrentTurn = 'blue';
            // activeGame.boardState[3][2].addChecker(100, 'blue');

            //add a blue checker
            activeGame.getTileByPosition(attackedPositionObject).addChecker(100, 'blue');

            let startingTileCheckerID = activeGame.getTileByPosition(currentPositionObject).getCheckerID();

            //make attacking move
            activeGame.makeMove(currentPosition, requestedPosition, currentPlayerID);

            //checker moved successfully
            assert.equal(activeGame.getTileByPosition(requestedPositionObject).getCheckerID(), startingTileCheckerID);
            //attacked checker is captured
            assert.equal(activeGame.getTileByPosition(attackedPositionObject).isOccupied(), false);

            //game isn't over
            assert.equal(activeGame.gameOver, false);
            //turn has switched
            assert.equal(activeGame.currentTurn, expectedCurrentTurn);
            //not making a multi-capture play
            assert.equal(activeGame.makingAMultiCapturePlay, false);
            assert.equal(activeGame.checkerInPlay, null);
        })
    });

    describe('ActiveGame.makeMove(), attacking move valid, multi-capture play available', function () {
        it('should check if move is valid, move checkers around the board and then set game conditions ', function () {
            let currentPosition = '2,3';

            let requestedPosition = '4,1';

            let currentPositionObject = {
                y : 2,
                x : 3
            };

            let attackedPositionObject = {
                y : 3,
                x : 2
            };

            let requestedPositionObject = {
                y : 4,
                x : 1
            };

            //player ones turn, red teams turn
            let currentPlayerID = 'P1ID';
            let expectedCurrentTurn = 'red';
            // activeGame.boardState[3][2].addChecker(100, 'blue');

            //add a blue checker
            activeGame.getTileByPosition(attackedPositionObject).addChecker(100, 'blue');
            //remove a blue checker to make a multi-capture play available
            activeGame.getTileByPosition({y:6,x:3}).removeChecker();

            let startingTileCheckerID = activeGame.getTileByPosition(currentPositionObject).getCheckerID();

            //make attacking move
            activeGame.makeMove(currentPosition, requestedPosition, currentPlayerID);

            //checker moved successfully
            assert.equal(activeGame.getTileByPosition(requestedPositionObject).getCheckerID(), startingTileCheckerID);
            //attacked checker is captured
            assert.equal(activeGame.getTileByPosition(attackedPositionObject).isOccupied(), false);

            //game isn't over
            assert.equal(activeGame.gameOver, false);
            //turn hasn't switched
            assert.equal(activeGame.currentTurn, expectedCurrentTurn);
            //not making a multi-capture play
            assert.equal(activeGame.makingAMultiCapturePlay, true);
            assert.equal(activeGame.checkerInPlay, activeGame.getTileByPosition(requestedPositionObject).checker);
        })
    });
});

