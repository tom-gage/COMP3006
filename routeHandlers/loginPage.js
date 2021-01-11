let express = require('express');
var session = require('express-session');
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

        if(USERS.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password){//if login username + password matches a registered user
                req.session.userID = user.username;//set session to be username
                res.render('mainMenuPage.ejs');
            }
        }));

    } else if(req.body.requestedAction === 'register'){
        console.log('register');
        let registeredUsers = [];

        USERS.filter(function(user){
            if(user.username === req.body.username){//if login username matches a registered user
                registeredUsers.push(user);
            }
        });

        if(!registeredUsers.length > 0){
            res.render('loginPage.ejs');//no register
        } else {

        }
    }
    res.render('mainMenuPage.ejs',{});

});


module.exports = router;