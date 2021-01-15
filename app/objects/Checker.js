class Checker{
    id = '';
    team = '';
    isKing = false;

    constructor(id, team) {
        this.id = id;
        this.team = team;
        this.isKing = false;
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
}

module.exports = Checker;