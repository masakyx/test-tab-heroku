angular.module('starter.services', [])


//--socket-factory------------------------------------------------------------------
.factory('socket',function($rootScope){
    // var socket = io.connect('https://tennis-app-ios-0605.herokuapp.com/');
    //var socket = io.connect(location.href+"/");
    //local version ios  ->
    var socket = io.connect("http://localhost:5000");
    //local version android ->
      //var socket = io.connect("http://10.0.2.2:5000");
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


.factory('Datas',function(){
    var datas = [
      {
        id:0,
        name:"masaki",
        result:45
      },
      {
        id:1,
        name:"daiki",
        result:79
      },
      {
        id:2,
        name:"misaki",
        result:98
      },
      {
        id:3,
        name:"hiroki",
        result:23
      },
      {
        id:4,
        name:"cecilia",
        result:100
      },
      {
        id:5,
        name:"nana",
        result:30
      }
    ];

    return {
      all:function(){
        return datas;
      }
    };
})

.factory('TennisID',function(){
    var tennisIDs = {
      ID:"a",
      realtime:true,
      creater:"No name",
      player1:"a",
      player2:"a",
      player3:"",
      player4:"",
      gametype:"1",
      set:1,
      game:6,
      tiebreak:true,
      deuce:true
    };
    return {
      all:function(){
        return tennisIDs;
      }
    };
});


