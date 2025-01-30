var express = require('express'); 
var app = express(); 

app.get('/', function(req, res){ 
   res.send ("Hello world!! by Expresss");
}); 

app.listen(8080);