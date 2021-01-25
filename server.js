//modules
let http = require('http');
let bodyParser = require('body-parser');
let session = require('express-session');
let socketIo = require('socket.io');

// let mongoose = require('mongoose');
let DB = require('./app/db/DB');

let express = require("express");
let app = express();

// //setup database connection
DB.initDBConnection();
let User = DB.getUserModel();

global.USERS = [];
User.find({}, function (err, users) {
    global.USERS = users;
});

global.ACTIVE_GAMES = [];

//setup app
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret : 'sessionSecret',
    resave : false,
    saveUninitialized : false
}));


//routes
//login
let loginRoute = require('./app/routes/login/loginPage');
// app.use('/loginPage.ejs', loginRoute);
app.use(loginRoute);

//main menu
let mainMenuRoute = require('./app/routes/mainMenu/mainMenuPage');
app.use(mainMenuRoute);

//board page
let boardPageRoute = require('./app/routes/board/boardPage');
app.use(boardPageRoute);

app.get('*', function (request, response) {
    response.send('404 page not found >.<');
});

//setup server
let server = http.createServer(app);

//setup socket
let io = socketIo(server);
io.on('connection', async function(socket) {
    console.log('connection...');
    require('./app/ws/WS')(socket, io);
});

server.listen(9000, function (request, response) {
    console.log('listening on port 9000');
});

module.exports = app;