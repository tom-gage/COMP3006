let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    //set user ID
    if(!req.session.userID){
        req.session.userID = Math.floor((Math.random() * 1000) + 1);//should be random ID
        req.session.username = '';
    }

    req.session.page_views++;

    res.render('mainMenuPage.ejs', {
        pageviews : req.session.page_views
    });
});

router.post('/', function (req, res) {
    //set username
    req.session.username = req.body.username;

    res.render('mainMenuPage.ejs', {
        pageviews : req.session.page_views
    });
});

module.exports = router;