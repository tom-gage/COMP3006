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

let express = require("express");
let app = express();

// //setup database connection
const dbUrl = "mongodb+srv://barnaby:admin@cluster0.3qn4a.mongodb.net/myDatabase?retryWrites=true&w=majority";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}).then(function () {
    console.log('connected to db successfully');
});

let userSchema = mongoose.Schema({
    username:String,
    password:String,
    wins:String,
    losses:String
});

let User = mongoose.model('Users', userSchema);

// User.create({
//     username : 'barnaby',
//     password : 'bleh',
//     wins : '10',
//     losses : '10'
// }, function (err) {
//     if (err) return console.log(err);
// });

//vars
global.ACTIVE_GAMES = [];
User.find({}, function (err, users) {
    console.log('found...');
    console.log(users);
    global.USERS = users;
});




// console.log('USERS contains: ' + USERS);
// console.log('USERS[0]: ' + USERS[0].username);
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

    //TESTING STUFF
    let testActiveGame = new ActiveGame(123, 111, 222);

    testActiveGame.initialiseBoardState();

    let testBoardHTML = testActiveGame.getBoardStateAsHTML();

    // console.log('sending Board Update');
    // socket.emit('updateBoard', testBoardHTML);

    socket.on('joiningHandshake', async function(msg) {
        console.log('client joining handshake received, id is: ' + msg);

        let handshake = JSON.parse(msg);

        let targetGame = findActiveGame(handshake.gameCode);

        console.log('handshake player id: ' + handshake.playerID);
        console.log('target game player1 id: ' + targetGame.player1ID);
        console.log('target game player2 id: ' + targetGame.player1ID);

        if(handshake.playerID === targetGame.player1ID){
            targetGame.player1SocketID = handshake.socketID;
        } else if(handshake.playerID === targetGame.player2ID){
            targetGame.player2SocketID = handshake.socketID;
        }

        updateActiveGame(targetGame);

        console.log('sending initial board update...');
        socket.emit('updateBoard', targetGame.getBoardStateAsHTML());
    });

    socket.on('debug', async function (msg) {
        console.log('DEBUG!');
    });

    socket.on('moveRequest', async function (msg) {
        console.log('move request received: ');
        console.log(msg);

        let move = JSON.parse(msg);

        let targetGame = findActiveGame(move.gameCode);

        if(targetGame){
            targetGame.makeMove(move.currentPos, move.requestedPos, move.playerID);

            //check for win/loss condition
            if(targetGame.gameOver){
                console.log(targetGame.winningTeam + ' team won!');
                io.to(targetGame.player1SocketID).emit('updateGameMessage', targetGame.winningTeam + ' team won!');
                io.to(targetGame.player2SocketID).emit('updateGameMessage', targetGame.winningTeam + ' team won!');
            }


            console.log('sending board update...');
            console.log('sending to (player1): ' + targetGame.player1SocketID);
            console.log('sending to (player2): ' + targetGame.player2SocketID);

            io.to(targetGame.player1SocketID).emit('updateBoard', targetGame.getBoardStateAsHTML());
            io.to(targetGame.player2SocketID).emit('updateBoard', targetGame.getBoardStateAsHTML());

            io.to(targetGame.player1SocketID).emit('updateTurnDisplay', targetGame.getCurrentTurnAsHTML());
            io.to(targetGame.player2SocketID).emit('updateTurnDisplay', targetGame.getCurrentTurnAsHTML());
        }
    })
});

//functions
function findActiveGame(gameCode){
    let targetGame;
    // console.log('finding active game...');
    ACTIVE_GAMES.forEach(function (activeGame, index) {//for each game in ACTIVE_GAMES
        // console.log('Active Game Search: ' + activeGame.code.toString() + ' VS ' + gameCode.toString());
        if(activeGame.code.toString() === gameCode.toString()){//if there's an active game with a code matching the submitted code
            targetGame = activeGame;
            // console.log('game found! game code is: ' + targetGame.code);
        }
    });

    return targetGame;
}

//socket message send handler NEEDED?

function updateActiveGame(updateGame){
    // console.log('updating ACTIVE_GAMES...');
    ACTIVE_GAMES.forEach(function (activeGame, index) {//for each game in ACTIVE_GAMES
        if(activeGame.code.toString() === updateGame.code.toString()){//if there's an active game with a code matching the submitted code
            ACTIVE_GAMES.splice(index, 1, updateGame);//at current index: delete game, replace with updated game
            // console.log('active game updated! game code is: ' + updateGame.code);
        }
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



