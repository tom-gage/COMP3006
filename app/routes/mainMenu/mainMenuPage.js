let path = require('path');
let express = require('express');
let app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../statics')));//nb: makes statics dir available to server

//GET
app.get('/mainMenuPage.ejs', function (req, res) {
    //set user ID
    if(!req.session.userID){
        // req.session.userID = Math.floor((Math.random() * 1000) + 1).toString();//should be random ID
        req.session.userID = 'U_' + Math.random().toString(36).substr(2, 9);

        req.session.username = '';
    }
    //
    // req.session.viewCount += 1;
    // // console.log("cookies: " + req.session.viewCount);

    res.render('mainMenuPage.ejs', {
        highScoresList : getHighScoresList()
    });
});

//POST
app.post('/mainMenuPage.ejs', function (req, res) {
    //set user ID
    if(!req.session.userID){
        // req.session.userID = Math.floor((Math.random() * 1000) + 1).toString();//should be random ID
        req.session.userID = 'U_' + Math.random().toString(36).substr(2, 9);

        req.session.username = '';
    }

    res.render('mainMenuPage.ejs', {
        highScoresList : getHighScoresList()
    });
});

//FUNCTIONS
function getHighScoresList(){
    let HSList = sortUsersByWins(USERS);

    for(let i = 0; i <= 5; i++){
        if(!HSList[i]){
            HSList[i] = {
                username : '',
                wins : '',
                losses : ''
            };
        }
    }

    return HSList;
}


function sortUsersByWins(users){
    let len = users.length;
    for (let i = 0; i < len; i++) {//for each user
        for (let j = 0; j <= len; j++) {

            if(users[j+1]){
                if (users[j].wins < users[j + 1].wins) {
                    let tmp = users[j];
                    users[j] = users[j + 1];
                    users[j + 1] = tmp;
                }
            }
        }
    }
    return users;
}

// module.exports = router;