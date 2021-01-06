class Tile{
    Checker = require('./Checker');

    //VARS
    CoodinateID;
    colour;
    checker;

    //CONSTRUCTOR
    constructor() {
        this.CoodinateID = undefined;
        this.colour = undefined;
        this.checker = undefined;
    }



    //BUILDER FUNCTIONS
    addCoodinateID(y, x){
        this.CoodinateID = y + ',' + x;
        return this;
    }

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
        return '<div class="boardTile ' + this.colour + ' ' + this.hasChecker() +'" id="' + this.CoodinateID + '">' +
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

    hasChecker(){
        if(this.checker){
            return 'occupied';
        } else {
            return '';
        }
    }

    removeChecker(){
        this.checker = undefined;
    }

    placeChecker(team){
        this.checker = new this.Checker(team);
    }

    getCheckerTeam(){
        if(this.checker){
            return this.checker.team;
        } else{
            return '';
        }
    }

}

module.exports = Tile;