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
};

module.exports.afterStartAll = function(app) {

	// do some operations after all applications start up
};