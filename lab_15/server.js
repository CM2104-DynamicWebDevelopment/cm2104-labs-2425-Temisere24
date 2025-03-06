/**
 * @Author: John Isaacs <john>
 * @Date:   01-Mar-19
 * @Filename: server.js
 * @Last modified by:   john
 * @Last modified time: 03-Mar-2024
 */

// Import required modules
const MongoClient = require('mongodb-legacy').MongoClient; // npm install mongodb-legacy
const express = require('express'); // npm install express
const session = require('express-session'); // npm install express-session
const bodyParser = require('body-parser'); // npm install body-parser

const url = 'mongodb://127.0.0.1:27017'; // Database URL
const client = new MongoClient(url); // Create MongoDB client
const dbname = 'profiles'; // Database name

const app = express();

// Configure session
app.use(session({ secret: 'example', resave: false, saveUninitialized: true }));

// Serve static files
app.use(express.static('public'));

// Parse POST request body
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Variable to hold the database
var db;

// Connect to the database and start the server
async function connectDB() {
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    app.listen(8080);
    console.log('Listening for connections on port 8080');
}
connectDB();

//********** GET ROUTES ***************************

// Root route
app.get('/', function(req, res) {
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    
    db.collection('people').findOne({ "login.username": req.session.username }, function(err, loggedInUser) {
        if (err) throw err;
        
        db.collection('people').find().toArray(function(err, users) {
            if (err) throw err;
            res.render('pages/users', { users: users, loggedInUser: loggedInUser });
        });
    });
});




// Login page
app.get('/login', function(req, res) {
    res.render('pages/login');
});

// User profile page
app.get('/profile', function(req, res) {
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    
    var uname = req.query.username;
    db.collection('people').findOne({ "login.username": uname }, function(err, result) {
        if (err) throw err;
        res.render('pages/profile', { user: result });
    });
});

// Route to display update form
app.get('/updateuser', function (req, res) {
  if (!req.session.loggedin) {
    res.redirect('/login');
    return;
  }

  let uname = req.query.username; // Get username from query params

// Add user page
app.get('/adduser', function(req, res) {
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    res.render('pages/adduser');
});

// Remove user page
app.get('/remuser', function(req, res) {
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    res.render('pages/remuser');
});

// Logout route
app.get('/logout', function(req, res) {
    req.session.loggedin = false;
    req.session.username = null;
    req.session.destroy();
    res.redirect('/login');
});

//********** POST ROUTES ***************************

// Login authentication
app.post('/dologin', function(req, res) {
    var uname = req.body.username;
    var pword = req.body.password;

    db.collection('people').findOne({ "login.username": uname }, function(err, result) {
        if (err) throw err;
        if (!result) { res.redirect('/login'); return; }
        
        if (result.login.password === pword) {
            req.session.loggedin = true;
            req.session.username = uname; // Store logged-in username
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});

//update user 



  

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


// Delete user
app.post('/delete', function(req, res) {
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    
    var uname = req.body.username;
    db.collection('people').deleteOne({ "login.username": uname }, function(err, result) {
        if (err) throw err;
        res.redirect('/');
    });
});

// Add new user
app.post('/adduser', function(req, res) {
    if (!req.session.loggedin) { res.redirect('/login'); return; }
    
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
        if (err) throw err;
        console.log('User added successfully');
        res.redirect('/');
    });
});
