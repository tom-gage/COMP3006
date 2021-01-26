let path = require('path');
let DB = require("../../db/DB.js");

let express = require('express');
let app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../statics')));//nb: makes statics dir available to server

//GET
app.get('/loginPage.ejs', function (req, res) {
    res.render('loginPage.ejs',{});
});

//POST
app.post('/loginPage.ejs', async function (req, res) {
    console.log('login page request of type...');
    let requestedAction = req.body.requestedAction;
    console.log(requestedAction);

    if(requestedAction === 'login'){
        handleLogin(req, res);

    } else if(requestedAction === 'register'){
        handleRegistration(req, res);

    } else if(requestedAction === 'editUsername'){
        handleEditUsernameRequest(req, res);

    } else if(requestedAction === 'editPassword'){
        handleEditPasswordRequest(req, res);

    } else if(requestedAction === 'deleteAccount'){
        handleDeleteAccountRequest(req, res);

    }
});

function handleLogin(req, res){
    let username = req.body.username;
    let password = req.body.password;

    if(username && password){
        if(USERS.find(function (user) {//if input matches existing username and pw
            return (user.username === username && user.password === password);
        })) {
            login(req, res);
        }
        else {
            console.log('login failure');
            res.redirect('loginPage.ejs');//no login
        }
    }
    else {
        console.log('login failure');
        res.redirect('loginPage.ejs');//no login
    }
}


function handleRegistration(req, res){
    let username = req.body.username;
    let password = req.body.password;

    if(USERS.find(function (user) {//if username is taken
        return user.username === username;
    })){
        console.log('registration failure');
        res.redirect('loginPage.ejs');//no login
    } else {
        console.log('registration success');
        let newUser = {
            username : username,
            password : password,
            wins : 0,
            losses : 0
        };

        let UsersModel = DB.getUserModel();

        UsersModel.create(newUser, function (err) {
            if (err) return console.log(err);
        });

        USERS.push(newUser);
        login(req, res);
    }
}

function handleEditUsernameRequest(req, res) {

}

function handleEditPasswordRequest(req, res) {

}

function handleDeleteAccountRequest(req, res){

}

function logOut(req, res){

}

function login(req, res) {
    // console.log('login success');
    req.session.userID = req.body.username;//set username to be session id
    // ACTIVE_USERS.push({username : req.body.username});
    res.redirect('mainMenuPage.ejs');
}
