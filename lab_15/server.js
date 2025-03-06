/**
 * @Author: John Isaacs <john>
 * @Date:   01-Mar-19
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 03-Mar-2024
 */

const MongoClient = require('mongodb-legacy').MongoClient; // npm install mongodb-legacy
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'profiles';

const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser

const app = express();

app.use(session({ secret: 'example', resave: false, saveUninitialized: true }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var db;

connectDB();
async function connectDB() {
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    app.listen(8080);
    console.log('Listening on port 8080');
}

// ********** GET ROUTES **********

// Home Page - Displays all users (Only if logged in)
app.get('/', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    db.collection('people').find().toArray(function(err, result) {
        if (err) {
            console.error("Error fetching users:", err);
            res.redirect('/login');
            return;
        }

        res.render('pages/users', {
            users: result,
            loggedInUser: req.session.user
        });
    });
});

// Login Page
app.get('/login', function(req, res) {
    res.render('pages/login');
});

// Profile Page
app.get('/profile', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var uname = req.query.username;
    
    db.collection('people').findOne({ "login.username": uname }, function(err, result) {
        if (err) {
            console.error("Error fetching user profile:", err);
            res.redirect('/');
            return;
        }

        res.render('pages/profile', {
            user: result
        });
    });
});

// Add User Page
app.get('/adduser', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.render('pages/adduser');
});

// Remove User Page
app.get('/remuser', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.render('pages/remuser');
});

// Logout Route
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});

// ********** NEW UPDATE ROUTES **********

// Update User Page (Displays form pre-filled with user details)
app.get('/updateuser', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var uname = req.query.username;

    db.collection('people').findOne({ "login.username": uname }, function(err, result) {
        if (err || !result) {
            console.error("Error fetching user for update:", err);
            res.redirect('/');
            return;
        }

        res.render('pages/update', { user: result });
    });
});

// ********** POST ROUTES **********

// Login Handler
app.post('/dologin', function(req, res) {
    var uname = req.body.username;
    var pword = req.body.password;

    db.collection('people').findOne({ "login.username": uname }, function(err, result) {
        if (err || !result) {
            console.log("Login failed: User not found");
            res.redirect('/login');
            return;
        }

        if (result.login.password === pword) {
            req.session.loggedin = true;
            req.session.user = result;
            res.redirect('/');
        } else {
            console.log("Incorrect password");
            res.redirect('/login');
        }
    });
});

// Delete User
app.post('/delete', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var uname = req.body.username;

    db.collection('people').deleteOne({ "login.username": uname }, function(err, result) {
        if (err) {
            console.error("Error deleting user:", err);
        }
        res.redirect('/');
    });
});

// Add User
app.post('/adduser', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var datatostore = {
        "gender": req.body.gender,
        "name": { "title": req.body.title, "first": req.body.first, "last": req.body.last },
        "location": { "street": req.body.street, "city": req.body.city, "state": req.body.state, "postcode": req.body.postcode },
        "email": req.body.email,
        "login": { "username": req.body.username, "password": req.body.password },
        "dob": req.body.dob,
        "registered": Date(),
        "picture": { "large": req.body.large, "medium": req.body.medium, "thumbnail": req.body.thumbnail },
        "nat": req.body.nat
    };

    db.collection('people').insertOne(datatostore, function(err, result) {
        if (err) {
            console.error("Error adding user:", err);
        }
        console.log('User added to database');
        res.redirect('/');
    });
});

// ********** NEW UPDATE FUNCTIONALITY **********

// Update User Handler
app.post('/doupdate', function(req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var uname = req.body.username;  // Get the username to identify user

    var updatedData = {
        "gender": req.body.gender,
        "name": { "title": req.body.title, "first": req.body.first, "last": req.body.last },
        "location": { "street": req.body.street, "city": req.body.city, "state": req.body.state, "postcode": req.body.postcode },
        "email": req.body.email,
        "login": { "username": req.body.username, "password": req.body.password },
        "dob": req.body.dob,
        "registered": Date(),
        "picture": { "large": req.body.large, "medium": req.body.medium, "thumbnail": req.body.thumbnail },
        "nat": req.body.nat
    };

    db.collection('people').updateOne(
        { "login.username": uname },
        { $set: updatedData },
        function(err, result) {
            if (err) {
                console.error("Error updating user:", err);
                res.redirect('/');
                return;
            }

            console.log('User updated successfully');
            res.redirect('/');
        }
    );
});
