class ActiveGame{
    Tile = require('./Tile');

    code;
    player1ID;
    player2ID;

    player1SocketID;
    player2SocketID;

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

    validateMove(currentPos, requestedPos, startingTile, endingTile){
        console.log('BEGIN MOVE VALIDATION');

        if(typeof endingTile.checker !== 'undefined'){//if ending tile has checker
            if(endingTile.checker.team === startingTile.checker.team) {//and checker is on same team
                console.log('move INVALID, tile occupied by same team');
                return false;
            }
        }

        if(requestedPos.x !== currentPos.x + 1 && requestedPos.x !== currentPos.x - 1){//perform horizontal validation
            console.log('move INVALID, illegal X movement');
            return false;
        }


        switch(startingTile.checker.team){
            case 'red':
                if(!startingTile.checker.king){//if checker is not king
                    if(requestedPos.y !== currentPos.y + 1){//perform vertical validation
                        console.log('move INVALID, illegal Y movement');
                        return false;
                    }
                }

                console.log('valid move');
                return true;

            case 'blue':
                if(!startingTile.checker.king){//if checker is not king
                    if(requestedPos.y !== currentPos.y - 1){//perform vertical validation
                        console.log('move INVALID, illegal Y movement');
                        return false;
                    }
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