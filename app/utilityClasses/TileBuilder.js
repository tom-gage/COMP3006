class TileBuilder{
    Checker = require('../objects/Checker');

    //VARS
    checker;
    colour;

    //CONSTRUCTOR
    static constructor(colour) {
        this.colour = colour;
    }

    //FUNCTIONS
    // static addColour(colour){
    //     this.colour = colour;
    //     return this;
    // }

    addChecker(team){
        this.checker = new this.Checker(team);
        return this;
    }

    isKing(){
        this.checker.makeKing();
        return this;
    }

    build(){
        return this;
    }

}