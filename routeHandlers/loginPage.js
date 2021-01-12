let express = require('express');
let session = require('express-session');
let DB = require("C:/Users/Tom/Documents/COMP3006/app/utilityClasses/DB.js");//THIS IS FUCKING WRONG IS IT NOT

let router = express.Router();

//GET
router.get('/', function (req, res) {

    res.render('loginPage.ejs',{});

    // res.send('game not found >.<');
});

//POST
router.post('/', function (req, res) {
    console.log('login page request of type...');

    if(req.body.requestedAction === 'login'){
        console.log('login');

        if(USERS.find(function (user) {//if input matches existing username and pw
            return (user.username === req.body.username && user.password === req.body.password);
        })){
            console.log('login success');
            req.session.userID = req.body.username;//set username to be session id
            res.redirect('mainMenuPage.ejs');
        } else {
            console.log('login failure');
            res.redirect('loginPage.ejs');//no login
        }

    } else if(req.body.requestedAction === 'register'){
        console.log('register');

        if(USERS.find(function (user) {
            return user.username === req.body.username;
        })){
            console.log('registration failure');
            res.redirect('loginPage.ejs');//no login
        } else {
            console.log('registration success');
            let newUser = {
                username : req.body.username,
                password : req.body.password,
                wins : 0,
                losses : 0
            };

            let UsersModel = DB.getUserModel();

            UsersModel.create(newUser, function (err) {
                if (err) return console.log(err);
            });

            USERS.push(newUser);

            req.session.userID = req.body.username;//set session to be username
            res.redirect('mainMenuPage.ejs');
        }

    }
});


module.exports = router;