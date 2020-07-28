module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.reqConnect = function(msg, session, next) {
  // get all connectors
  var connectors = this.app.getServersByType('connector');
  if(!connectors || connectors.length === 0) {
    next(null, {
      code: 500
    });
    return;
  }

  //if not auto select,send all server list to client  
  var uid = msg.uid;
  if(!uid) {
    var res = connectors[0];
      next(null, {
        code: 200,
        host: res.host,
        port: res.clientPort
    });
  }else{

    // select connector
    var res = dispatcher.dispatch(uid, connectors);
    next(null, {
      code: 200,
      host: res.host,
      port: res.clientPort
    });
  }
};
