var express = require('express');
var app = express();

var SpotifyWebApisearchTracks = require("spotify-web-api-node");

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

    spotifyApi.searchTracks(searchterm)
    .then(function (data) { 
      var tracks = data.body.tracks.items; 
      var HTMLResponse = ""; 
  
      for (var i = 0; i < tracks.length; i++) { 
        var track = tracks[i]; 
        console.log(track.name); 
  
        HTMLResponse +=  
          "<div>" + 
          "<h2>" + track.name + "</h2>" + 
          "<h4>" + track.artists[0].name + "</h4>" + 
          "<img src='" + track.album.images[0].url + "'>" + 
          "<a href='" + track.external_urls.spotify + "'> Track Details </a>" + 
          "</div>";  // Fixed the incorrect quotation mark
  
        console.log(HTMLResponse); 
      } 
      
      res.send(HTMLResponse); // Ensure res is defined in the function scope
    })
    .catch(function (err) { 
      console.error(err); 
    });
  
    
app.listen(8080);
