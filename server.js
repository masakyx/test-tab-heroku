"use strict"
var express = require('express'),
    debug = require('debug')('tennis-score'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');

var app = express();

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 5000);
app.use(favicon(__dirname + '/www/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname,'www')));
app.use(express.static(path.join(__dirname,'www')));

var server = http.createServer(app);
//-----mongoose-----------------------------------------------------------------------------
var mongoose = require('mongoose');
var db = mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/ionic-heroku-tennis-test');

var ChatSchema = new mongoose.Schema({
    name:String,
    message:String
});

var Chat = db.model('chat',ChatSchema);

//-----socket.io----------------------------------------------------------------------------
var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    socket.on('create-chat',function(data){
        console.log("messageきたぞ");
         var chat = new Chat();
         chat.name = data.name;
         chat.message = data.message;
         chat.save();
         socket.emit('create-chat',chat);
         socket.broadcast.json.emit('create-chat',chat);
     }); 
});
//------------------------------------------------------------------------------------------
if(app.get('env') === 'development'){
  app.use(function(err,req,res,next){
    res.status(err.status || 500);
    resrender('error',{
      message: err.message,
      error:err
    })
  });
}

app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render('error',{
      message: err.message,
      error: {}
    });
});

if(process.argv[1] == __filename){
  server.listen(app.get('port'),function(){
    console.log("Express server listening on port" + app.get('port'));
  });
}
/*app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});*/
