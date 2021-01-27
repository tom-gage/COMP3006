//modules
let http = require('http');
let bodyParser = require('body-parser');
let session = require('express-session');
let socketIo = require('socket.io');

let loginRoute = require('./app/routes/login/loginPage');
let mainMenuRoute = require('./app/routes/mainMenu/mainMenuPage');
let boardPageRoute = require('./app/routes/board/boardPage');

let DB = require('./app/db/DB');
let express = require("express");
let app = express();

// //setup database connection
DB.initDBConnection();
let User = DB.getUserModel();

global.ACTIVE_GAMES = [];
global.USERS = [];
User.find({}, function (err, users) {
    global.USERS = users;
});



//setup app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : 'sessionSecret',
    resave : false,
    saveUninitialized : false
}));
//set up routes
//login
app.use(loginRoute);
//main menu
app.use(mainMenuRoute);
//board page
app.use(boardPageRoute);

app.get('*', function (request, response) {
    response.send('404 page not found >.<');
});


//create server
let server = http.createServer(app);

//setup sockets
let io = socketIo(server);
io.on('connection', async function(socket) {
    require('./app/ws/WS')(socket, io);
});


server.listen(9000, function (request, response) {
    console.log('listening on port 9000');
});

module.exports = app;