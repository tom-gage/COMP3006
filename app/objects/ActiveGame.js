class ActiveGame{
    Tile = require('./Tile');
    //game vars
    code = '';
    player1ID = '';
    player2ID = '';
    player1Score = 0;
    player2Score = 0;

    //ws vars
    player1SocketID = '';
    player2SocketID = '';

    //messages
    messages = [];

    //game conditions
    gameOver = false;
    winningTeam = '';

    currentTurn = 'red';
    nextTurn = 'blue';

    makingAMultiCapturePlay = false;
    checkerInPlay = null;

    //board
    numberOfCols = 8;
    boardState;
    row0;
    row1;
    row2;
    row3;
    row4;
    row5;
    row6;
    row7;

    constructor(code, player1ID, player2ID) {
        this.code = code;
        this.player1ID = player1ID;
        this.player2ID = player2ID;

        this.initialiseBoardState();
    }

    makeMove(currentPos, requestedPos, currentPlayerID){//receive move proposal
        currentPos = this.parsePosition(currentPos);
        requestedPos = this.parsePosition(requestedPos);//parse position into workable object

        let startingTile = this.getTileByPosition(currentPos);
        let endingTile = this.getTileByPosition(requestedPos);

        //begin move validation
        if(this.validateGameConditions(currentPos, requestedPos, currentPlayerID)){//if game conditions are valid
            //assuming valid game conditions, move can be either travelling move, attacking move or a chained-attacking move
            if(this.makingAMultiCapturePlay){//if making a multi capture play
                // console.log('attempting multi-capture play...');
                if(startingTile.getCheckerID() === this.checkerInPlay.id){//if checker is same checker used in previous play

                    if(this.validateAttackingMove(currentPos, requestedPos)){//if proposed move is a valid attacking play
                        this.doAttackingMove(currentPos, requestedPos);//do attacking move
                        this.makeKings();

                        // console.log('SUCCESS!');
                        // console.log('LOOKING FOR ANOTHER MULTI CAPTURE PLAY...');
                        if(this.canMakeValidAttackingMove(requestedPos)){//look for another attacking play...
                            // console.log('ANOTHER MULTI CAPTURE PLAY AVAILABLE');

                            this.checkerInPlay = endingTile.checker;
                            this.makingAMultiCapturePlay = true;
                        } else {
                            this.checkerInPlay = null;
                            this.makingAMultiCapturePlay = false;
                            this.switchCurrentTurn();
                        }
                    }
                }

            } else if(this.validateTravelingMove(currentPos, requestedPos)){//if making a travelling move
                //do traveling move
                this.doTravelingMove(currentPos, requestedPos);
                this.switchCurrentTurn();

            } else if(this.validateAttackingMove(currentPos, requestedPos)){//if making an attacking move
                //do attack + check for additional attack avenues for multi-capture plays
                this.doAttackingMove(currentPos, requestedPos);
                this.makeKings();

                // console.log('LOOKING FOR MULTI CAPTURE PLAY...');
                if(this.canMakeValidAttackingMove(requestedPos)){
                    // console.log('MULTI CAPTURE PLAY AVAILABLE');

                    this.checkerInPlay = endingTile.checker;
                    // console.log('initialising checker in play: ' + JSON.stringify(this.checkerInPlay));
                    this.makingAMultiCapturePlay = true;
                } else {
                    this.checkerInPlay = null;
                    this.makingAMultiCapturePlay = false;
                    this.switchCurrentTurn();
                }
            }

            this.makeKings();
            this.determineGameover();
        }
        this.prettyPrintBoardState();
    }

    parsePosition(position){
        let y;
        let x;

        if(typeof position != 'string'){
            return null;
        }

        if(position.charAt(0) && position.charAt(2)){
            y = position.charAt(0);
            x = position.charAt(2);
        }

        if(Number.isInteger(parseInt(y))){
            if(Number.isInteger(parseInt(x))){
                return {
                    y : parseInt(y),
                    x : parseInt(x)
                }
            }


        } else {
            return null;
        }
    }

    validateGameConditions(currentPos, requestedPos, currentPlayerID){
        let startingTile = this.getTileByPosition(currentPos);

        if(this.gameOver){//if game is over
            // console.log('move INVALID, game is over');
            return false;
        }

        if(!startingTile){//if starting tile invalid
            // console.log('move INVALID, starting tile is null');
            return false;
        }

        if(this.currentTurn === 'red' && currentPlayerID !== this.player1ID){//if not your turn
            // console.log('move INVALID, not your turn');
            return false;
        } else if(this.currentTurn === 'blue' && currentPlayerID !== this.player2ID){
            // console.log('move INVALID, not your turn');
            return false;
        }

        if(this.currentTurn !== startingTile.getCheckerTeam()){//if not your checker
            // console.log('move INVALID, not your checker');
            return false;
        }
        // console.log('game conditions valid...');
        return true;
    }

    validateTravelingMove(currentPos, requestedPos){
        let startingTile = this.getTileByPosition(currentPos);
        let endingTile = this.getTileByPosition(requestedPos);

        console.log(JSON.stringify(startingTile));
        console.log(JSON.stringify(endingTile));

        if(!startingTile || !endingTile){
            return false;
        }

        let moveForwardYVal;
        let moveBackwardYVal;
        let moveLeftXVal;
        let moveRightXVal;

        if(startingTile.getCheckerTeam() === 'red'){//if red, set movement modifier relative to red's side
            moveForwardYVal = 1;
            moveBackwardYVal = -1;

            moveLeftXVal = 1;
            moveRightXVal = -1;

        } else if(startingTile.getCheckerTeam() === 'blue'){//if blue, set movement modifier relative to blue's side
            moveForwardYVal = -1;
            moveBackwardYVal = 1;

            moveLeftXVal = -1;
            moveRightXVal = 1;
        }

        //begin checks
        if(!startingTile.isOccupied()){//if starting tile not occupied
            // console.log('move INVALID, starting tile not occupied');
            return false;
        }

        if(endingTile.isOccupied()){//if ending tile is occupied
            // console.log('move INVALID, tile occupied');
            return false;
        }

        switch (JSON.stringify(requestedPos)) {
            case JSON.stringify({//case: move forward left
                y : currentPos.y + moveForwardYVal,
                x : currentPos.x + moveLeftXVal
            }) :
                // console.log('VALID MOVE FORWARD LEFT');
                return true;


            case JSON.stringify({//case: move forward right
                y : currentPos.y + moveForwardYVal,
                x : currentPos.x + moveRightXVal
            }) :
                // console.log('VALID MOVE FORWARD RIGHT');
                return true;


            case JSON.stringify({//case: move backward left
                y : currentPos.y + moveBackwardYVal,
                x : currentPos.x + moveRightXVal
            }) :

                if (startingTile.getCheckerKing()){//if checker is king
                    // console.log('VALID MOVE BACKWARD RIGHT');
                    return true;
                }
                break;


            case JSON.stringify({//case: move backward left
                y : currentPos.y + moveBackwardYVal,
                x : currentPos.x + moveLeftXVal
            }) :
                if (startingTile.getCheckerKing()){//if checker is king
                    // console.log('VALID MOVE BACKWARD LEFT');
                    return true;
                }
                break;


            default:
                // console.log('VALIDATION DEFAULTED, TRAVELING MOVE INVALID');
                return false;
        }

        // console.log('TRAVELING MOVE INVALID');
        return false;
    }

    validateAttackingMove(currentPos, requestedPos){
        let startingTile = this.getTileByPosition(currentPos);
        let endingTile = this.getTileByPosition(requestedPos);

        if(!startingTile || !endingTile){
            // console.log('Attacking move INVALID, starting/ending tile is null');
            return false;
        }

        let attackForwardYVal;
        let attackBackwardYVal;
        let attackLeftXVal;
        let attackRightXVal;

        if(startingTile.getCheckerTeam() === 'red'){//if red, set movement modifiers
            attackForwardYVal = 2;
            attackBackwardYVal = -2;

            attackLeftXVal = 2;
            attackRightXVal = -2;

        } else if(startingTile.getCheckerTeam() === 'blue'){//if blue, set movement modifiers
            attackForwardYVal = -2;
            attackBackwardYVal = 2;

            attackLeftXVal = -2;
            attackRightXVal = 2;
        }

        let tileBeingCaptured;

        //begin checks
        if(!startingTile.isOccupied()){
            // console.log('move INVALID, starting tile not occupied');
            return false;
        }

        if(endingTile.isOccupied()){
            // console.log('move INVALID, ending tile occupied');
            return false;
        }

        switch (JSON.stringify(requestedPos)) {//case: attack forward left
            case JSON.stringify({
                y: currentPos.y + attackForwardYVal,
                x: currentPos.x + attackLeftXVal
            }) :
                    tileBeingCaptured = this.boardState[currentPos.y + (attackForwardYVal / 2)][currentPos.x + (attackLeftXVal / 2)];

                    if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {//if captured piece on opposite team
                        // console.log('VALID ATTACK FORWARD LEFT');

                        return true;
                    }
                break;


            case JSON.stringify({//case: attack forward right
                y: currentPos.y + attackForwardYVal,
                x: currentPos.x + attackRightXVal
            }) :
                    tileBeingCaptured = this.boardState[currentPos.y + (attackForwardYVal / 2)][currentPos.x + (attackRightXVal / 2)];

                    if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {//if captured piece on opposite team
                        // console.log('VALID ATTACK FORWARD RIGHT');
                        return true;
                    }
                break;


            case JSON.stringify({//case: attack backward right
                y: currentPos.y + attackBackwardYVal,
                x: currentPos.x + attackRightXVal
            }) :

                if (startingTile.getCheckerKing()) {//if checker is king
                    tileBeingCaptured = this.boardState[currentPos.y + (attackBackwardYVal / 2)][currentPos.x + (attackRightXVal / 2)];
                    if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {//if captured piece on opposite team
                        // console.log('VALID ATTACK BACKWARD RIGHT');
                        return true;
                    }
                }
                break;


            case JSON.stringify({//case: attack backward left
                y: currentPos.y + attackBackwardYVal,
                x: currentPos.x + attackLeftXVal
            }) :

                if (startingTile.getCheckerKing()) {//if checker is king
                    tileBeingCaptured = this.boardState[currentPos.y + (attackBackwardYVal / 2)][currentPos.x + (attackLeftXVal / 2)];

                    if (tileBeingCaptured.getCheckerTeam() === this.nextTurn) {//if captured piece on opposite team
                        // console.log('VALID ATTACK BACKWARD LEFT');
                        return true;
                    }
                }
                break;

            default:
                // console.log('PROPOSED ATTACKING MOVE ILLEGAL');
                return false;
        }

        // console.log('PROPOSED ATTACKING MOVE: y:' + requestedPos.y + ', x:' + requestedPos.x + ' INVALID');
        return false;
    }

    canMakeValidAttackingMove(currentPos){//if checker can make valid attack, return true
        // console.log('Checking for valid attacking moves... ');

        let yArray = [-2, -2, 2 ,2];
        let xArray = [-2, 2, 2, -2];
        
        for(let n = 0; n <= 3; n++){
            let potentiallyAttackablePosition = {//define a potentially attackable tile
                y : currentPos.y + yArray[n],
                x : currentPos.x + xArray[n]
            };

            if(this.validateAttackingMove(currentPos, potentiallyAttackablePosition)){//check if its valid
                // console.log('valid attacking move found!');
                return true;
            }
        }
        // console.log('NO valid attacking moves found');
        return false;
    }

    doTravelingMove(currentPos, requestedPos){
        // console.log('Doing travelling move...');
        let startingTile = this.getTileByPosition(currentPos);
        let endingTile = this.getTileByPosition(requestedPos);

        endingTile.placeChecker(startingTile.checker);//place checker
        startingTile.removeChecker();//then remove checker
    }

    doAttackingMove(currentPos, requestedPos){
        // console.log('Doing attacking move...');
        let startingTile = this.getTileByPosition(currentPos);
        let endingTile = this.getTileByPosition(requestedPos);

        endingTile.placeChecker(startingTile.checker);//place checker
        startingTile.removeChecker();//then remove checker
        //then remove checker being captured
        this.boardState[Math.abs(currentPos.y - (currentPos.y - requestedPos.y) / 2)][Math.abs(currentPos.x - (currentPos.x - requestedPos.x) / 2)].removeChecker();

        if(endingTile.getCheckerTeam() === 'red'){
            // console.log('player 1 score incremented');
            this.player1Score += 1;
        } else if(endingTile.getCheckerTeam() === 'blue'){
            // console.log('player 2 score incremented');
            this.player2Score += 1;
        }
    }

    getTileByPosition(position){
        // console.log('getting tile by position...');
        console.log(JSON.stringify(position));

        if(position){
            if(this.boardState[position.y] && this.boardState[position.y][position.x]){//if tile exists
                // console.log('tile exists');
                return this.boardState[position.y][position.x];//return tile
            } else {
                // console.log('tile does not exist');
                return null;//if not, return null
            }
        }

        return null;
    }


    makeKings(){
        let tile;
        let numberOfCols = this.numberOfCols;
        let length = this.boardState.length;

        this.boardState[0].forEach(function (tile, index) {//for each tile on row 0
            if(tile.getCheckerTeam() === 'blue'){//if checker is blue, make checker king
                // console.log('made blue checker king at y: 0, x: ' + index );
                tile.makeCheckerKing();
            }
        });

        this.boardState[this.boardState.length - 1].forEach(function (tile, index) {//for each tile on row 7
            if(tile.getCheckerTeam() === 'red'){//if checker is red, make checker king
                // console.log('made red checker king at y: 7, x: ' + index);
                tile.makeCheckerKing();
            }
        });
    }

    switchCurrentTurn(){
        if(!this.makingAMultiCapturePlay){//if not making multi cap play
            if(this.currentTurn === 'red'){// if red, make blue
                this.currentTurn = 'blue';
                this.nextTurn = 'red';

            } else if(this.currentTurn === 'blue'){//if blue, make red
                this.currentTurn = 'red';
                this.nextTurn = 'blue';
            }
        }
    }

    determineGameover(){
        let reds = [];
        let blues = [];
        let tile;

        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row
                tile = this.boardState[y][x];
                if(tile.getCheckerTeam() === 'red'){//find red checkers
                    reds.push(tile);
                } else if(tile.getCheckerTeam() === 'blue'){//find blue checkers
                    blues.push(tile);
                }
            }
        }

        if(reds.length <= 0){//if none found, game over
            this.gameOver = true;
            this.winningTeam = 'Blue';
            return true;
        } else if(blues.length <= 0){
            this.gameOver = true;
            this.winningTeam = 'Red';
            return true;
        } else {
            this.gameOver = false;
            this.winningTeam = '';
            return false;
        }
    }

    initialiseBoardState(){//sets up the board for play
        let tileIndex = 1;
        let redCheckerIDIndex = 0;
        let blueCheckerIDIndex = 0;
        let tile;

        this.boardState = [
            this.row0 = [],
            this.row1 = [],
            this.row2 = [],
            this.row3 = [],
            this.row4 = [],
            this.row5 = [],
            this.row6 = [],
            this.row7 = []
        ];

        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            tileIndex++;
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row,
                tile = new this.Tile().addCoodinateID(y, x);//build tile

                tileIndex++;
                if(tileIndex & 1)//if tile index is odd
                {
                    tile.addColour('white');
                }
                else
                {
                    tile.addColour('black');

                    if(y >= 0 && y <= 2){
                        tile.addChecker(redCheckerIDIndex,'red');//build red checker
                        redCheckerIDIndex++;
                    }

                    if(y >= 5 && y <= this.boardState.length){
                        tile.addChecker(blueCheckerIDIndex, 'blue');//build blue checker
                        blueCheckerIDIndex++;
                    }
                }


                this.boardState[y].push(tile);
            }
        }
    }

    getBoardStateAsHTML(){
        let boardStateAsHTML = '<div id="board">';
        for(let y = 0; y < this.boardState.length; y++){//for each row in board
            boardStateAsHTML += '<br>';
            for(let x = 0; x < this.numberOfCols; x++){//for each column/position in row
                boardStateAsHTML += this.boardState[y][x].getBoardTileAsHTML();//get board tile as HTML, add to boardstateHTML
            }
        }
        boardStateAsHTML += '</div>';
        return boardStateAsHTML;
    }

    getCurrentTurnAsHTML(){//returns current turn html
        let turnDisplay = '<p id="turnDisplay">';

        if(this.currentTurn === 'red'){
            turnDisplay += "It is Red team's turn."
        } else if(this.currentTurn === 'blue'){
            turnDisplay += "It is Blue team's turn."
        }

        turnDisplay += '</p>';
        return turnDisplay;
    }

    getScoresAsHTML(){//returns scores html
        let scores = '<p id="scores">';
        scores += 'Red Team: ' + this.player1Score + ' - Blue Team: ' + this.player2Score;
        scores += '</p>';

        return scores;
    }

    prettyPrintBoardState(){//for debug
        console.log('Pretty printing the board state...');
        let columnsHeader = '[_]';
        let rowOut = '';
        for(let x = 0; x < this.numberOfCols; x++){
            columnsHeader += '[' + x + ']';
        }

        console.log(columnsHeader);

        for(let y = 0; y < this.boardState.length; y++){//for each row
            rowOut += '[' + y + ']';
            for(let x = 0; x < this.numberOfCols; x++){//for each position in row
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

    initialiseBlankBoardState(){//for testing
        let tileIndex = 1;
        let tile;

        this.boardState = [
            this.row0 = [],
            this.row1 = [],
            this.row2 = [],
            this.row3 = [],
            this.row4 = [],
            this.row5 = [],
            this.row6 = [],
            this.row7 = []
        ];

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

                this.boardState[y].push(tile);
                // console.log('row ' + y + ', position ' + x + ' updated with: ' + tile);
            }
        }
    }


    initialiseCheatBoardState(){//for cheating
        let tileIndex = 1;
        let redCheckerIDIndex = 0;
        let blueCheckerIDIndex = 0;
        let tile;

        this.boardState = [
            this.row0 = [],
            this.row1 = [],
            this.row2 = [],
            this.row3 = [],
            this.row4 = [],
            this.row5 = [],
            this.row6 = [],
            this.row7 = []
        ];

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

                    if(y >= 0 && y <= 2){
                        tile.addChecker(redCheckerIDIndex,'red');
                        redCheckerIDIndex++;
                    }
                }


                this.boardState[y].push(tile);
            }
        }
        this.determineGameover();
    }
}

module.exports = ActiveGame;