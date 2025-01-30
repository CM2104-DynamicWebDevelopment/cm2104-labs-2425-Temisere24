var express = require('express'); 
var app = express(); 

app.get('/', function(req, res){ 
   res.send ("Hello world!! by Expresss");
}); 


app.get('/test', function(req, res){ 
    res.send("this is route 2"); 
 });
 
app.listen(8080);