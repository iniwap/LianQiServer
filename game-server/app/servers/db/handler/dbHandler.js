//var dbManager = require('../../../controllers/dbManager');
var utils = require('../../../util/utils');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;


//-------------------------------------远程数据库操作，暂不允许-------------------------------------------


//------------------------------------------------------------------------------------------


