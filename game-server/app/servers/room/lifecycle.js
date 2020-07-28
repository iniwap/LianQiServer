var roomManager = require('../../controllers/roomManager');


module.exports.beforeStartup = function(app, cb) {

	// do some operations before application start up
	cb();
};


module.exports.afterStartup = function(app, cb) {

	// do some operations after application start up
	
	cb();
};


module.exports.beforeShutdown = function(app, cb) {

	// do some operations before application shutdown down
	app.rpc.room.roomRemote.restAllGamingUserRoomId('*', {}, function(result){
		console.log("关闭服务器，重置正在游戏中的"+result+"个玩家房间ID");
		cb();
	});
};

module.exports.afterStartAll = function(app) {

	// do some operations after all applications start up
	// 
	//场配置
  	app.rpc.db.dbRemote.getPlazaConfig('*', {}, function(err,result){
    	roomManager.setPlazaConfig(result);
  	});
};