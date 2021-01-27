let path = require('path');
let DB = require("../../db/DB.js");

let express = require('express');
let app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../statics')));//nb: makes statics dir available to server



//GET
app.get('/loginPage.ejs', function (req, res) {
    if(!req.session.userID){
        // req.session.userID = Math.floor((Math.random() * 1000) + 1).toString();//should be random ID
        req.session.userID = 'U_' + Math.random().toString(36).substr(2, 9);
    }

    res.render('loginPage.ejs',{
        username : req.session.userID,
        feedback : ''
    });
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
        await handleEditUsernameRequest(req, res);

    } else if(requestedAction === 'editPassword'){
        await handleEditPasswordRequest(req, res);

    } else if(requestedAction === 'deleteAccount'){
        await handleDeleteAccountRequest(req, res);

    } else if(requestedAction === 'logOut'){
        logOut(req, res);
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
            res.render('loginPage.ejs',{
                username : req.session.userID,
                feedback : 'Login failed!'
            });
        }
    }
    else {
        console.log('login failure');
        res.render('loginPage.ejs',{
            username : req.session.userID,
            feedback : 'Login failed!'
        });
    }
}


function handleRegistration(req, res){
    let username = req.body.username;
    let password = req.body.password;

    if(USERS.find(function (user) {//if username is taken
        return user.username === username;
    })){
        console.log('registration failure');
        res.render('loginPage.ejs',{
            username : req.session.userID,
            feedback : 'Registration failed!'
        });
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

async function handleEditUsernameRequest(req, res) {
    console.log('editing username...');
    let UsersModel = DB.getUserModel();

    let username = req.session.userID;
    let newUsername = req.body.newUsername;



    let user = USERS.find(function (user, index) {
        return user.username.toString() === newUsername.toString();
    });

    console.log(username);
    console.log(newUsername);
    console.log(JSON.stringify(user));

    if(!user && newUsername){
        await UsersModel.findOneAndUpdate(
            {
                username : username
            },
            {
                username: newUsername
            });

        await UsersModel.find({}, function (err, users) {
            global.USERS = users;
        });

        req.session.userID = newUsername;

        res.render('loginPage.ejs', {
            username : req.session.userID,
            feedback : 'Username changed to ' + req.session.userID
        });
    } else {
        res.render('loginPage.ejs', {
            username : req.session.userID,
            feedback : 'Username change failed!'
        });
    }
}

async function handleEditPasswordRequest(req, res) {
    console.log('editing password...');
    let UsersModel = DB.getUserModel();

    let username = req.session.userID;

    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;

    if(newPassword){
        let result = await UsersModel.findOneAndUpdate(
            {
                username : username,
                password : currentPassword
            },
            {
                password: newPassword
            });

        console.log('password change result is: ' + result);

        await UsersModel.find({}, function (err, users) {
            global.USERS = users;
        });

        if(result){
            res.render('loginPage.ejs', {
                username : req.session.userID,
                feedback : 'Password changed!'
            });
        } else {
            res.render('loginPage.ejs', {
                username : req.session.userID,
                feedback : 'Password change failed!'
            });
        }

    } else {
        res.render('loginPage.ejs', {
            username : req.session.userID,
            feedback : 'Password change failed!'
        });
    }

}




async function handleDeleteAccountRequest(req, res){
    let UsersModel = DB.getUserModel();
    let username = req.session.userID;
    await UsersModel.deleteOne({ username: username });
    await UsersModel.find({}, function (err, users) {
        global.USERS = users;
    });
    req.session.userID = null;
    res.redirect('mainMenuPage.ejs');
}


function login(req, res) {
    // console.log('login success');
    req.session.userID = req.body.username;//set username to be session id
    res.render('loginPage.ejs', {
        username : req.session.userID,
        feedback : 'Logged in!'
    });
}

function logOut(req, res) {
    req.session.userID = null;
    res.redirect('mainMenuPage.ejs');
}
