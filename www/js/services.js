angular.module('starter.services', [])


//--socket-factory------------------------------------------------------------------
.factory('socket',function($rootScope){
    //var socket = io.connect('https://tennis-app-ios-0605.herokuapp.com/');
    //var socket = io.connect(location.href+"/");
    //local version ios  ->
    var socket = io.connect(location.host+"/" || "localhost:5000" || "10.0.2.2:5000");
    //local version android ->
    //var socket = io.connect("http://10.0.2.2:5000");
    //var socket = io.connect('http://localhost:5000')
    return {
        on:function(eventName,callback){
          socket.on(eventName,function(){
              var args = arguments;
              $rootScope.$apply(function(){
                  callback.apply(socket,args);
              });
          });
        },
        emit:function(eventName,data,callback){
          socket.emit(eventName,data,function(){
              var args = arguments;
              $rootScope.$apply(function(){
                  if(callback){
                    callback.apply(socket,args);
                  }
              });
          });
        }
    };
})
.factory('TennisDataDetail',function(){
    var tennisdatas = new Array();
    var returndata;
    return {
      all:function(){
        return tennisdatas;
      },
      add:function(data){
        tennisdatas = data;
      },
      get:function(tennisdataId){
        for(var i=0;i<tennisdatas.length;i++){
          if(tennisdatas[i]._id==tennisdataId)return tennisdatas[i];
        }
     }
   }
})
.factory('TennisID',function(){
    var tennisIDs = {
      creater:"No name",
      player1:"112233aabbddcceeii989jyjisegoku",
      player2:"a",
      player3:"",
      player4:"",
      gametype:"1",
      set:1,
      game:6,
      tiebreak:true,
      deuce:true,
      starttime:1
    };
    return {
      all:function(){
        return tennisIDs;
      },
	  set:function(tennisData){
	  	tennisIDs = tennisData;	
	  }
    };
})

.factory('Flick',function($document){

//made function of flick
var if_startX,
    if_startY,
    if_vflag = false,
    if_hflag = false,
    if_begintime,
    if_moveX,
    if_moveY,
    if_isConfirm;
return {
  if_touchstart:function(evt){
    if(evt.touches.length == 1){
      if_vflag=true;
      if_hflag=false;
      if_startX = evt.touches[0].pageX - window.pageXOffset;
      if_startY = evt.touches[0].pageY - window.pageYOffset;
      if_beigntime = new Date().getTime();
      if_moveX = 0;
      if_moveY = 0;
      console.log(if_startX+"/"+if_startY);
    }
  },

  if_touchmove:function(evt){
    var currenttime = new Date().getTime();
    if_moveX = evt.touches[0].pageX - window.pageXOffset - if_startX;
    if_moveY = evt.touches[0].pageY - window.pageYOffset - if_startY;
    if(if_vflag){
      if(if_moveX > window.innerWidth/14 && if_moveY > window.innerGeight/4){
        if_vflag = false;
        if_hflag = true;
        if_startY = evt.touches[0].pageY - window.pageYOffset;
      }
    }
    if(currenttime - if_begintime > 700){
      if_vflag=false;
      if_hflag=false;
      console.log("時間切れ");
    }
    //console.log(if_moveX+"/"+if_moveY);
  },
  if_touchend:function(){
    if(if_hflag && if_moveX > window.innerWidth/4 && Math.abs(if_moveY) < window.innerHeight/14){
      console.log('L字フリック');
    }
  if_vflag=false;
  if_hflag=false;
  },
  moveX:function(){
    return if_moveX;
  },
  moveY:function(){
    return if_moveY;  
  }
}
});


