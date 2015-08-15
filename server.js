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
app.set('views',path.join(__dirname,'templates'));
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

/*app.use("/",function(req,res){
    console.log(req.body);
    res.render("scoreboard",{data:req.body});
});*/
//-----mongoose-----------------------------------------------------------------------------
var mongoose = require('mongoose');
var db = mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/ionic-heroku-tennis-test' || "http://localhost:5000");

var ChatSchema = new mongoose.Schema({
    date:String,
    name:String,
    message:String,
    category:String,
    time:Number,
    playername1:String,
    playername2:String,
    winner:String
});
var TennisSchema = new mongoose.Schema({
      startdata:{
        ID:String,
        creater:String,
        player1:String,
        player2:String,
        set:Number,
        game:Number,
        tiebreak:Boolean,
        deuce:Boolean
      }
});
var Chat = db.model('chat',ChatSchema);
var Tennis = db.model('tennis',TennisSchema);

//-----socket.io----------------------------------------------------------------------------
var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    Chat.find(function(err,items){
        if(err){console.log(err);}
        //接続したユーザーにチャットデータを送る
        socket.emit('create-chat',items);
    });
    //-------チャットを表示する----------------------
    socket.on('send-chat',function(data){
        console.log("messageきたぞ");
         var chat = new Chat(data);
         chat.save();
         socket.emit('send-chat',chat);
         socket.broadcast.json.emit('send-chat',chat);
     });
   //----------テニスデータの作成------------------------
   socket.on('tennis-start',function(data){
       console.log("テニスデータが作成されたぞ");
       var tennis = new Tennis();
       console.log
       tennis.startdata = data.tennis;
       tennis.save();
       socket.emit('tennis-start',tennis);
       socket.broadcast.json.emit('tennis-start');
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
