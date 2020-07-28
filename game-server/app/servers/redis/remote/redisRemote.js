var redis = require('../../../controllers/redisManager');

module.exports = function(app) {
  return new RedisRemote(app);
};

var RedisRemote = function(app) {
  this.app = app;
};


RedisRemote.prototype.redisSignIn = function (msg,cb) {
	redis.redisSignIn(msg,cb);
};

RedisRemote.prototype.redisLuckDraw = function (msg,cb) {
	redis.redisLuckDraw(msg,cb);
};

RedisRemote.prototype.getSiginLuckDrawInfo = function (msg,cb) {
	redis.getSiginLuckDrawInfo(msg,cb);
};
