//var redis = require('../../../controllers/redisManager');
var utils = require('../../../util/utils');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;


//-------------------------------------redis网络操作接口，暂不支持-------------------------------------------


//------------------------------------------------------------------------------------------


