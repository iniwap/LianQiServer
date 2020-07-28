var utils = require('../../../util/utils');
var lianQiManager = require('../../../controllers/lianQiManager');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;


//-------------------------------------游戏逻辑处理-------------------------------------------
handler.reqPass = function(msg, session, next) {
  
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');
  
  if(!!!msg.roomId || !!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }

  lianQiManager.onPass(this.app,msg,function(flag,result){
    next(null, result);
  });
};
handler.reqPlay = function(msg, session, next) {
  
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }

  lianQiManager.onPlay(this.app,msg,function(flag,result){
    next(null, result);
  });
};
handler.reqMove = function(msg, session, next) {
 
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }
  
  lianQiManager.onMove(this.app,msg,function(flag,result){
    next(null, result);
  });
};

handler.reqDraw = function(msg, session, next) {
  
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }

  lianQiManager.onDraw(this.app,msg,function(flag,result){
    next(null, result);
  });
};

handler.reqAbandon = function(msg, session, next) {
  
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }

  lianQiManager.onAbandon(this.app,msg,function(flag,result){
    next(null, result);
  });
};

//------------------------------------------------------------------------------------------


