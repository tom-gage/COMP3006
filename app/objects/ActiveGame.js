class ActiveGame{
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

    }

    formatBoardStateToHTML(){

    }

}

module.exports = ActiveGame;