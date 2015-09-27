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
        realtime:Boolean,
        creater:String,
        player1:String,
        player2:String,
        player3:String,
        player4:String,
        gametype:String,
        set:Number,
        game:Number,
        tiebreak:Boolean,
        deuce:Boolean,
        starttime:Number,
        finishtime:Number
      },
      PointData1:{point:[Number]},
      ServerSide1:{point:[Number]},
      ReturnSide1:{point:[Number]},
      ShotPoint1:{point:[Number]},
      PointData2:{point:[Number]},
      ServerSide2:{point:[Number]},
      ReturnSide2:{point:[Number]},
      ShotPoint2:{point:[Number]},
      PointText:{
        server:[String],
        text:[String]
      }
});
var PPTennisSchema = new mongoose.Schema({
      startdata:{
        ID:String,
        realtime:Boolean,
        creater:String,
        player1:String,
        player2:String,
        player3:String,
        player4:String,
        gametype:String,
        set:Number,
        game:Number,
        tiebreak:Boolean,
        deuce:Boolean,
        starttime:Number,
        finishtime:Number
      },
      PointData1:{point:[Number]},
      ServerSide1:{point:[Number]},
      ReturnSide1:{point:[Number]},
      ShotPoint1:{point:[Number]},
      PointData2:{point:[Number]},
      ServerSide2:{point:[Number]},
      ReturnSide2:{point:[Number]},
      ShotPoint2:{point:[Number]},
      PointText:{
        server:[String],
        text:[String]
      }
});
var Chat = db.model('chat',ChatSchema);
var Tennis = db.model('tennis',TennisSchema);
var ppTennis = db.model('pptennis',PPTennisSchema);

//-----socket.io----------------------------------------------------------------------------
var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    Chat.find(function(err,items){
        if(err){console.log(err);}
        //接続したユーザーにチャットデータを送る
        socket.emit('create-chat',items);
    });
    Tennis.find(function(err,items){
        if(err){console.log(err);}
        //接続したユーザーにテニスデータを送る
        socket.emit('create-tennis',items);
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
       tennis.PointText.server[0]="●";
       tennis.PointText.server[1]="";
       for(var i=0;i<6;i++){
        tennis.PointText.text[i]="0";
       }
       tennis.save();
       socket.emit('tennis-start',tennis);
       socket.broadcast.json.emit('tennis-start',tennis);
   });
   socket.on('point-update',function(data){
       Tennis.findOne({_id:data.dataid},function(err,tennis){
           tennis.PointData1.point=data.pointdata1;
           tennis.PointData2.point=data.pointdata2;
           tennis.ServerSide1.point=data.server1;
           tennis.ServerSide2.point=data.server2;
           tennis.ReturnSide1.point=data.return1;
           tennis.ReturnSide2.point=data.return2;
           tennis.ShotPoint1.point=data.shot1;
           tennis.ShotPoint2.point=data.shot2;
           tennis.PointText.text=data.pointtext;
           tennis.PointText.server=data.server;
           tennis.save();
           socket.emit('point-update',tennis);
           socket.broadcast.json.emit('point-update',tennis);
           console.log("アップデートされたぞ");
        });
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
