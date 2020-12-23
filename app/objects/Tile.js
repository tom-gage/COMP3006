class Tile{
    Checker = require('./Checker');

    //VARS
    colour;
    checker;

    //CONSTRUCTOR
    constructor() {
        this.colour = undefined;
        this.checker = undefined;
    }

    // constructor(tileBuilder) {
    //     this.colour = tileBuilder.colour;
    //     this.checker = tileBuilder.checker;
    // }

    //BUILDER FUNCTIONS
    addColour(colour){
        this.colour = colour;
        return this;
    }

    addChecker(team){
        this.checker = new this.Checker(team);
        return this;
    }



    //FUNCTIONS
    getBoardTileAsHTML(){
        return '<div class="boardTile ' + this.colour + '">' +
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