class ActiveGame{
    Tile = require('./Tile');

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
    }

    initialiseBoardState(){
        let tileIndex = 0;
        let tile;
        // console.log('boardstate pre init: ' + this.boardState);
        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            tileIndex++;
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row
                tileIndex++;
                tile = new this.Tile();
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