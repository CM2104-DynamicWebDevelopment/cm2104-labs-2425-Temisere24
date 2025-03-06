/**
 * @Author: John Isaacs <john>
 * @Date:   01-Mar-19
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 06-Mar-2025
 */

// Import required modules
const MongoClient = require('mongodb-legacy').MongoClient; // npm install mongodb-legacy
const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser

// Database setup
const url = 'mongodb://127.0.0.1:27017'; // Database URL
const client = new MongoClient(url); // MongoDB client
const dbname = 'profiles'; // Database name

const app = express();

// Session setup
app.use(session({ secret: 'example', resave: false, saveUninitialized: true }));

// Set up middleware
app.use(express.static('public')); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.set('view engine', 'ejs'); // Set view engine to EJS

// Variable to hold our Database
var db;

// Connect to the database
async function connectDB() {
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);

    // Start the server
    app.listen(8080, () => console.log('Listening for connections on port 8080'));
}

connectDB();

//********** GET ROUTES ***************************

// Root route - Display users
app.get('/', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    db.collection('people').find().toArray(function (err, result) {
        if (err) throw err;
        res.render('pages/users', { users: result });
    });
});

// Login route
app.get('/login', function (req, res) {
    res.render('pages/login');
});

// Profile route
app.get('/profile', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var uname = req.query.username;

    db.collection('people').findOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;

        res.render('pages/profile', { user: result });
    });
});

// Add user page
app.get('/adduser', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.render('pages/adduser');
});

// Remove user page
app.get('/remuser', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.render('pages/remuser');
});

// Logout route
app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

//********** UPDATE FUNCTIONALITY ***************************

// Route to display update form
app.get('/updateuser', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    let uname = req.query.username; // Get username from query params

    db.collection('people').findOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;

        if (!result) {
            res.redirect('/');
            return;
        }

        res.render('pages/update', { user: result }); // Pass user data to update.ejs
    });
});

// Route to handle user update form submission
app.post('/doupdate', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    let uname = req.body.username; // Username to update

    let updatedData = {
        $set: {
            "gender": req.body.gender,
            "name": {
                "title": req.body.title,
                "first": req.body.first,
                "last": req.body.last
            },
            "location": {
                "street": req.body.street,
                "city": req.body.city,
                "state": req.body.state,
                "postcode": req.body.postcode
            },
            "email": req.body.email,
            "login.password": req.body.password, // Update password
            "dob": req.body.dob,
            "picture": {
                "large": req.body.large,
                "medium": req.body.medium,
                "thumbnail": req.body.thumbnail
            },
            "nat": req.body.nat
        }
    };

    db.collection('people').updateOne({ "login.username": uname }, updatedData, function (err, result) {
        if (err) throw err;
        console.log('User updated successfully');
        res.redirect('/'); // Redirect back to user list
    });
});

//********** POST ROUTES ***************************

// Login handler
app.post('/dologin', function (req, res) {
    var uname = req.body.username;
    var pword = req.body.password;

    db.collection('people').findOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;

        if (!result) {
            res.redirect('/login');
            return;
        }

        if (result.login.password == pword) {
            req.session.loggedin = true;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});

// Delete user route
app.post('/delete', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var uname = req.body.username;

    db.collection('people').deleteOne({ "login.username": uname }, function (err, result) {
        if (err) throw err;
        res.redirect('/');
    });
});

// Add user route
app.post('/adduser', function (req, res) {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }

    var datatostore = {
        "gender": req.body.gender,
        "name": { "title": req.body.title, "first": req.body.first, "last": req.body.last },
        "location": {
            "street": req.body.street,
            "city": req.body.city,
            "state": req.body.state,
            "postcode": req.body.postcode
        },
        "email": req.body.email,
        "login": { "username": req.body.username, "password": req.body.password },
        "dob": req.body.dob,
        "registered": Date(),
        "picture": { "large": req.body.large, "medium": req.body.medium, "thumbnail": req.body.thumbnail },
        "nat": req.body.nat
    };

    db.collection('people').insertOne(datatostore, function (err, result) {
        if (err) throw err;
        console.log('User added successfully');
        res.redirect('/');
    });
});
