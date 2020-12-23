let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.render('testPage.ejs', {

    });
});

router.post('/', function (req, res) {
    res.render('testPage.ejs', {

    });
});

module.exports = router;