var utils = require('../../../util/utils');
var DEF = require('../../../consts/consts');
var lobbyManager = require('../../../controllers/lobbyManager');


module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;

handler.reqPlazaList = function(msg, session, next) {
  var game = msg.game // = 1 lianqi

  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  var result = lobbyManager.getPlazaConfig();
  if(result == null){
    next(null,{ret:DEF.RET_ERROR});
  }else{
    next(null, {
      plazaList: result
    });
  }
};

handler.reqPropList = function(msg, session, next) {
  var game = msg.game // = 1 lianqi

  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  var result = lobbyManager.getPropConfig();
  if(result == null){
    next(null,{ret:DEF.RET_ERROR});
  }else{
    next(null, {
      propList: result
    });
  }
};

handler.reqStoreList = function(msg, session, next) {
  var game = msg.game // = 1 lianqi

  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  var result = lobbyManager.getStoreConfig();
  if(result == null){
    next(null,{ret:DEF.RET_ERROR});
  }else{
    next(null, {
      storeList: result
    });
  }
};

handler.reqSignInLuckDrawData = function(msg, session, next) {
  var game = msg.game;// = 1 lianqi
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }
  var signin = lobbyManager.getSignInConfig();
  var luckdraw = lobbyManager.getLuckDrawConfig();

  // 这里还要获取该用户是否抽奖过，签到过以及第几天

  if(signin == null || luckdraw == null){
    next(null,{ret:DEF.RET_ERROR});
  }else{
    next(null, {
          hasDrawed:0,
          hasSigned:0,
          signInDay:1,
          signData: signin,
          luckData:luckdraw,
    });
  }
};

//签到
handler.reqSignIn = function(msg, session, next) {

  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  var game = msg.game;// = 1 lianqi
  
  lobbyManager.onSigin(this.app,msg,function(err,result){
    next(null, result);
  });

};
//抽奖
handler.reqLuckDraw = function(msg, session, next) {
  var game = msg.game;// = 1 lianqi
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.onLuckDraw(this.app,msg,function(err,result){
    next(null, result);
  });
};

//----------------- 以下和具体的用户有关或者不希望每次修改都重启服务器，无法启动服务器的时候就读取好--------------
handler.reqPackageList = function(msg, session, next) {
  var game = msg.game // = 1 lianqi
  
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.getUserPackage(this.app,msg,function(err,result){
    next(null, {
      packageList: result
    });
  });
};

handler.reqSysMsgList = function(msg, session, next) {
  var game = msg.game // = 1 lianqi
  
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.getNoticeMsg(this.app,msg,function(err,result){
    next(null, {
      sysMsgList: result
    });
  });
};

handler.reqPrivateMsgList = function(msg, session, next) {
  var game = msg.game // = 1 lianqi
  
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.getUserEmail(this.app,msg,function(err,result){
    next(null, {
      privateMsgList: result
    });
  });
};

handler.reqUpdateEmail = function(msg, session, next) {  
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{type:msg.type,awardEmailId:DEF.RET_ERROR});
    return;
  }

  lobbyManager.updateUserEmail(this.app,msg,function(err,result){
    if(err == DEF.RET_ERROR){
      next(null,{type:msg.type,awardEmailId:DEF.RET_ERROR});
    }else{
      next(null,result);
    }
  });
};
handler.reqFeedback = function(msg, session, next) {  
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{type:msg.type,content:"非法请求"});
    return;
  }

  lobbyManager.onFeedback(this.app,msg,function(err,result){
    if(err == DEF.RET_ERROR){
      next(null,{type:msg.type,content:"系统错误，反馈失败"});
    }else{
      next(null,result);
    }
  });
};

handler.reqOpenTalentslot = function(msg, session, next) {  
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{result:1,currentOpenedCnt:0});
    return;
  }

  lobbyManager.onOpenTalentslot(this.app,msg,function(err,result){
      next(null,result);
  });
};

handler.reqChangeNickName = function(msg, session, next) {
  var game = msg.game // = 1 lianqi

  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.changeNickName(this.app,msg,function(err,result){
    next(null, {
      flag: err
    });
  });
}

handler.reqRankList = function(msg, session, next) {
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.getRankList(this.app,msg,function(result){
    if(result == null){
      next(null,{ret:DEF.RET_ERROR});
    }else{
      next(null, {
        type:msg.type,
        scope:msg.scope,
        rankList: result
      });
    }
  });
};

handler.reqFriendList = function(msg, session, next) {
  var game = msg.game;// = 1 lianqi
  msg.userID = session.get('userID');
  
  if(!!!msg.userID){
    next(null,{ret:DEF.RET_ERROR});
    return;
  }

  lobbyManager.getUserFriend(this.app,msg,function(err,result){
    next(null, {
      friendList: result
    });
  });
};
