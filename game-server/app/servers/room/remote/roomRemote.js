var roomManager = require('../../../controllers/roomManager');

module.exports = function(app) {
  return new RoomRemote(app);
};

var RoomRemote = function(app) {
  this.app = app;
};

RoomRemote.prototype.onUserDisconnect = function(data,cb) {
  roomManager.onUserDisconnect(data,cb);
};

RoomRemote.prototype.onCheckIfRoomTimeOut = function(data,cb){
	roomManager.onCheckIfRoomTimeOut(data,cb);
};
RoomRemote.prototype.notifyGameState = function(data,cb){
	roomManager.notifyGameState(data,cb);
}
RoomRemote.prototype.restAllGamingUserRoomId = function(data,cb){
	roomManager.restAllGamingUserRoomId(this.app,data,cb);
}
//测试输出当前的房间信息
RoomRemote.prototype.test = function(data,cb){
	roomManager.test(data,cb);
};
