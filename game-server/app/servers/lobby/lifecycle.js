var lobbyManager = require('../../controllers/lobbyManager');

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
	cb();
};

module.exports.afterStartAll = function(app) {
	// do some operations after all applications start up
  
  //场配置
  app.rpc.db.dbRemote.getPlazaConfig('*', {}, function(err,result){
    lobbyManager.setPlazaConfig(result);
  });

  //抽奖
  app.rpc.db.dbRemote.getLuckDrawConfig('*', {}, function(err,result){
    lobbyManager.setLuckDrawConfig(result);
  });

  // 签到
  app.rpc.db.dbRemote.getSignInConfig('*', {}, function(err,result){
    lobbyManager.setSignInConfig(result);
  });

 //道具
 app.rpc.db.dbRemote.getPropConfig('*', {}, function(err,result){
    lobbyManager.setPropConfig(result);
  });

 //商城
  app.rpc.db.dbRemote.getStoreConfig('*', {}, function(err,result){
    lobbyManager.setStoreConfig(result);
  });
};