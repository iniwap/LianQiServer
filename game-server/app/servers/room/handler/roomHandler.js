var roomManager = require('../../../controllers/roomManager');
var utils = require('../../../util/utils');
var DEF = require('../../../consts/consts');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;

handler.reqJoinRoom = function(msg, session, next) {
  //var userID = session.uid;
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }

  roomManager.onJoinRoom(this.app,msg,function(flag,result){
    if(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_SUCCESS == flag 
      || DEF.ROOM.JOIN_ROOM_RESULT.JOINGROOM_ALREADY_IN_ROOM == flag){
      // put player into room
      if(result.roomId > 0) {
        session.set('roomId', result.roomId);
      }

      session.push('roomId', function(err) {
        if(err) {
          console.error('Set roomId for session service failed! error is : %j', err.stack);
          next(null, {
            flag:DEF.RET_ERROR,
            roomId:0,
            rule:"",
            isRelink:0,
            plazaid:0,
            roomType:0,
            baseScore:0,
          });
        } else {
          next(null, {
              flag:flag,
              roomId:result.roomId,
              rule:result.rule,
              levelId:result.levelId,
              owner:result.owner,
              isRelink:Number(result.isRelink),
              plazaid:result.plazaid,
              roomType:result.roomType,
              baseScore:result.baseScore,
          });
        }
      });
    }else{
      next(null, {
          flag:flag,
          roomId:0,
          rule:"",
          isRelink:0,
          plazaid:0,
          roomType:0,
          baseScore:0,
      });
    }
  });
};

handler.reqCreateRoom = function(msg, session, next) {

  msg.userID = session.get('userID');

  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  roomManager.onCreateRoom(this.app,msg,function(flag,result){
    next(null, result);
  });
};

//notify
handler.enterRoomFinish = function(msg, session,next){
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');
  next();
  if(!!!msg.roomId || !!!msg.userID){
    return;
  }

  roomManager.onPlayerEnter(msg);

}
//notify
handler.notifyStartGame = function(msg, session,next){
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');
  next();
  if(!!!msg.roomId || !!!msg.userID){
    return;
  }

  roomManager.onNotifyStartGame(msg);

}

handler.reqLeaveRoom = function(msg, session, next) {

  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');
  
  if(!!!msg.roomId || !!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  roomManager.onLeaveRoom(msg,function(flag,result){
    next(null, result);
  });
};

handler.playerTalkMsg = function(msg, session, next) {
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{flag:DEF.RET_ERROR});
    return;
  }

  roomManager.onPlayerTalkMsg(msg,function(result){
    next(null,result);
  });
};

handler.heartBeat = function(msg, session, next) {
  next(null, {
    ret: 0
  });
};

handler.reqTrust = function(msg, session, next) {
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');
  
  if(!!!msg.roomId || !!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  roomManager.onTrust(msg,function(result){
    next(null, {
      ret: result
    });
  });
};

handler.playerAct = function(msg, session, next) {
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  roomManager.onPlayerAct(msg,function(result){
    next(null, {
      ret: result
    });
  });
};

handler.reportTalentList = function(msg, session, next) {
  msg.userID = session.get('userID');
  msg.roomId = session.get('roomId');

  if(!!!msg.roomId || !!!msg.userID){
    next(null,{seat:msg.seat,talentList:[]});
    return;
  }

  roomManager.onReportTalentList(msg,function(result){
    next(null, result);
  });
};

handler.reqRoomList = function(msg, session, next) {
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  roomManager.onGetRoomList(msg,function(result){
    next(null, {
      roomList: result
    });
  });
};


