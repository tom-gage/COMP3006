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

let express = require("express");
let app = express();

//vars
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

    //TESTING STUFF
    let testActiveGame = new ActiveGame(123, 111, 222);

    testActiveGame.initialiseBoardState();

    let testBoardHTML = testActiveGame.getBoardStateAsHTML();

    console.log('sending Board Update');
    socket.emit('updateBoard', testBoardHTML);

    socket.on('test', async function(msg) {
        console.log('message recieved: ' + msg);
    })
});



//routes
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




// //setup database connection
// const dbUrl = "mongodb+srv://barnaby:admin@cluster0.3qn4a.mongodb.net/myDatabase?retryWrites=true&w=majority";
// mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}).then(function () {
//     console.log('connected to db successfully');
// });
//
// let personSchema = mongoose.Schema({
//     name:String,
//     occupation:String
// });
// let Person = mongoose.model('Person', personSchema);
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



