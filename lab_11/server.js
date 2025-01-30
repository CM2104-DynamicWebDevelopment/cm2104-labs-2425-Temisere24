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

app.listen(8080);