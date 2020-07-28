var roomManager = require('../../../controllers/roomManager');
var lianQiManager = require('../../../controllers/lianQiManager');

module.exports = function(app) {
  return new LianQiRemote(app);
};

var LianQiRemote = function(app) {
  this.app = app;
};

//pomelo启动
LianQiRemote.prototype.appStart = function(data,cb){
	lianQiManager.init(cb);
}
//pomelo 停止
LianQiRemote.prototype.appStop = function(data,cb){
	lianQiManager.uninit(cb);
}

LianQiRemote.prototype.onStartGame = function(data,cb){
	lianQiManager.onStartGame(this.app,data,cb);
}

LianQiRemote.prototype.onLianQiStart = function(data,cb){
	lianQiManager.onLianQiStart(this.app,data,cb);
}

LianQiRemote.prototype.onRelink = function(data,cb){
	lianQiManager.onRelink(this.app,data,cb);
}

LianQiRemote.prototype.onClockTimeOut = function(data,cb){
	lianQiManager.onClockTimeOut(this.app,data,cb);
}

LianQiRemote.prototype.onEndGame = function(data,cb){
	lianQiManager.onEndGame(this.app,data,cb);
}
LianQiRemote.prototype.onAbandonPass = function(data,cb){
	lianQiManager.onAbandonPass(this.app,data,cb);
}
