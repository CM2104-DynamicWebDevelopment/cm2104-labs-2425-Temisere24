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
    
    
app.listen(8080);
