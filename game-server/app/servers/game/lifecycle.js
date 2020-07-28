module.exports.beforeStartup = function(app, cb) {

	// do some operations before application start up
	cb();
};


module.exports.afterStartup = function(app, cb) {

	// do some operations after application start up
	app.rpc.game.lianQiRemote.appStart('*',{},ret=>console.log("联棋算法初始化结果："+ ret));
	
	cb();
};


module.exports.beforeShutdown = function(app, cb) {

	// do some operations before application shutdown down
	app.rpc.game.lianQiRemote.appStop('*',{},ret=>console.log("联棋算法清理结果："+ ret));
	
	cb();
};

module.exports.afterStartAll = function(app) {

	// do some operations after all applications start up
};