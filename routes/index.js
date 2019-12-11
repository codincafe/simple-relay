/********************************************************/
/***** Index Routes *****/
/********************************************************/
var express = require('express');
var router = express.Router();

/* GET Home Page */
router.get('/', (req, res) => {
    var { user } = req.session;

    if (typeof user === 'undefined') {
        res.render('index', {
            title: 'NEM',
            styles: ['/css/sb-admin.css']
        });
    } else {
        res.redirect('/dashboard')
    }
});

/* Login form POST */
router.post('/', (req, res) => {
    var post = req.body;
    var models = req.Core.Models;
    var { username } = post;
    var { password } = post;

    models.Users.Login(username, password, (err, login) => {
        if (err) {
            res.redirect('/?error=true');
        } else {
            req.session.user = login.user;
            res.redirect('/dashboard');
        }
    })
})

module.exports = router;