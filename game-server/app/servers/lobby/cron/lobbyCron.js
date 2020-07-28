/*
*     *     *     *   *    *        command to be executed
-     -     -     -   -    -
|     |     |     |   |    |
|     |     |     |   |    +----- day of week (0 - 6) (Sunday=0)
|     |     |     |   +------- month (0 - 11)
|     |     |     +--------- day of month (1 - 31)
|     |     +----------- hour (0 - 23)
|     +------------- min (0 - 59)
+------------- second (0 - 59)
 */

module.exports = function(app) {
  return new Cron(app);
};
var Cron = function(app) {
  this.app = app;
};
var cron = Cron.prototype;

cron.test = function() {
  console.log('%s server is on cron!', this.app.serverId);
};