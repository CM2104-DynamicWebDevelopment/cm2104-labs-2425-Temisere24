var express = require('express'); 
var app = express(); 

app.get('/', function(req, res){ 
   res.send ("Hello world!! by Expresss");
}); 


app.get('/test', function(req, res){ 
    res.send("this is route 2"); 
 });

 app.get('/test2', function(req, res){ 
    res.send ("Hello world!! by Expresss, testing routing based on random experimemts ");
 }); 

 

app.get('/joke', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // Fixed header case
    var randomJoke = knockknock(); // Getting a joke
    res.end(randomJoke);
}); // Closing bracket was misplaced

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
