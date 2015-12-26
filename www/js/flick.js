//made function of flick
var if_startX,
    if_startY,
    if_vflag = false,
    if_hflag = false,
    if_begintime,
    if_moveX,
    if_moveY,
    if_isConfirm;

var Lflick = function(flag){
  if_isConfirm = flag;
  document.addEventListner('touchstart',if_touchstart,false);
  document.addEventListner('touchmove',if_touchmove,false);
  document.addEventListner('touchend',if_touchend,flase);
}
var if_touchstart = function(evt){
  if(evt.touches.length == 1){
    if_vflag=true;
    if_hflag=false;
    if_startX = evt.touches[0].pageX - window.pageXOffset;
    if_startY = evt.touches[0].pageY - window.pageYOffset;
    if_beigntime = new Date().getTime();
    if_moveX = 0;
    if_moveY = 0;
  }
};

var if_touchmove = function(evt){
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
  }
};

var if_touchend = function(evt){
  if(if_hflag && if_moveX > window.innerWidth/4 && Math.abs(if_moveY) < window.innerHeight/14){
      document.removeEventListener('touchstart',if_touchstart,flase);
      document.removeEventListener('touchmove',if_touchmove,flase);
      document.removeEventListener('touchend',if_touchend,flase);
      console.log('L字フリック');
      
    }
  if_vflag=false;
  if_hflag=false;
};
