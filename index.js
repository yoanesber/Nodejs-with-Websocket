var express = require('express'),
    http = require('http');

var app = express();
//Set routing for node_modules folder
app.use('/assets', express.static('node_modules'));
app.get("/", function(req, res){
  var data = {
    //Set user_id randomly
    user_id: Math.floor(Math.random() * 100)
  };
  
  res.render('chat.ejs', data);
}).listen(1337, function(){
  console.log("App is started on port 1337!");
});