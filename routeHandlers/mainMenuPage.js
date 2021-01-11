let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    //set user ID
    if(!req.session.userID){
        req.session.userID = Math.floor((Math.random() * 1000) + 1).toString();//should be random ID
        req.session.username = '';
    }

    req.session.viewCount += 1;
    console.log("cookies: " + req.session.viewCount);

    res.render('mainMenuPage.ejs', {
    });
});

router.post('/', function (req, res) {
    //set username
    req.session.username = req.body.username;

    res.render('mainMenuPage.ejs', {

    });
});

module.exports = router;