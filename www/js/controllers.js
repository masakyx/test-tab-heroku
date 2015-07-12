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
  var x = 0;
  var messages = new Array();
  $scope.messages = messages;
  $scope.submitclick = function(){
    var time = Date.now();
    x++;
    socket.emit('create-chat',{name:"masaki",message:x});
    messages.push({
        message:"masaki",
        name:x,
        time:time
    });
    //angular.element(".chat-field").append("<div class='card'><div class='item item-text-wrap'>"+"masaki"+ x +"</div></div>");

  $ionicFrostedDelegate.update();
  $ionicScrollDelegate.scrollBottom(true);
  }
  socket.on('create-chat',function(data){
      $scope.count = data.message;
      console.log("messageがおくられたぞ");
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
