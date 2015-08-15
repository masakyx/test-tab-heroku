angular.module('starter.services', [])


//--socket-factory------------------------------------------------------------------
.factory('socket',function($rootScope){
    //    var socket = io.connect('https://pacific-chamber-3858.herokuapp.com/');
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




.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
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
      creater:"No name",
      player1:"a",
      player2:"a",
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


