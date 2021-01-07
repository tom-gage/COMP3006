class ActiveGame{
    Tile = require('./Tile');

    code;
    player1ID;
    player2ID;

    player1SocketID;
    player2SocketID;

    gameOver = false;
    winningTeam = 'none';

    currentTurn = 'red';

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
        console.log('requested move...' + currentPos + ' to ' + requestedPos + '...');


        currentPos = this.parsePosition(currentPos);
        requestedPos = this.parsePosition(requestedPos);

        let startingTile = this.boardState[currentPos.y][currentPos.x];
        let endingTile = this.boardState[requestedPos.y][requestedPos.x];


        //remove checker at current location
        //place checker at requested location
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
        console.log('move = current position: ' + currentPos.y + ', ' + currentPos.x + ' to requested position: ' + requestedPos.y + ', ' + requestedPos.x);

        // console.log('BUT NOT REALLY');//TEST STUFF
        // return true;

        //game condition validation
        if(this.gameOver){
            console.log('move INVALID, game is over');
            return false;
        }

        //remove this for easier debugging
        // if(currentTurn === 'red' && currentPlayerID !== this.player1ID){
        //     console.log('move INVALID, not your turn');
        //     return false;
        // } else if(currentTurn === 'blue' && currentPlayerID !== this.player2ID){
        //     console.log('move INVALID, not your turn');
        //     return false;
        // }

        // if(currentTurn !== startingTile.getCheckerTeam()){
        //     console.log('move INVALID, not your checker');
        //     return false;
        // }



        //movement validation
        if(endingTile.getCheckerTeam() === startingTile.getCheckerTeam()) {//and checker is on same team
            console.log('move INVALID, tile occupied by same team');
            return false;
        }





        switch(startingTile.getCheckerTeam()){
            case 'red':
                console.log('requested position is, y: ' + requestedPos.y + ', x: ' + requestedPos.x);

                if(requestedPos.x === currentPos.x - 2){//if negative 2x
                    if(requestedPos.y === currentPos.y + 2){
                        console.log('team of checker(' + (currentPos.y + 1).toString() + ', ' + (currentPos.x - 1).toString() +') being jumped is: ' + (this.boardState[currentPos.y + 1][currentPos.x - 1].getCheckerTeam()).toString());
                        if(this.boardState[currentPos.y + 1][currentPos.x - 1].getCheckerTeam() === 'blue'){
                            console.log('valid attacking move');
                            this.boardState[currentPos.y + 1][currentPos.x - 1].removeChecker();
                            return true;
                        }

                    } else if(requestedPos.y === currentPos.y - 2){
                        if(startingTile.getCheckerKing()){
                            if(this.boardState[currentPos.y - 1][currentPos.x - 1].getCheckerTeam() === 'blue'){
                                console.log('valid attacking move');
                                this.boardState[currentPos.y - 1][currentPos.x - 1].removeChecker();
                                return true;
                            }
                        }
                    }
                } else if(requestedPos.x === currentPos.x + 2){//if positive 2x
                    if(requestedPos.y === currentPos.y + 2){
                        console.log('team of checker(' + (currentPos.y + 1).toString() + ', ' + (currentPos.x + 1).toString() +') being jumped is: ' + this.boardState[currentPos.y + 1][currentPos.x + 1].getCheckerTeam());

                        if(this.boardState[currentPos.y + 1][currentPos.x + 1].getCheckerTeam() === 'blue'){
                            console.log('valid attacking move');
                            this.boardState[currentPos.y + 1][currentPos.x + 1].removeChecker();
                            return true;
                        }

                    } else if(requestedPos.y === currentPos.y - 2){//
                        if(startingTile.getCheckerKing()){
                            if(this.boardState[currentPos.y - 1][currentPos.x + 1].getCheckerTeam() === 'blue'){
                                console.log('valid attacking move');
                                this.boardState[currentPos.y - 1][currentPos.x + 1].removeChecker();
                                return true;
                            }
                        }
                    }
                }

                if(requestedPos.x !== currentPos.x + 1 && requestedPos.x !== currentPos.x - 1){//perform horizontal validation
                    console.log('move INVALID, illegal X movement');
                    return false;
                }

                if(!startingTile.getCheckerKing()){//if checker is not king
                    if(requestedPos.y !== currentPos.y + 1){//perform vertical validation
                        console.log('move INVALID, illegal Y movement');
                        return false;
                    }
                }

                if(endingTile.isOccupied()){
                    console.log('move INVALID, tile occupied');
                    return false;
                }

                console.log('valid move');
                return true;

            case 'blue':
                if(requestedPos.x === currentPos.x - 2){//if going left
                    if(requestedPos.y === currentPos.y - 2){//if going up
                        console.log('team of checker(' + (currentPos.y - 1).toString() + ', ' + (currentPos.x - 1).toString() +') being jumped is: ' + (this.boardState[currentPos.y - 1][currentPos.x - 1].getCheckerTeam()).toString());
                        if(this.boardState[currentPos.y - 1][currentPos.x - 1].getCheckerTeam() === 'red'){
                            console.log('valid attacking move');
                            this.boardState[currentPos.y - 1][currentPos.x - 1].removeChecker();
                            return true;
                        }

                    } else if(requestedPos.y === currentPos.y + 2){//if going down
                        if(startingTile.getCheckerKing()){//if king
                            if(this.boardState[currentPos.y + 1][currentPos.x - 1].getCheckerTeam() === 'red'){
                                console.log('valid attacking move');
                                this.boardState[currentPos.y + 1][currentPos.x - 1].removeChecker();
                                return true;
                            }
                        }
                    }
                } else if(requestedPos.x === currentPos.x + 2){//if going right
                    if(requestedPos.y === currentPos.y - 2){//if going up
                        console.log('team of checker(' + (currentPos.y - 1).toString() + ', ' + (currentPos.x + 1).toString() +') being jumped is: ' + this.boardState[currentPos.y - 1][currentPos.x + 1].getCheckerTeam());

                        if(this.boardState[currentPos.y - 1][currentPos.x + 1].getCheckerTeam() === 'red'){
                            console.log('valid attacking move');
                            this.boardState[currentPos.y - 1][currentPos.x + 1].removeChecker();
                            return true;
                        }

                    } else if(requestedPos.y === currentPos.y + 2){//if going down
                        if(startingTile.getCheckerKing()){//if king
                            if(this.boardState[currentPos.y + 1][currentPos.x + 1].getCheckerTeam() === 'red'){
                                console.log('valid attacking move');
                                this.boardState[currentPos.y + 1][currentPos.x + 1].removeChecker();
                                return true;
                            }
                        }
                    }
                }

                if(requestedPos.x !== currentPos.x + 1 && requestedPos.x !== currentPos.x - 1){//perform horizontal validation
                    console.log('move INVALID, illegal X movement');
                    return false;
                }

                if(!startingTile.getCheckerKing()){//if checker is not king
                    if(requestedPos.y !== currentPos.y - 1){//perform vertical validation
                        console.log('move INVALID, illegal Y movement');
                        return false;
                    }
                }

                if(endingTile.isOccupied()){
                    console.log('move INVALID, tile occupied');
                    return false;
                }

                console.log('valid move');
                return true;

            default:
                console.log('validation defaulted!');
                return false;


        }
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
        } else if(this.currentTurn === 'blue'){
            this.currentTurn = 'red'
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