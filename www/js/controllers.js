"use strict"

angular.module('starter.controllers', ['ionic','ionic.contrib.frostedGlass'])

.controller('DashCtrl', function($scope) {})

//---view game in real time controller-----------------------------------------------------
.controller('ViewgameCtrl',function($scope){})





.controller('ChatsCtrl', function($scope,socket,$ionicFrostedDelegate,$ionicScrollDelegate) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  
  //-----チャット送信--------------------------------
  var messages = new Array();
  $scope.messages = messages;
  $scope.submitclick = function(){
    var message = angular.element("#chatmessage").val();    
    if(message == ""){
      window.alert("Messageを入力してください");
    }else{
      var data = {
        name:"Masaki",
        message:message,
        category:"chat",
        time:Date.now(),
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
          messages.push(data);
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
