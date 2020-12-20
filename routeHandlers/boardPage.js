let ActiveGame = require('../app/objectClasses/ActiveGame');

let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.send('game not found!')
});

router.post('/', function (req, res) {
    let game;

    if(req.body.requestedAction === 'createGame'){//if create game
        console.log('- - - - CREATE GAME REQUEST RECEIVED - - - -');
        game = createNewActiveGame(req, res);
        console.log('CREATED GAME OBJECT = ' + game);
    }

    if (req.body.requestedAction === 'joinGame'){//if join game
        console.log('- - - - JOIN GAME REQUEST RECEIVED - - - -');
        game = joinActiveGame(req, res);
        console.log('JOINED GAME OBJECT = ' + game);
    }

    // console.log('p1ID = ' + game.player1ID);
    // console.log('p2ID = ' + game.player2ID);

    //serve page
    res.render('boardPage.ejs', {
        gameCode : game.code,
        username1 : game.player1ID,
        username2 : game.player2ID,
        testVal : ACTIVE_GAMES
    });

});

function createNewActiveGame(req, res){
    let gameCode = Math.floor((Math.random() * 1000) + 1);
    let player1ID = req.session.userID;

    let newGame = new ActiveGame(gameCode, player1ID, 'Not here yet');

    ACTIVE_GAMES.push(newGame);

    return newGame;
}

function joinActiveGame(req, res){
    let targetGame = null;

    ACTIVE_GAMES.forEach(function (game, index) {//for each game in ACTIVE_GAMES
        console.log('GAME CODE: ' + game.code);
        console.log('SEARCH GAME CODE: ' + req.body.gameCode);
        console.log('Joining players ID: ' + game.player2ID);

        let activeGame = game;
        let searchGameCode = req.body.gameCode;



        if(activeGame.code.toString() === searchGameCode.toString()){//if there's an active game with a code matching the submitted code
            if(game.player1ID === req.session.userID){//if player is already in game as player 1, may seem redundant but it prevents player1 joining their own game
                console.log('FLAG 1');
                targetGame = game;
            } else if (game.player2ID === req.session.userID){//if player is already in game as player 2
                console.log('FLAG 2');
                targetGame = game;
            } else if(game.player2ID === 'Not here yet'){//if game has space
                console.log('FLAG 3');
                game.player2ID = req.session.userID;//add player2
                ACTIVE_GAMES.splice(index, 1, game);//at current index: delete game, replace with updated game
                targetGame = game;
            }
        }
    });

    return targetGame;
}

module.exports = router;