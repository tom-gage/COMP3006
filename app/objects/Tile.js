class Tile{
    Checker = require('Checker');

    //VARS
    checker = new this.Checker('red');

    //CONSTRUCTOR
    constructor(checker) {
        this.checker = checker;
    }


    //FUNCTIONS
    getBoardTileAsHTML(tileColour){
        return '<div class="boardTile ' + tileColour + '">' +
            this.getCheckerAsHTML() +
            '</div>';
    }

    getCheckerAsHTML(){
        if(this.checker){
            return this.checker.getAsHTML();
        } else {
            return '';
        }
    }

}

module.exports = Tile;