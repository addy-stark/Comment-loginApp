const express = require('express');
const User = require('../core/user');
const router = express.Router();
const fs = require('fs');
const pool = require('../core/pool');

const user = new User();

router.get('/', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.redirect('/home');
        return;
    }

    res.render('index', {title:"My application"});
})


router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user) {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream('./index.html').pipe(res);

        return;
    }

    res.redirect('/');
});


router.post('/login', (req, res, next) => {


    user.login(req.body.username, req.body.password, function(result) {
        if(result) {

            req.session.user = result;
            req.session.opp = 1;

            res.redirect('/home');


        }else {

            res.send('Username/Password incorrect!');
        }
    })

});


router.post('/register', (req, res, next) => {

    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password
    };

    user.create(userInput, function(lastId) {

        if(lastId) {

            user.find(lastId, function(result) {

                res.render('home', {opp:req.session.opp, name:user.fullname});
            });

        }else {
            console.log('Error creating a new user ...');
        }
    });

});
router.post('/insert', (req, res, next) => {
    let user = req.session.user;
     if (user) {
         var username = user['username'];
         res.statusCode = 200;
         res.setHeader('Content-Type', 'text/plain');
         var content = '';
         req.on('data', function (data) {
             content += data;

             var obj = JSON.parse(content);

             console.log("The UserName is: " + username);
             console.log("The comment is: " + obj.message);
             //var conn = pool.getConnection();
             var comment = obj.message;
             var sql = "UPDATE users SET comment = ? WHERE username = ?";
             pool.query(sql,[comment,username], function (error, results, fields) {
                 if (error) throw error;
                 console.log("Success!");
             });

             //pool.end();
             res.end("Success!");
         });

     }
});
router.get('/functions.js', (req, res, next) => {


        res.writeHead(200, {"Content-Type":"text/javascript"});
        fs.createReadStream("./functions.js").pipe(res);

});

router.get('/test', (req, res, next) => {
    // Check if the session is exist
    res.statusCode == 200;
    res.setHeader('Content-Type', 'application/json');

    //var conn = con.getConnection();

    pool.query('SELECT username,comment FROM test.users', function(error, results, fields){
        if(error) throw error;

        var comments = JSON.stringify(results);

        res.end(comments);
    });


});
// Get loggout page
router.get('/logout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});
router.get('/styles/customStyles.css', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/css');
    fs.createReadStream('./styles/customStyles.css').pipe(res);
});

module.exports = router;