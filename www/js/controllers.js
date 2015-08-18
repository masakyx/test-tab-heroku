"use strict"
angular.module('starter.controllers', ['ionic','ionic.contrib.frostedGlass'])
//----------------
//--DashCtrl------
//----------------
.controller('DashCtrl', function($scope,TennisID,socket) {
    var creater = $("#creater"),
        player1 = $("#player1"),
        player2 = $("#player2");
    var id;
    var tennisdata = TennisID.all();
    
    $scope.setChoice = "1";
    $scope.gameChoice = "6";

    $scope.gamestartclick = function(){
      if(creater.val() == "" || player1.val()=="" || player2.val() == ""){
          window.alert("名前を入力してください");
      }else{
        if(confirm("試合データを作成しますか？")){
          tennisdata.creater = creater.val();
          tennisdata.player1 = player1.val();
          tennisdata.player2 = player2.val();
          tennisdata.set = $("input[name='setradio']:checked").val();
          tennisdata.game = $("input[name='gameradio']:checked").val();
          if($("#tiebreak:checked").val()){
            tennisdata.tiebreak = true;
          }else{
            tennisdata.tiebreak = false;
          }
          if($("#deuce:checked").val()){
            tennisdata.deuce = true;
          }else{
            tennisdata.deuce = false;
          }
          socket.emit("tennis-start",{tennis:tennisdata});
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
//--scoreboardCtrl------
//----------------
.controller('scoreboardCtrl',function($scope,TennisID){
    var set1=0,set2=0,game1=0,game2=0,point1=0,point2=0;
    $scope.agcreater = TennisID.all().creater;
    $scope.agplayer1 = TennisID.all().player1;
    $scope.agplayer2 = TennisID.all().player2;
    $scope.agset1 = set1;
    $scope.aggame1 = game1;
    $scope.agpoint1 = point1;
    $scope.agset2 = set2;
    $scope.aggame2 = game2;
    $scope.agpoint2 = point2;

    $scope.click = function(){
      set1++;
      set2 = set2 +2;
      $scope.agset1 = set1;
      $scope.aggame1 = game1;
      $scope.agpoint1 = point1;
      $scope.agset2 = set2;
      $scope.aggame2 = game2;
      $scope.agpoint2 = point2;
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
});
