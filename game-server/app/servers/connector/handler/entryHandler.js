var utils = require('../../../util/utils');
var DEFINE = require('../../../consts/consts');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;

// login 
handler.reqLogin  = function(msg, session, next) {
  var sessionService = this.app.get('sessionService');

  //duplicate login
  if(!!sessionService.getByUid(msg.userID)) {
    //result.flag = ;
    next(null, {ret:-1});
    return;
  }
  
  msg.serverId = this.app.get('serverId');
  session.on('closed', onUserDisconnect.bind(null, this.app));

  this.app.rpc.db.dbRemote.getUserData('*',msg,function(err,result){
    //FAIL
    if(err != DEFINE.LOBBY.eLoginResultFlag.LOGIN_SUCCESS){
      next(null, {flag:err});
      return;
    }

    session.bind(result.id);
    session.set('userID', result.id);

    result["user_id"] = result.id;
    result["flag"] = err;

    session.pushAll(
      function() {
        next(null, result);
      }
    );
  });
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserDisconnect = function(app, session) {
  if(!session || !session.uid) {
    return;
  }
  var d = {userID: session.get('userID')};
  app.rpc.room.roomRemote.onUserDisconnect(session, d, (name)=>console.log(name + " 断开链接"));
};

