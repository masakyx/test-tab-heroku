"use strict"
angular.module('starter.controllers',['ui.bootstrap','ionic','ionic.contrib.frostedGlass'])
//----------------
//--DashCtrl------
//----------------
.controller('DashCtrl', function($scope,TennisID,socket,$ionicPopup) {
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
        $scope.player2 = "フォアサイドplayer2";
        $scope.player3 = "バックサイドPlayer1";
        $scope.player4 = "バックサイドplayer2";
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
          var alertPopup = $ionicPopup.alert({
            title:"名前を入力してください。"
          });
        }else{
          var confirmPopup = $ionicPopup.confirm({
            title:"試合データを作成しますか？",
            template:"試合データが作成された場合、リアルタイムに試合状況が配信されます。"
        });
          confirmPopup.then(function(res){
            if(res){
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
          });
        }
      }else{
        if(creater == null || player1== null || player2== null || player3==null ||player4 == null){
          var alertPopup = $ionicPopup.alert({
            title:"名前を入力してください。"
          });
        }else{
          var confirmPopup = $ionicPopup.confirm({
            title:"試合データを作成しますか？",
            template:"試合データが作成された場合、リアルタイムに試合状況が配信されます。"
          });
          confirmPopup.then(function(res){
            if(res){
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
          });
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
.controller('scoreboardCtrl',function($scope,TennisID,$ionicPopup){
//---------変数設定--------------------------------------------------------------
    var setpoint1=0,setpoint2=0,gamepoint1=0,gamepoint2=0,point1=0,point2=0;
    var winner="途中で終了しました。";
    var isTiebreak = false,
        foreback = 0,//0=fore,1=back
        faultcount=0;//0=fault,1=double fault

    var player1=TennisID.all().player1,
        player2=TennisID.all().player2,
        player3=TennisID.all().player3,
        player4=TennisID.all().player4,
        creater=TennisID.all().creater,
        gametype=TennisID.all().gametype,
        setcount=TennisID.all().set,
        gamecount=TennisID.all().game;

    var Nserverchange = 0,
        Nreceiverchange = 0;


//---------初期設定----------------------------------------------------------
    $scope.agcreater = creater;
    $scope.agserver1 = TennisID.all().player1;
    $scope.agreceiver1 = TennisID.all().player1;
    $scope.agserver2 = TennisID.all().player2;
    $scope.agreceiver2 = TennisID.all().player2;
    if(gametype == "1"){
      $scope.agplayer1 = player1;
      $scope.agplayer2 = player2;
    }else{
      $scope.agplayer1 = player1+" & "+player3;
      $scope.agplayer2 = player2+" & "+player4;
    }
    $scope.agset1 = setpoint1;
    $scope.aggame1 = gamepoint1;
    $scope.agpoint1 = point1;
    $scope.agset2 = setpoint2;
    $scope.aggame2 = gamepoint2;
    $scope.agpoint2 = point2;
    $scope.serverbutton1 = true;
    $scope.checkserver1 = true;
    $scope.faultbutton1 = true;
    $scope.strokebutton1 = true;
    $scope.strokebutton2 = true;
    //-------player1ボタンクリック挙動------------------------------------------------
$scope.servicein1 = function(){
  displayReceiver();
  var confirmPopup = $ionicPopup.confirm({
    title:'Fore or Back',
    template:"フォアハンドかバックハンドを押してください。",
    cancelText:"Back Hand",
    cancelType:"button-calm",
    okText:"Fore Hand",
    okType:"button-energized"
  });
  confirmPopup.then(function(res){
    if(res){
      console.log("back!!!");
    }else{
      console.log("fore!!");
    }
  })

}
$scope.serviceace1 = function(){
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.fault1 = function(){
  $scope.faultbutton1=false;
  $scope.doublefaultbutton1=true;
}
$scope.doublefault1 = function(){
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.returnin1 = function(){  
  displayType(5);
}
$scope.returnace1 = function(){  
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.returnmiss1 = function(){  
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.win1 = function(){  
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.side1 = function(){  
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.back1 = function(){  
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.net1 = function(){  
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
//-------player2ボタンクリック挙動------------------------------------------------
$scope.servicein2 = function(){
  displayReceiver();
}
$scope.serviceace2 = function(){  
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.fault2 = function(){  
  $scope.faultbutton2=false;
  $scope.doublefaultbutton2=true;
}
$scope.doublefault2 = function(){
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.returnin2 = function(){  
  displayType(5);
}
$scope.returnace2 = function(){
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.returnmiss2 = function(){
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.win2 = function(){  
  point2++;
  displayServer();
  ClickPoint(2,point2);
}
$scope.side2 = function(){  
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.back2 = function(){  
  point1++;
  displayServer();
  ClickPoint(1,point1);
}
$scope.net2 = function(){  
  point1++;
  displayServer();
  ClickPoint(1,point1);
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
//---------モーダルダイアログ----------------------------------------------------
$scope.fore = function(){
  location.href = "#/tab/dash/scoreboard";
}
$scope.back = function(){
  window.alert("ダイアログーーー");
}
//---------関数------------------------------------------------------------------
function ScorePoint(check,point){
     if(point == 1){
       if(check==1){$scope.agpoint1="15";
       }else if(check==2){$scope.agpoint2="15";}                  
     }else if(point == 2){
       if(check==1){$scope.agpoint1="30";
       }else if(check==2){$scope.agpoint2="30";}                  
     }else if(point == 3 && point1 < 3 || point == 3 && point2 < 3){
       if(check==1){$scope.agpoint1="40";
       }else if(check==2){$scope.agpoint2="40";}                  
     }else if(point1 == 3 && point2 == 3){
       $scope.agpoint1="DEUCE";
       $scope.agpoint2="DEUCE";
     }else if(point1 == 3 && point2 == 4 || point1 == 4 && point2 == 3){
       if(point1 > point2){
         $scope.agpoint1="Ad";
       }else if(point2 > point1){
         $scope.agpoint2="Ad";
       }
     }else if(point1 == 4 && point2 == 4){
       point1 = 3; point2 = 3;
       $scope.agpoint1="DEUCE"; $scope.agpoint2="DEUCE";
     }else if(point1 == 3 && point2 == 5 || point1 == 5 && point2 == 3){
       if(point1 > point2){
         gamepoint1++;
         GamePoint(1,gamepoint1);
       }else if(point2 > point1){
         gamepoint2++;
         GamePoint(2,gamepoint2);
       }
     }else if(point1 == 4 && point2 < 3){
       gamepoint1++;
       GamePoint(1,gamepoint1);
     }else if(point2 == 4 && point1 < 3){
       gamepoint2++;
       GamePoint(2,gamepoint2);
     }     
}

function GamePoint(check,gamepoint){
  foreback = 0;//fore
  ServerChange();
  if(gamepoint < gamecount || gamepoint1 == gamecount && gamepoint2 == (gamecount-1) || gamepoint1 == (gamecount-1) && gamepoint2 == gamecount ){
    ClearPoint();
    if(check==1){$scope.aggame1=gamepoint1
    }else if(check==2){$scope.aggame2=gamepoint2}                  
  }else if(gamepoint == gamecount && gamepoint1 < (gamecount-1) || gamepoint == gamecount && gamepoint2 <(gamecount-1) || gamepoint1 == (gamecount+1) && gamepoint2 == (gamecount-1) || gamepoint1 == (gamecount-1) && gamepoint2 == (gamecount+1)){
    if(gamepoint1 > gamepoint2){
      setpoint1++;
      SetPoint(1,setpoint1);
    }else if(gamepoint1 < gamepoint2){
      setpoint2++;
      SetPoint(2,setpoint2);
    }
  }else if(gamepoint1 == gamecount && gamepoint2 == gamecount){
    isTiebreak=true;//タイブレイク　スタート
    ClearPoint();
    $scope.aggame1="TIE BREAK";
    $scope.aggame2="TIE BREAK";
  }
}


function TieBreak(check,point){
  if((point1+point2)%2 == 1){
    ServerChange();
  }
  if(point < 7 || point1 > 5 && point2 > 5 && (point1-point2) == 1 || point1 > 5 && point2 > 5 && (point2-point1)==1 || point1 == point2){
    if(check==1){$scope.agpoint1=point1;
    }else if(check==2){$scope.agpoint2=point2;}
  }else if(point1 > 5 && point2 > 5 && (point1-point2)==2 || point1 > 5 && point2 > 5 && (point2-point1)==2 || point1 == 7 && point2 < 6 || point1 < 6 && point2 == 7){
    $scope.aggame1="0";
    $scope.aggame2="0";
    isTiebreak=false; //タイブレイク終了
    if(point1 > point2){
      gamepoint1++;
      setpoint1++;
      SetPoint(1,setpoint1);
    }else if(point2 > point1){
      gamepoint2++;
      setpoint2++;
      SetPoint(2,setpoint2);
    }
    ClearPoint();
  }
}
function SetPoint(check,setpoint){
  //セットポイントのカウント
  //ゲームカウントの保存
  ClearPoint();
  gamepoint1=0;
  gamepoint2=0;
  $scope.aggame1="0";
  $scope.aggame2="0";
  if(check==1){$scope.agset1=setpoint1;
  }else if(check==2){$scope.agset2=setpoint2;}
  var time1 = new Date(),
      year1 = time1.getFullYear(),
      month1 = time1.getMonth()+1,
      day1 = time1.getDate(),
      ji1 = time1.getHours(),
      hun1 = time1.getMinutes(),
      byo1 = time1.getSeconds(),
      finishtime = year1+"年"+month1+"月"+day1+"日"+ji1+"時"+hun1+"分"+byo1+"秒";
  
  if(setcount == 1){
      if(setpoint1 == 1){
        if(gametype=="1"){winner=player1;
        }else{winner=player1+" & "+player3;}
        console.log(winner + "が勝者です");
        FinishGame();
      }else if(setpoint2 == 1){
        if(gametype=="1"){winner=player2;
        }else{winner=player2+" & "+player4;}
        console.log(winner + "が勝者です");
        FinishGame();
      }                                              
  }else if(setcount == 3){
      if(setpoint1 == 2){
        if(gametype=="1"){winner=player1;
        }else{winner=player1+" & "+player3;}
        console.log(winner + "が勝者です");
        FinishGame();
      }else if(setpoint2 == 2){
        if(gametype=="1"){winner=player2;
        }else{winner=player2+" & "+player4;}
        console.log(winner + "が勝者です");
        FinishGame();
      }
  }else if(setcount == 5){
      if(setpoint1 == 3){
        if(gametype=="1"){winner=player1;
        }else{winner=player1+" & "+player3;}
        console.log(winner + "が勝者です");
        FinishGame();
      }else if(setpoint2 == 3){
        if(gametype=="1"){winner=player2;
        }else{winner=player2+" & "+player4;}
        console.log(winner + "が勝者です");
        FinishGame();
      }
    }
}
function FinishGame(){
       window.alert("ゲーム終了です。トップページへ戻ります！！試合結果の詳細は”試合データ”をみてください！！");
        location.href = "#/tab/dash";
}
function ClearPoint(){
  point1=0;
  point2=0;
  $scope.agpoint1="0";
  $scope.agpoint2="0";
}

function ClickPoint(check,point){
  if(!isTiebreak){
    ScorePoint(check,point);
  }else if(isTiebreak){
    TieBreak(check,point);
  }
}
  function ServerChange(){
    Nserverchange++;
    if(gametype == "1"){
      switch (Nserverchange){
        case 1:
          displayType(2);
            break;
        case 2:  
          displayType(1);
          Nserverchange=0;
          break;
      }
    }else{
      switch (Nserverchange){
        case 1:
          $scope.agserver2 = player2;
          displayType(2);
          break;
        case 2:
          $scope.agserver1 = player3;
          displayType(1);
          break;
        case 3:
          $scope.agserver2 = player4;
          displayType(2);
          break;
        case 4:
          $scope.agserver1 = player1;
          displayType(1);
          Nserverchange=0;
          break;
      }
    }
  }
  function displayServer(){
    if(gametype == "1"){
      if(Nserverchange == 1){
        $scope.agserver2 == player2;
        displayType(2);
      }else{
        $scope.agserver1 == player1;
        displayType(1);
      }
    }else if(gametype == "2"){
      switch (Nserverchange){
        case 0:
          $scope.agserver1 = player1;
          displayType(1);
          break;
        case 1:
          $scope.agserver2 = player2;
          displayType(2);
          break;
        case 2:
          $scope.agserver1 = player3;
          displayType(1);
          break;
        case 3:
          $scope.agserver2 = player4;
          displayType(2);
          break;
        case 4:
          $scope.agserver1 = player1;
          displayType(1);
          break;
      }
    }
  }
  function displayReceiver(){
    if((point1+point2)%2==0){
      foreback=0;
    }else{
      foreback=1;
    }
    if(gametype == "1"){
      if(Nserverchange == 1){
        $scope.agreceiver1 = player1;
        displayType(3);
      }else{
        $scope.agreceiver2 = player2;
        displayType(4);
      }
    }else{
      if(Nserverchange == 1 || Nserverchange == 3){
        if(foreback == 0){
          $scope.agreceiver1 = player1;
        }else{
          $scope.agreceiver1 = player3;
        }
        displayType(3);
      }else{
        if(foreback == 0){
          $scope.agreceiver2 = player2;
        }else{
          $scope.agreceiver2 = player4;
        }
        displayType(4);
      }
    }
  }
  function displayType(type){
    switch (type){
      case 1:
        $scope.serverbutton1=true;
        $scope.serverbutton2=false;
        $scope.checkserver1=true;
        $scope.checkserver2=false;
        $scope.checkreceiver1=false;
        $scope.checkreceiver2=false;
        $scope.returnbutton1=false;
        $scope.returnbutton2=false;
        $scope.shotbutton1=false;
        $scope.shotbutton2=false;
        $scope.faultbutton1=true;
        $scope.faultbutton2=false;
        $scope.doublefaultbutton1=false;
        $scope.doublefaultbutton2=false;
        break;
      case 2:
        $scope.serverbutton1=false;
        $scope.serverbutton2=true;
        $scope.checkserver1=false;
        $scope.checkserver2=true;
        $scope.checkreceiver1=false;
        $scope.checkreceiver2=false;
        $scope.returnbutton1=false;
        $scope.returnbutton2=false;
        $scope.shotbutton1=false;
        $scope.shotbutton2=false;
        $scope.faultbutton1=false;
        $scope.faultbutton2=true;
        $scope.doublefaultbutton1=false;
        $scope.doublefaultbutton2=false;
        break;
      case 3:
        $scope.serverbutton1=false;
        $scope.serverbutton2=false;
        $scope.checkserver1=false;
        $scope.checkserver2=false;
        $scope.checkreceiver1=true;
        $scope.checkreceiver2=false;
        $scope.returnbutton1=true;
        $scope.returnbutton2=false;
        $scope.shotbutton1=false;
        $scope.shotbutton2=false;
        $scope.faultbutton1=false;
        $scope.faultbutton2=false;
        $scope.doublefaultbutton1=false;
        $scope.doublefaultbutton2=false;
        break;
      case 4:
        $scope.serverbutton1=false;
        $scope.serverbutton2=false;
        $scope.checkserver1=false;
        $scope.checkserver2=false;
        $scope.checkreceiver1=false;
        $scope.checkreceiver2=true;
        $scope.returnbutton1=false;
        $scope.returnbutton2=true;
        $scope.shotbutton1=false;
        $scope.shotbutton2=false;
        $scope.faultbutton1=false;
        $scope.faultbutton2=false;
        $scope.doublefaultbutton1=false;
        $scope.doublefaultbutton2=false;
        break;
      case 5:
        $scope.serverbutton1=false;
        $scope.serverbutton2=false;
        $scope.checkserver1=false;
        $scope.checkserver2=false;
        $scope.checkreceiver1=false;
        $scope.checkreceiver2=false;
        $scope.returnbutton1=false;
        $scope.returnbutton2=false;
        $scope.shotbutton1=true;
        $scope.shotbutton2=true;
        $scope.faultbutton1=false;
        $scope.faultbutton2=false;
        $scope.doublefaultbutton1=false;
        $scope.doublefaultbutton2=false;
        break;
    }
  }
  function ComfirmSide(){
    $modal.open({
        templateUrl:"comfirmhand.html"
    });
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
