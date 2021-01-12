//classes
let ActiveGame = require('./app/objects/ActiveGame');
let Tile = require('./app/objects/Tile');
let Checker = require('./app/objects/Checker');
let TileBuilder = require('./app/utilityClasses/TileBuilder');

//modules
let http = require('http');
let bodyParser = require('body-parser');
let session = require('express-session');
let socketIo = require('socket.io');
let path = require('path');

let mongoose = require('mongoose');
let DB = require('./app/utilityClasses/DB');

let express = require("express");
let app = express();

// //setup database connection
DB.initDBConnection();
let User = DB.getUserModel();

//vars
User.find({}, function (err, users) {
    global.USERS = users;
});

global.ACTIVE_USERS = [];
global.ACTIVE_GAMES = [];

//setup app
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret : 'sessionSecret',
    resave : false,
    saveUninitialized : false
}));

app.use(express.static(path.join(__dirname, 'statics')));//nb: makes statics dir available to server

app.set('view engine', 'ejs');

//setup server
let server = http.createServer(app);

//setup sockets
let io = socketIo(server);

io.on("connection", async function(socket) {
    //on connection
    console.log("Websocket connection established...");

    //on join request
    socket.on('joinRequest', async function(msg) {
        console.log('client join request received, id is: ' + msg);

        handleJoinRequest(JSON.parse(msg));
    });

    //on move request
    socket.on('moveRequest', async function (msg) {
        console.log('move request received: ');
        console.log(msg);

        let moveRequest = JSON.parse(msg);

        await handleMoveRequest(moveRequest);
    })

    socket.on('disconnect', function() {
        console.log('Got disconnect!');

    });
});

//functions
async function handleMoveRequest(moveRequest){
    let targetGame = findActiveGame(moveRequest.gameCode);

    if(targetGame){
        targetGame.makeMove(moveRequest.currentPos, moveRequest.requestedPos, moveRequest.playerID);

        sendEventToPlayers(targetGame,'updateBoard', targetGame.getBoardStateAsHTML());
        sendEventToPlayers(targetGame,'updateTurnDisplay', targetGame.getCurrentTurnAsHTML());

        console.log('sending board update...');
        console.log('sending to (player1): ' + targetGame.player1SocketID);
        console.log('sending to (player2): ' + targetGame.player2SocketID);

        //check for win/loss condition
        if(targetGame.gameOver){
            console.log(targetGame.winningTeam + ' team won!');

            if(targetGame.winningTeam === 'Red'){
                await updatePlayerWins(targetGame.player1ID, targetGame.player2ID);
            } else if(targetGame.winningTeam === 'Blue'){
                await updatePlayerWins(targetGame.player2ID, targetGame.player1ID);
            }

            sendEventToPlayers(targetGame,'updateGameMessage', targetGame.winningTeam + ' team won!');

            updateActiveGame(targetGame, 'delete');
        }
    }
}

function sendEventToPlayers(targetGame, event, msg){
    io.to(targetGame.player1SocketID).emit(event, msg);
    io.to(targetGame.player2SocketID).emit(event, msg);
}


function handleJoinRequest(joinRequest) {
    let targetGame = findActiveGame(joinRequest.gameCode);

    console.log('joining player id: ' + joinRequest.playerID);
    console.log('target game player1 id: ' + targetGame.player1ID);
    console.log('target game player2 id: ' + targetGame.player2ID);

    if(targetGame){
        if(joinRequest.playerID === targetGame.player1ID){
            targetGame.player1SocketID = joinRequest.socketID;

        } else if(joinRequest.playerID === targetGame.player2ID){
            targetGame.player2SocketID = joinRequest.socketID;
        }

        updateActiveGame(targetGame);
        console.log('sending initial board update...');
        // io.emit('updateBoard', targetGame.getBoardStateAsHTML());//THIS SENDS BOARD UPDATE TO ALL USERS, NEEDS FIXING STAT

        sendEventToPlayers(targetGame, 'updateBoard', targetGame.getBoardStateAsHTML());
    }
}


function findActiveGame(gameCode){
    let targetGame = null;
    // console.log('finding active game...');
    targetGame = ACTIVE_GAMES.find(function (ActiveGame, index) {
        return ActiveGame.code.toString() === gameCode.toString();
    });

    return targetGame;
}



function updateActiveGame(updateGame, action){
    // console.log('updating ACTIVE_GAMES...');
    ACTIVE_GAMES.forEach(function (activeGame, index) {//for each game in ACTIVE_GAMES
        if(activeGame.code.toString() === updateGame.code.toString()){//if there's an active game with a code matching the submitted code
            ACTIVE_GAMES.splice(index, 1, updateGame);//at current index: delete game, replace with updated game
            // console.log('active game updated! game code is: ' + updateGame.code);
            if(action === 'delete'){
                ACTIVE_GAMES.splice(index, 1);
            }
        }
    });
}


async function updatePlayerWins(winningPlayer, losingPlayer){
    console.log('a player won, updating database...');
    console.log('adding win:' + winningPlayer);
    console.log('adding loss:' + losingPlayer);

    await User.update(
        {
            username : winningPlayer,
        },
        {
            $inc : { wins : 1}
        });

    await User.update(
        {
            username : losingPlayer,
        },
        {
            $inc : { losses : 1}
        });

}

//routes

//login
let loginRoute = require('./routeHandlers/loginPage.js');
app.use('/loginPage.ejs', loginRoute);

//main menu
let mainMenuRoute = require('./routeHandlers/mainMenuPage');
app.use('/mainMenuPage.ejs', mainMenuRoute);

//board page
let boardPageRoute = require('./routeHandlers/boardPage');
app.use('/boardPage.ejs', boardPageRoute);

//lobby page
let lobbyPageRoute = require('./routeHandlers/lobbyPage');
app.use('/testLobbyPage.ejs', lobbyPageRoute);

//test page
let testPageRoute = require('./routeHandlers/testPage');
app.use('/testPage.ejs', testPageRoute);


app.get('*', function (request, response) {
    response.send('page not found >.<');
});

server.listen(9000, function (request, response) {
    console.log('listening on port 9000');
});





//
//
//
// app.get('/lobbyPage.html', function (req, res) {
//     console.log('test page route reached');
//     res.cookie('myCookie', 'chocolateChip');
//     console.log('Cookies: ', req.cookies);
// });

// app.post('/lobbyPage.html', function (request, response) {
//     console.log(request.body.name + ', ' + request.body.occupation);
//
//     Person.find({
//         name:request.body.name
//     }, function (err, response) {
//         console.log(response);
//     })

    // let newPersonEntry = request.body;
    // if(!newPersonEntry.name || !newPersonEntry.occupation){
    //     response.send();
    // }else{
    //     newPersonEntry = new Person({
    //         name : newPersonEntry.name,
    //         occupation : newPersonEntry.occupation
    //     });
    //
    //     newPersonEntry.save(function (err, Person) {
    //         if(err){
    //             console.log(err);
    //         }
    //         else{
    //             console.log('new person added to database');
    //         }
    //
    //     })
    // }


// });



