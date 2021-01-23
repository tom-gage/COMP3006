let path = require('path');
let ActiveGame = require('../../objects/ActiveGame');

let express = require('express');
let app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../statics')));//nb: makes statics dir available to server

let playerInQuestion;

//GET, join game
app.get('/boardPage.ejs', function (req, res) {
    console.log('- - - - JOIN GAME REQUEST RECEIVED - - - -');

    let game = joinActiveGame(req, res);

    if(game != null){//if game exists, serve page
        res.render('boardPage.ejs', {
            gameCode : game.code,
            player1ID : game.player1ID,
            player2ID : game.player2ID,
            thisPlayerID : playerInQuestion
        })
    } else {//else, game not found
        res.render('../gameNotFound.ejs');

    }
});

//POST, create game
app.post('/boardPage.ejs', function (req, res) {
    let game;

    if(req.body.requestedAction === 'createGame'){//if create game
        console.log('- - - - CREATE GAME REQUEST RECEIVED - - - -');
        game = createNewActiveGame(req, res);
        console.log('CREATED GAME OBJECT = ' + game);
    }

    //serve page
    res.render('boardPage.ejs', {
        gameCode : game.code,
        player1ID : game.player1ID,
        player2ID : game.player2ID,
        thisPlayerID : playerInQuestion
    });

});


function createNewActiveGame(req, res){
    // let gameCode = Math.floor((Math.random() * 1000) + 1).toString();
    let gameCode = 'G_' + Math.random().toString(36).substr(2, 9);

    let player1ID;

    if(!req.session.userID){
        player1ID = 'U_' + Math.random().toString(36).substr(2, 9);
    } else {
        player1ID = req.session.userID;
    }

    let newGame = new ActiveGame(gameCode, player1ID, 'Not here yet');
    playerInQuestion = newGame.player1ID;

    ACTIVE_GAMES.push(newGame);

    console.log('new game created, gameCode: ' + gameCode + ', player1ID: ' + player1ID);

    return newGame;
}

function joinActiveGame(req, res){
    let targetGame = null;

    ACTIVE_GAMES.forEach(function (game, index) {//for each game in ACTIVE_GAMES
        console.log('GAME CODE: ' + game.code);
        console.log('SEARCH GAME CODE: ' + req.query.gameCode);
        console.log('Joining players ID: ' + game.player2ID);

        let activeGame = game;
        let searchGameCode = req.query.gameCode;

        if(activeGame.code.toString() === searchGameCode.toString()){//if there's an active game with a code matching the submitted code
            if(game.player1ID === req.session.userID){//if player is already in game as player 1, prevents player1 joining their own game
                console.log('JOIN GAME CONDITION, player already in game as player1');

                playerInQuestion = game.player1ID;
                targetGame = game;
            } else if (game.player2ID === req.session.userID){//if player is already in game as player 2
                console.log('JOIN GAME CONDITION, player already in game as player2');

                playerInQuestion = game.player2ID;
                targetGame = game;
            } else if(game.player2ID === 'Not here yet'){//if game has space, add player2 to game, update ACTIVE_GAMES
                console.log('JOIN GAME CONDITION, game has space');
                game.player2ID = req.session.userID;//add player2
                ACTIVE_GAMES.splice(index, 1, game);//at current index: delete game, replace with updated game

                playerInQuestion = game.player2ID;
                targetGame = game;
            }
        }
    });

    return targetGame;
}


// module.exports = router;