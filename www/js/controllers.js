"use strict"
angular.module('starter.controllers', ['ionic','ionic.contrib.frostedGlass'])
//----------------
//--DashCtrl------
//----------------
.controller('DashCtrl', function($scope,TennisID,socket) {
    var id;
    var tennisdata = TennisID.all();
    
    $scope.setChoice = "1";
    $scope.gameChoice = "6";
    $scope.gametype =  "1";
    $scope.agtiebreak = true;
    $scope.agdeuce = true;
    $scope.player1 = "Player1";
    $scope.player2 = "Player2";

    $scope.choseType = function(){
      if($scope.gametype == "1"){
        $scope.daubles = false;
        $scope.player1 = "Player1";
        $scope.player2 = "Player2";
      }else{
        $scope.daubles = true;
        $scope.player1 = "フォアサイドPlayer1";
        $scope.player2 = "バックサイドplayer2";
        $scope.player3 = "バックサイドPlayer1";
        $scope.player4 = "フォアサイドplayer2";
      }
    }

    $scope.gamestartclick = function(){
      var creater = $scope.agcreater,
          player1 = $scope.agplayer1,
          player2 = $scope.agplayer2,
          player3 = $scope.agplayer3,
          player4 = $scope.agplayer4,
          set = $scope.setChoice,
          game = $scope.gameChoice,
          tiebreak = $scope.agtiebreak,
          deuce = $scope.agdeuce;
      if($scope.gametype == "1"){
        if(creater == null || player1== null || player2== null){
            window.alert("名前を入力してください");
        }else{
          if(confirm("試合データを作成しますか？")){
              tennisdata.creater = creater;
              tennisdata.player1 = player1;
              tennisdata.player2 = player2;
              tennisdata.gametype = "1";
              tennisdata.set = set;
              tennisdata.game = game;
              tennisdata.tiebreak = tiebreak;
              tennisdata.deuce = deuce;
              socket.emit("tennis-start",{tennis:tennisdata});
            }
          }
      }else{
        if(creater == null || player1== null || player2== null || player3==null ||player4 == null){
            window.alert("名前を入力してください");
        }else{
          if(confirm("試合データを作成しますか？")){
              tennisdata.creater = creater;
              tennisdata.player1 = player1;
              tennisdata.player2 = player2;
              tennisdata.player3 = player3;
              tennisdata.player4 = player4;
              tennisdata.gametype = "2";
              tennisdata.set = set;
              tennisdata.game = game;
              tennisdata.tiebreak = tiebreak;
              tennisdata.deuce = deuce;
              socket.emit("tennis-start",{tennis:tennisdata});
          }
        }
      }
    }
       socket.on("tennis-start",function(data){
        tennisdata.ID = data._id;
        console.log(data);
        console.log(tennisdata);
        location.href = "#/tab/dash/scoreboard";
    });
})

//----------------
//--scoreboardCtrl----------------------------------------------------------------
//----------------------
.controller('scoreboardCtrl',function($scope,TennisID){
//---------変数設定--------------------------------------------------------------
    var set1=0,set2=0,game1=0,game2=0,point1=0,point2=0;
    var player1=TennisID.all().player1,
        player2=TennisID.all().player2,
        player3=TennisID.all().player3,
        player4=TennisID.all().player4,
        creater=TennisID.all().creater,
        gametype=TennisID.all().gametype;

    var Nserverchange = 0,
        Nreceiverchange = 0;


//---------初期設定----------------------------------------------------------
    $scope.agcreater = creater;
    $scope.agserver1 = TennisID.all().player1;
    $scope.agrecever1 = TennisID.all().player1;
    $scope.agserver2 = TennisID.all().player2;
    $scope.agrecever2 = TennisID.all().player2;
    $scope.checkserver1 = true;
    if(gametype == "1"){
      $scope.agplayer1 = player1;
      $scope.agplayer2 = player2;
    }else{
      $scope.agplayer1 = player1+" & "+player3;
      $scope.agplayer2 = player2+" & "+player4;
    }
    $scope.agset1 = set1;
    $scope.aggame1 = game1;
    $scope.agpoint1 = point1;
    $scope.agset2 = set2;
    $scope.aggame2 = game2;
    $scope.agpoint2 = point2;
    $scope.serverbutton1 = true;
//-------player1ボタンクリック挙動------------------------------------------------
$scope.servicein1 = function(){  
}
$scope.serviceace1 = function(){  
}
$scope.fault1 = function(){  
}
$scope.returnin1 = function(){  
}
$scope.returnace1 = function(){  
}
$scope.returnmiss1 = function(){  
}
$scope.win1 = function(){  
}
$scope.side1 = function(){  
}
$scope.back1 = function(){  
}
$scope.net1 = function(){  
}
//-------player2ボタンクリック挙動------------------------------------------------
$scope.servicein2 = function(){  
}
$scope.serviceace2 = function(){  
}
$scope.fault2 = function(){  
}
$scope.returnin2 = function(){  
}
$scope.returnace2 = function(){  
}
$scope.returnmiss2 = function(){  
}
$scope.win2 = function(){  
}
$scope.side2 = function(){  
}
$scope.back2 = function(){  
}
$scope.net2 = function(){  
}
//--------チェンジボタンクリック挙動-----------------------------------------------------
$scope.serverchange = function(){
   ServerChange();
}
$scope.courtchange = function(){
}
$scope.pointback = function(){
}
$scope.finishgame = function(){
}
//---------関数------------------------------------------------------------------
  function ServerChange(){
    Nserverchange++;
    Nreceiverchange++;
    if(gametype == "1"){
      if(Nserverchange == 1){
        $scope.checkserver1 = false;
        $scope.checkserver2 = true;
        $scope.serverbutton1 = false;
        $scope.serverbutton2 = true;
      }else if(Nserverchange == 2){
        $scope.checkserver2 = false;
        $scope.checkserver1 = true;
        $scope.serverbutton2 = false;
        $scope.serverbutton1 = true;
        Nserverchange=0;
      }
    }else{
      if(Nserverchange == 1){
        $scope.agserver2 = player2;
        $scope.checkserver1 = false;
        $scope.checkserver2 = true;
        $scope.serverbutton1 = false;
        $scope.serverbutton2 = true;
      }else if(Nserverchange == 2){
        $scope.agserver1 = player3;
        $scope.checkserver2 = false;
        $scope.checkserver1 = true;
        $scope.serverbutton2 = false;
        $scope.serverbutton1 = true;
      }else if(Nserverchange == 3){
        $scope.agserver2 = player4;
        $scope.checkserver1 = false;
        $scope.checkserver2 = true;
        $scope.serverbutton1 = false;
        $scope.serverbutton2 = true;
      }else if(Nserverchange == 4){
        $scope.agserver1 = player1;
        $scope.checkserver2 = false;
        $scope.checkserver1 = true;
        $scope.serverbutton2 = false;
        $scope.serverbutton1 = true;
        Nserverchange=0;
      }
    }
  }
})

//---view game in real time controller-----------------------------------------------------
.controller('ViewgameCtrl',function($scope){})


//----------------
//--ChatsCtrl------
//----------------
.controller('ChatsCtrl', function($scope,socket,$ionicFrostedDelegate,$ionicScrollDelegate,TennisID) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  
  //-----チャット送信--------------------------------
  var messages = new Array();
  var timeData = new Date();
  var month = timeData.getMonth()+1;
  var date = timeData.getFullYear()+"/"+month+"/"+timeData.getDate();
  $scope.messages = messages;
  $scope.submitclick = function(){
    var message = $scope.message;
    console.log($scope.message);
    if(message == ""){
      window.alert("Messageを入力してください");
    }else{
      var timeData = new Date();
      var month = timeData.getMonth()+1;
      var date = timeData.getFullYear()+"/"+month+"/"+timeData.getDate();
      var time = Date.now();
      var data = {
        date:date,
        name:"Masaki",
        message:message,
        category:"chat",
        time:time,
        playername1:"player1",
        playername2:"player2",
        winner:"winner"   
      };
      $scope.message = "";
      socket.emit('send-chat',data);
    }
    $ionicFrostedDelegate.update();
    $ionicScrollDelegate.scrollBottom(true);
  }
  socket.on('create-chat',function(chatdata){
      chatdata.forEach(function(data){
          if(data.date == date){
            messages.push(data);
          }
      });
      $ionicFrostedDelegate.update();
      $ionicScrollDelegate.scrollBottom(true);
  });
  socket.on('send-chat',function(data){
      messages.push(data);
      console.log(data);
      $ionicFrostedDelegate.update();
      $ionicScrollDelegate.scrollBottom(true);
  });
})

/*.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
*/
//---my controller--------------
.controller('DatalistCtrl',function($scope,Datas){
    $scope.datas = Datas.all();
  
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('not',function($scope){
});
