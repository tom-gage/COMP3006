let express = require('express');
let session = require('express-session');
let DB = require("../app/utilityClasses/DB.js");

let router = express.Router();


//GET
router.get('/', function (req, res) {
    res.render('loginPage.ejs',{});
});

//POST
router.post('/', async function (req, res) {
    console.log('login page request of type...');
    let requestedAction = req.body.requestedAction;

    if(requestedAction === 'login'){
        console.log('login');
        handleLogin(req, res);

    } else if(requestedAction === 'register'){
        console.log('register');
        handleRegistration(req, res);
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


function login(req, res) {
    console.log('login success');
    req.session.userID = req.body.username;//set username to be session id
    // ACTIVE_USERS.push({username : req.body.username});
    res.redirect('mainMenuPage.ejs');
}

module.exports = router;