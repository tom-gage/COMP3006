class Checker{
    id;
    team;
    isKing = false;
    isCaptured = false;

    constructor(id, team) {
        this.id = id;
        this.team = team;
    }

    getAsHTML(){
        let HTMLCheckerDiv = '<div class="dot ' + this.team;

        if(this.isKing){
            HTMLCheckerDiv += ' king';
        }
        return HTMLCheckerDiv += '"></div>';
    }

    makeKing(){
        this.isKing = true;
    }

    makeCaptured(){
        this.isCaptured = true;
    }
}

module.exports = Checker;