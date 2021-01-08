class ActiveGame{
    Tile = require('./Tile');



    //ws vars
    player1SocketID;
    player2SocketID;

    //game vars
    code;
    player1ID;
    player2ID;

    gameOver = false;
    winningTeam = 'none';

    //turn vars
    currentTurn = 'red';
    nextTurn = 'blue';
    checkerHasBeenCaptured = false;

    //board vars
    numberOfCols = 8;
    row7;
    row6;
    row5;
    row4;
    row3;
    row2;
    row1;
    row0;
    boardState = [
        this.row7 = [],
        this.row6 = [],
        this.row5 = [],
        this.row4 = [],
        this.row3 = [],
        this.row2 = [],
        this.row1 = [],
        this.row0 = []
    ];


    constructor(code, player1ID, player2ID) {
        this.code = code;
        this.player1ID = player1ID;
        this.player2ID = player2ID;

        this.initialiseBoardState();
    }

    makeMove(currentPos, requestedPos, playerID){
        // this.prettyPrintBoardState();

        currentPos = this.parsePosition(currentPos);
        requestedPos = this.parsePosition(requestedPos);

        let startingTile = this.boardState[currentPos.y][currentPos.x];
        let endingTile = this.boardState[requestedPos.y][requestedPos.x];

        //remove checker at current location
        //place checker at requested location
        if(this.validateGameConditions()){
            if(this.validateTravelingMove(currentPos, requestedPos, startingTile, endingTile)){
                //do travel
            } else if(this.validateAttackingMove(currentPos, requestedPos, startingTile, endingTile)){
                //do attack + check for additional attack avenues for multi-capture plays
            }
        }

        if(this.validateMove(currentPos, requestedPos, startingTile, endingTile, this.currentTurn, playerID)){
            endingTile.placeChecker(startingTile.checker);
            startingTile.removeChecker();



            this.makeKings();
            this.switchCurrentTurn();
            this.determineGameover();
            this.updateActiveGames();
        }


        this.prettyPrintBoardState();
    }

    parsePosition(position){
        let y = position.charAt(0);
        let x = position.charAt(2);



        return {
            y : parseInt(y),
            x : parseInt(x)
        }

    }

    validateMove(currentPos, requestedPos, startingTile, endingTile, currentTurn, currentPlayerID){
        console.log('BEGIN MOVE VALIDATION');

        // console.log('BUT NOT REALLY');//TEST STUFF
        // return true;

        //game condition validation
        if(this.gameOver){
            console.log('move INVALID, game is over');
            return false;
        }

        // remove this for easier debugging
        if(currentTurn === 'red' && currentPlayerID !== this.player1ID){
            console.log('move INVALID, not your turn');
            return false;
        } else if(currentTurn === 'blue' && currentPlayerID !== this.player2ID){
            console.log('move INVALID, not your turn');
            return false;
        }

        if(currentTurn !== startingTile.getCheckerTeam()){
            console.log('move INVALID, not your checker');
            return false;
        }

        //movement validation
        if(endingTile.getCheckerTeam() === startingTile.getCheckerTeam()) {//and checker is on same team
            console.log('move INVALID, tile occupied by same team');
            return false;
        }



        if(this.validateAttackingMove(currentPos, requestedPos, startingTile, endingTile)){
            return true;
        }

        if(this.validateTravelingMove(currentPos, requestedPos, startingTile, endingTile)){
           return true;
        }

        return false;

        // let attackForwardYVal;
        // let attackBackwardYVal;
        // let attackLeftXVal;
        // let attackRightXVal;
        //
        // let moveForwardYVal;
        // let moveBackwardYVal;
        // let moveLeftXVal;
        // let moveRightXVal;

        // if(startingTile.getCheckerTeam() === 'red'){
        //     attackForwardYVal = 2;
        //     attackBackwardYVal = -2;
        //
        //     attackLeftXVal = 2;
        //     attackRightXVal = -2;
        //
        //     moveForwardYVal = 1;
        //     moveBackwardYVal = -1;
        //
        //     moveLeftXVal = 1;
        //     moveRightXVal = -1;
        //
        // } else if(startingTile.getCheckerTeam() === 'blue'){
        //     attackForwardYVal = -2;
        //     attackBackwardYVal = 2;
        //
        //     attackLeftXVal = -2;
        //     attackRightXVal = 2;
        //
        //     moveForwardYVal = -1;
        //     moveBackwardYVal = 1;
        //
        //     moveLeftXVal = -1;
        //     moveRightXVal = 1;
        //
        // }
        //
        //
        // let tileBeingCaptured;

        // console.log('requested pos to string is: ');
        // console.log(JSON.stringify(requestedPos));
        // console.log('VS');


        // switch (JSON.stringify(requestedPos)) {//case: attack forward left
        //     case JSON.stringify({
        //         y : currentPos.y + attackForwardYVal,
        //         x : currentPos.x + attackLeftXVal
        //     }) :
        //         if(!endingTile.isOccupied()){
        //             tileBeingCaptured = this.boardState[currentPos.y + (attackForwardYVal / 2)][currentPos.x + (attackLeftXVal / 2)];
        //
        //             if(tileBeingCaptured.getCheckerTeam() === this.nextTurn){
        //                 console.log('ATTACK UP(FORWARD) LEFT');
        //
        //                 tileBeingCaptured.removeChecker();
        //                 return true;
        //             }
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: attack forward right
        //         y : currentPos.y + attackForwardYVal,
        //         x : currentPos.x + attackRightXVal
        //     }) :
        //
        //         if(!endingTile.isOccupied()){
        //             tileBeingCaptured = this.boardState[currentPos.y + (attackForwardYVal / 2)][currentPos.x + (attackRightXVal / 2)];
        //
        //             if(tileBeingCaptured.getCheckerTeam() === this.nextTurn){
        //                 console.log('ATTACK UP(FORWARD) RIGHT');
        //
        //                 tileBeingCaptured.removeChecker();
        //                 return true;
        //             }
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: attack backward right
        //         y : currentPos.y + attackBackwardYVal,
        //         x : currentPos.x + attackRightXVal
        //     }) :
        //
        //         if (startingTile.getCheckerKing()){//if checker is king
        //             if(!endingTile.isOccupied()){
        //                 tileBeingCaptured = this.boardState[currentPos.y + (attackBackwardYVal / 2)][currentPos.x + (attackRightXVal / 2)];
        //                 if(tileBeingCaptured.getCheckerTeam() === this.nextTurn){
        //                     console.log('ATTACK DOWN(BACKWARD) RIGHT');
        //
        //                     tileBeingCaptured.removeChecker();
        //                     return true;
        //                 }
        //             }
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: attack backward left
        //         y : currentPos.y + attackBackwardYVal,
        //         x : currentPos.x + attackLeftXVal
        //     }) :
        //
        //         if (startingTile.getCheckerKing()){//if checker is king
        //             if(!endingTile.isOccupied()){
        //                 tileBeingCaptured = this.boardState[currentPos.y + (attackBackwardYVal / 2)][currentPos.x + (attackLeftXVal / 2)];
        //
        //                 if(tileBeingCaptured.getCheckerTeam() === this.nextTurn){
        //                     console.log('ATTACK DOWN(BACKWARD) LEFT');
        //
        //                     tileBeingCaptured.removeChecker();
        //                     return true;
        //                 }
        //             }
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: move forward left
        //         y : currentPos.y + moveForwardYVal,
        //         x : currentPos.x + moveLeftXVal
        //     }) :
        //
        //         if(!endingTile.isOccupied()){
        //             console.log('MOVE UP(FORWARD) LEFT');
        //             return true;
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: move forward right
        //         y : currentPos.y + moveForwardYVal,
        //         x : currentPos.x + moveRightXVal
        //     }) :
        //
        //         if(!endingTile.isOccupied()){
        //             console.log('MOVE UP(FORWARD) RIGHT');
        //             return true;
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: move backward left
        //         y : currentPos.y + moveBackwardYVal,
        //         x : currentPos.x + moveRightXVal
        //     }) :
        //
        //         if (startingTile.getCheckerKing()){//if checker is king
        //             if(!endingTile.isOccupied()){
        //                 console.log('MOVE DOWN(BACKWARD) RIGHT');
        //                 return true;
        //             }
        //         }
        //         break;
        //
        //
        //     case JSON.stringify({//case: move backward left
        //         y : currentPos.y + moveBackwardYVal,
        //         x : currentPos.x + moveLeftXVal
        //     }) :
        //         if (startingTile.getCheckerKing()){//if checker is king
        //             if(!endingTile.isOccupied()){
        //                 console.log('MOVE DOWN(BACKWARD) LEFT');
        //                 return true;
        //             }
        //
        //         }
        //         break;
        //
        //
        //     default:
        //         console.log('MOVE INVALID');
        //         return false;
        // }

    }

    validateAttackingMove(currentPos, requestedPos, startingTile, endingTile){
        let attackForwardYVal;
        let attackBackwardYVal;
        let attackLeftXVal;
        let attackRightXVal;

        if(startingTile.getCheckerTeam() === 'red'){
            attackForwardYVal = 2;
            attackBackwardYVal = -2;

            attackLeftXVal = 2;
            attackRightXVal = -2;

        } else if(startingTile.getCheckerTeam() === 'blue'){
            attackForwardYVal = -2;
            attackBackwardYVal = 2;

            attackLeftXVal = -2;
            attackRightXVal = 2;
        }

        let tileBeingCaptured;

        switch (JSON.stringify(requestedPos)) {//case: attack forward left
            case JSON.stringify({
                y: currentPos.y + attackForwardYVal,
                x: currentPos.x + attackLeftXVal
            }) :
                if (!endingTile.isOccupied()) {
                    tileBeingCaptured = this.boardState[currentPos.y + (attackForwardYVal / 2)][currentPos.x + (attackLeftXVal / 2)];

                    if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {
                        console.log('VALID ATTACK FORWARD LEFT');

                        tileBeingCaptured.removeChecker();
                        return true;
                    }
                }
                break;


            case JSON.stringify({//case: attack forward right
                y: currentPos.y + attackForwardYVal,
                x: currentPos.x + attackRightXVal
            }) :

                if (!endingTile.isOccupied()) {
                    tileBeingCaptured = this.boardState[currentPos.y + (attackForwardYVal / 2)][currentPos.x + (attackRightXVal / 2)];

                    if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {
                        console.log('VALID ATTACK FORWARD RIGHT');

                        tileBeingCaptured.removeChecker();
                        return true;
                    }
                }
                break;


            case JSON.stringify({//case: attack backward right
                y: currentPos.y + attackBackwardYVal,
                x: currentPos.x + attackRightXVal
            }) :

                if (startingTile.getCheckerKing()) {//if checker is king
                    if (!endingTile.isOccupied()) {
                        tileBeingCaptured = this.boardState[currentPos.y + (attackBackwardYVal / 2)][currentPos.x + (attackRightXVal / 2)];
                        if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {
                            console.log('VALID ATTACK BACKWARD RIGHT');

                            tileBeingCaptured.removeChecker();
                            return true;
                        }
                    }
                }
                break;


            case JSON.stringify({//case: attack backward left
                y: currentPos.y + attackBackwardYVal,
                x: currentPos.x + attackLeftXVal
            }) :

                if (startingTile.getCheckerKing()) {//if checker is king
                    if (!endingTile.isOccupied()) {
                        tileBeingCaptured = this.boardState[currentPos.y + (attackBackwardYVal / 2)][currentPos.x + (attackLeftXVal / 2)];

                        if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {
                            console.log('VALID ATTACK BACKWARD LEFT');

                            tileBeingCaptured.removeChecker();
                            return true;
                        }
                    }
                }
                break;

            default:
                console.log('PROPOSED ATTACKING MOVE INVALID');
                return false;
        }
    }

    validateTravelingMove(currentPos, requestedPos, startingTile, endingTile){
        let moveForwardYVal;
        let moveBackwardYVal;
        let moveLeftXVal;
        let moveRightXVal;

        if(startingTile.getCheckerTeam() === 'red'){
            moveForwardYVal = 1;
            moveBackwardYVal = -1;

            moveLeftXVal = 1;
            moveRightXVal = -1;

        } else if(startingTile.getCheckerTeam() === 'blue'){
            moveForwardYVal = -1;
            moveBackwardYVal = 1;

            moveLeftXVal = -1;
            moveRightXVal = 1;
        }

        switch (JSON.stringify(requestedPos)) {
            case JSON.stringify({//case: move forward left
                y : currentPos.y + moveForwardYVal,
                x : currentPos.x + moveLeftXVal
            }) :

                if(!endingTile.isOccupied()){
                    console.log('VALID MOVE FORWARD LEFT');
                    return true;
                }
                break;


            case JSON.stringify({//case: move forward right
                y : currentPos.y + moveForwardYVal,
                x : currentPos.x + moveRightXVal
            }) :

                if(!endingTile.isOccupied()){
                    console.log('VALID MOVE FORWARD RIGHT');
                    return true;
                }
                break;


            case JSON.stringify({//case: move backward left
                y : currentPos.y + moveBackwardYVal,
                x : currentPos.x + moveRightXVal
            }) :

                if (startingTile.getCheckerKing()){//if checker is king
                    if(!endingTile.isOccupied()){
                        console.log('VALID MOVE BACKWARD RIGHT');
                        return true;
                    }
                }
                break;


            case JSON.stringify({//case: move backward left
                y : currentPos.y + moveBackwardYVal,
                x : currentPos.x + moveLeftXVal
            }) :
                if (startingTile.getCheckerKing()){//if checker is king
                    if(!endingTile.isOccupied()){
                        console.log('VALID MOVE BACKWARD LEFT');
                        return true;
                    }

                }
                break;


            default:
                console.log('TRAVELING MOVE INVALID');
                return false;
        }
    }

    canMakeValidAttackingMove(){
        //
    }

    updateActiveGames(){
        let thisGame = this;
        let gameCode = this.code;

        ACTIVE_GAMES.forEach(function (activeGame, index) {//for each game in ACTIVE_GAMES
            if(activeGame.code.toString() === gameCode.toString()){//if there's an active game with a code matching the submitted code
                ACTIVE_GAMES.splice(index, 1, thisGame);//at current index: delete game, replace with updated game
            }
        });
    }

    makeKings(){
        let tile;
        let numberOfCols = this.numberOfCols;
        let length = this.boardState.length;

        this.boardState[0].forEach(function (tile, index) {

            // console.log('checking king suitability, team is: ' + tile.getCheckerTeam() + ', column position is: ' + index);

            if(tile.getCheckerTeam() === 'blue'){
                console.log('made blue checker king');
                tile.makeCheckerKing();
            }
        });

        this.boardState[this.boardState.length - 1].forEach(function (tile, index) {

            // console.log('checking king suitability, team is: ' + tile.getCheckerTeam() + ', column position is: ' + index);

            if(tile.getCheckerTeam() === 'red'){
                console.log('made red checker king');
                tile.makeCheckerKing();
            }
        });
    }

    switchCurrentTurn(){
        if(this.currentTurn === 'red'){
            this.currentTurn = 'blue';
            this.nextTurn = 'red';

        } else if(this.currentTurn === 'blue'){
            this.currentTurn = 'red';
            this.nextTurn = 'blue';

        } else {
            console.log('something has gone wrong with turn switching...');
        }
    }

    determineGameover(){
        let reds = [];
        let blues = [];
        let tile;

        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row
                tile = this.boardState[y][x];
                if(tile.getCheckerTeam() === 'red'){
                    reds.push(tile);
                } else if(tile.getCheckerTeam() === 'blue'){
                    blues.push(tile);
                }
            }
        }

        if(reds.length <= 0){
            this.gameOver = true;
            this.winningTeam = 'Blue';
            return true;
        } else if(blues.length <= 0){
            this.gameOver = true;
            this.winningTeam = 'Red';
            return true;
        } else {
            return false;
        }
    }

    prettyPrintBoardState(){
        console.log('Pretty printing the board state...');
        let columnsHeader = '[_]';
        let rowOut = '';
        for(let x = 0; x < this.numberOfCols; x++){
            columnsHeader += '[' + x + ']';
        }

        console.log(columnsHeader);

        for(let y = 0; y < this.boardState.length; y++){//for each row
            rowOut += '[' + y + ']';
            for(let x = 0; x < this.numberOfCols; x++){//for each column
                let tile = this.boardState[y][x];

                if(!tile.checker){
                    rowOut += '[_]'
                } else if(tile.checker.team === 'red'){
                    rowOut += '[R]';
                } else if(tile.checker.team === 'blue'){
                    rowOut += '[B]';
                }

            }
            console.log(rowOut);
            rowOut = '';
        }
    }



    initialiseBoardState(){
        let tileIndex = 1;
        let tile;
        // console.log('boardstate pre init: ' + this.boardState);
        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            tileIndex++;
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row
                tile = new this.Tile().addCoodinateID(y, x);

                tileIndex++;
                if(tileIndex & 1)//if tile index is odd
                {
                    tile.addColour('white');
                }
                else
                {
                    tile.addColour('black');

                    if(y >= 0 && y <= 2){
                        tile.addChecker('red');
                    }

                    if(y >= 5 && y <= this.boardState.length){
                        tile.addChecker('blue');
                    }
                }

                // if(y === 0){
                //     tile.addChecker('red');
                // }else if(y === 7){
                //     tile.addChecker('blue');
                // }





                this.boardState[y].push(tile);
                // console.log('row ' + y + ', position ' + x + ' updated with: ' + tile);
            }
        }
        // console.log('boardstate post init: ' + this.boardState);
    }

    getBoardStateAsHTML(){
        let boardStateAsHTML = '<div id="board">';
        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            boardStateAsHTML += '<br>';
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row
                boardStateAsHTML += this.boardState[y][x].getBoardTileAsHTML();
            }
        }
        boardStateAsHTML += '</div>';
        // console.log('boardstate as HTML: ' + boardStateAsHTML);
        return boardStateAsHTML;
    }

}

module.exports = ActiveGame;