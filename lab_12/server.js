var express = require('express');
var app = express();



app.use(express.static('public'))
app.get('/', function(req, res){
   res.send("Hello world! by express");
});

 var express = require('express');
 var app = express();
 var spotifyWebApi = require('spotify-web-api-node');
 app.use(express.static('public'))

 var spotifyApi = new spotifyWebApi({
    clientId: '0db5cf585b37467bb067928f1d7118a6',

    clientSecret: '57b64541cd7d4e4d91dfc7ad8074a72b'

 });


  // Retrieve an access token 
spotifyApi.clientCredentialsGrant().then( 
    function (data) { 
    console.log('The access token expires in ' + data.body['expires_in']); 
    console.log('The access token is ' + data.body['access_token']); 
    
    // Save the access token so that it's used in future calls 
    spotifyApi.setAccessToken(data.body['access_token']); 
    }, 
    function (err) { 
    console.log( 
    'Something went wrong when retrieving an access token', 
    err.message 
            ); 
    }); 


    async function getTracks(searchterm, res) { 
        spotifyApi.searchTracks(searchterm) 
        .then(function (data) { 
        res.send(JSON.stringify(data.body)); 
        }, function (err) { 
        console.error(err); 
        }); 
        }

        //route for love in tracks, artists and albums 
app.get('/searchLove', function (req, res) { 
    getTracks('love', res); 
    }); 

    const express = require("express");
    const SpotifyWebApi = require("spotify-web-api-node");
    
    const app = express();
    const port = 8080;
    
    // Serve static files from "public" directory
    app.use(express.static("public"));
    
    // Initialize Spotify API with your credentials
    const spotifyApi = new SpotifyWebApi({
      clientId: "0db5cf585b37467bb067928f1d7118a6",
      clientSecret: "57b64541cd7d4e4d91dfc7ad8074a72b",
    });
    
    // Retrieve and set an access token
    spotifyApi.clientCredentialsGrant().then(
      function (data) {
        console.log("✅ Access token retrieved!");
        console.log("🔑 Expires in " + data.body["expires_in"] + " seconds");
        spotifyApi.setAccessToken(data.body["access_token"]);
      },
      function (err) {
        console.error("❌ Error retrieving access token:", err.message);
      }
    );
    
    // Function to fetch tracks from Spotify API
    async function getTracks(searchterm, res) {
      try {
        const data = await spotifyApi.searchTracks(searchterm);
        const tracks = data.body.tracks.items;
        let HTMLResponse = "";
    
        tracks.forEach((track) => {
          HTMLResponse += `
            <div>
              <h2>${track.name}</h2>
              <h4>${track.artists[0].name}</h4>
              <img src="${track.album.images[0]?.url}" alt="Album cover">
              <a href="${track.external_urls.spotify}" target="_blank">Track Details</a>
            </div>`;
        });
    
        res.send(HTMLResponse);
      } catch (err) {
        console.error("❌ Error fetching tracks:", err);
        res.status(500).send("Error retrieving tracks.");
      }
    }
    
    // Route for searching "love" tracks
    app.get("/searchLove", (req, res) => {
      getTracks("love", res);
    });
    
    // Route for dynamic searches
    app.get("/search", (req, res) => {
      const searchterm = req.query.q;
      if (!searchterm) {
        return res.status(400).send("❌ Please provide a search term.");
      }
      getTracks(searchterm, res);
    });
    
    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
    
  
    
app.listen(8080);
