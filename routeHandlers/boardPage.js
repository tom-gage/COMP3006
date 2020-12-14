let ActiveGame = require('../app/objectClasses/ActiveGame');

let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    console.log('board page GET');

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

    console.log('game object player1ID = ' + game.player1ID);
    console.log('game object player2ID = ' + game.player2ID);

    //serve page
    res.render('boardPage.ejs', {

        gameCode : game.code,
        username1 : game.player1ID,
        username2: game.player2ID
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
    let targetGame;

    ACTIVE_GAMES.forEach(function (game, index) {
        console.log('GAME CODE: ' + game.code);
        console.log('SEARCH GAME CODE: ' + req.body.gameCode);
        console.log('GAME p2ID: ' + game.player2ID);


        if(game.code.toString() === req.body.gameCode.toString()){
            game.player2ID = req.session.userID;

            targetGame = game;
        }

    });

    return targetGame;
}

module.exports = router;