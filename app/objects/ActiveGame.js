class ActiveGame{
    Tile = require('./Tile');

    code;
    player1ID;
    player2ID;
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

    makeMove(currentPos, requestedPos){
        this.prettyPrintBoardState();
        console.log('making move...' + currentPos + ' to ' + requestedPos + '...');


        currentPos = this.parsePosition(currentPos);
        requestedPos = this.parsePosition(requestedPos);

        let startingTile = this.boardState[currentPos.y][currentPos.x];
        let endingTile = this.boardState[requestedPos.y][requestedPos.x];


        //remove checker at current location
        //place checker at requested location
        if(this.validateMove(currentPos, requestedPos, startingTile, endingTile)){
            endingTile.placeChecker(startingTile.checker.team);
            startingTile.removeChecker();

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

    validateMove(currentPos, requestedPos, startingTile, endingTile){//NEEDS MORE EFFICIENT
        console.log('BEGIN MOVE VALIDATION');

        switch(startingTile.checker.team){
            case 'red':
                console.log('red validation in progress...');
                console.log('end tile checker is of type: ' + typeof endingTile.checker);

                if(typeof endingTile.checker !== 'undefined'){//if checker has tile
                    console.log('2nd check, end tile checker is of type: ' + typeof endingTile.checker);

                    if(endingTile.checker.team === 'red') {//and tile is red
                        console.log('red move INVALID');
                        return false;
                    }
                }

                if(!startingTile.checker.king){//if checker is not king
                    if(requestedPos.y !== currentPos.y + 1){//perform vertical validation
                        console.log('red move Y INVALID!');
                        return false;
                    }
                }

                if(requestedPos.x !== currentPos.x + 1 && requestedPos.x !== currentPos.x - 1){//perform horizontal validation
                    // if(requestedPos.x !== currentPos.x - 1){
                    console.log('red move X INVALID!');
                    return false;
                    // }
                } else {
                    console.log('red move valid!');
                    return true;
                }


            case 'blue':
                console.log('blue validation in progress...');
                console.log('requestedPos.y is: ' + requestedPos.y);
                console.log('requestedPos.x is: ' + requestedPos.x);

                console.log('currentPos.y is: ' + currentPos.y);
                console.log('currentPos.x is: ' + currentPos.x);

                if(typeof endingTile.checker !== 'undefined'){//if checker has tile
                    console.log('2nd check, end tile checker is of type: ' + typeof endingTile.checker);

                    if(endingTile.checker.team === 'blue') {//and tile is blue
                        console.log('red move INVALID');
                        return false;
                    }
                }

                if(!startingTile.checker.king){//if checker is not king
                    if(requestedPos.y !== currentPos.y - 1){//perform vertical validation
                        console.log('blue move Y INVALID!');
                        return false;
                    }
                }

                if(requestedPos.x !== currentPos.x + 1 && requestedPos.x !== currentPos.x - 1){//horizontal validation
                    // if(requestedPos.x !== currentPos.x - 1){
                        console.log('blue move X INVALID!');
                        // console.log('requestedPos.x is: ' + requestedPos.x);
                        // console.log('currentPos.x is: ' + currentPos.x);
                        // console.log('currentPos.x +1 is: ' + (currentPos.x + 1));
                        // console.log('currentPos.x -1 is: ' + (currentPos.x - 1));
                        return false;
                    // }
                } else {
                    console.log('blue move valid!');
                    return true;
                }

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
        let tileIndex = 0;
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
                }

                if(y === 0){
                    tile.addChecker('red');
                }else if(y === 7){
                    tile.addChecker('blue');
                }



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