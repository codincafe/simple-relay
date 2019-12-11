/********************************************************/
/***** Dashboard Routes *****/
/********************************************************/
var express = require('express');
var router = express.Router();

/* GET Dashboard Page */
router.get('/', (req, res) => {
    res.render('dashboard', {
        title: 'NEM',
        styles: ['/css/sb-admin.css'],
        scripts: ['/js/sb-admin.min.js']
    });
});

module.exports = router;