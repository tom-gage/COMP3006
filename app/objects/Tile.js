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

    addChecker(id, team){
        this.checker = new this.Checker(id, team);
        return this;
    }


    //FUNCTIONS
    //html render
    getBoardTileAsHTML(){
        let isOccupied = '';
        if(this.isOccupied()){
            isOccupied = 'occupied';
        }

        return '<div class="boardTile ' + this.colour + ' ' + isOccupied +'" id="' + this.CoodinateID + '">' +
            this.CoodinateID +
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

    //checker gets
    getCheckerID(){
        if(this.checker){
            return this.checker.id;
        } else{
            return '';
        }
    }

    getCheckerTeam(){
        if(this.checker){
            return this.checker.team;
        } else{
            return '';
        }
    }

    getCheckerKing(){
        if(this.checker){
            return this.checker.isKing;
        } else{
            return false;
        }
    }



    //checker operations
    removeChecker(){
        this.checker = undefined;
    }

    placeChecker(checker){
        this.checker = new this.Checker(checker.id, checker.team);
        if(checker.isKing){
            this.checker.makeKing();
        }

    }

    makeCheckerKing(){
        if(this.checker){
            this.checker.makeKing();
        }
    }

    isOccupied(){
        if(this.checker){
            return true;
        } else {
            return false;
        }
    }

}

module.exports = Tile;