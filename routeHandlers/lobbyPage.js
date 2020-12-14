let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {

});

router.post('/', function (req, res) {
    req.session.page_views++;

    console.log(req.body);
    console.log(req.session.username);

    res.render('testLobbyPage', {
        username1 : req.session.username,
        username2: '',
        pageviews: req.session.page_views
    });
});

module.exports = router;