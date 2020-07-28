var dbm = require('../../../controllers/dbManager');

module.exports = function(app) {
  return new DBRemote(app);
};

var DBRemote = function(app) {
  this.app = app;
};

//-----------------------------------远程rpc 数据库操作接口-------------------------------------------
DBRemote.prototype.getUserData = function (msg,cb) {
	dbm.getUserData(msg,cb);
};
DBRemote.prototype.changeNickName = function(msg,cb){
	dbm.changeNickName(msg,cb);
};
DBRemote.prototype.getNoticeMsg= function (msg,cb) {
	dbm.getNoticeMsg(msg,cb);
};
DBRemote.prototype.getPlazaConfig = function (msg,cb) {
	dbm.getPlazaConfig(msg,cb);
};
DBRemote.prototype.getPropConfig = function (msg,cb) {
	dbm.getPropConfig(msg,cb);
};
DBRemote.prototype.getLuckDrawConfig = function (msg,cb) {
	dbm.getLuckDrawConfig(msg,cb);
};
DBRemote.prototype.getSignInConfig = function (msg,cb) {
	dbm.getSignInConfig(msg,cb);
};

DBRemote.prototype.getStoreConfig = function (msg,cb) {
	dbm.getStoreConfig(msg,cb);
};
DBRemote.prototype.getUserEmail = function (msg,cb) {
	dbm.getUserEmail(msg,cb);
};
DBRemote.prototype.getUserPackage = function (msg,cb) {
	dbm.getUserPackage(msg,cb);
};
DBRemote.prototype.getUserFriend = function (msg,cb) {
	dbm.getUserFriend(msg,cb);
};
DBRemote.prototype.getRankList = function(msg,cb){
	dbm.getRankList(msg,cb);
};
DBRemote.prototype.onFeedback = function(msg,cb){
	dbm.onFeedback(msg,cb);
};

//----------------------------游戏操作接口-------------------------------------------------
DBRemote.prototype.getPlayerData = function(userID,cb){
	dbm.getPlayerData(userID,cb);
};
DBRemote.prototype.updateUserRoomID = function(userIDs,roomId,cb){
	dbm.updateUserRoomID(userIDs,roomId,cb);
};
DBRemote.prototype.updateUserEmail = function(msg,cb){
	dbm.updateUserEmail(msg,cb);
};
DBRemote.prototype.updateUserGold = function(userID,gold,cb){
	dbm.updateUserGold(userID,gold,false,cb);
};
DBRemote.prototype.updateUserGoldForGameResult = function(userID,gold,cb){
	dbm.updateUserGold(userID,gold,true,cb);
};
DBRemote.prototype.updateUserTalentslot = function(userID,slot,gold,diamond,cb){
	dbm.updateUserTalentslot(userID,slot,gold,diamond,cb);
};
