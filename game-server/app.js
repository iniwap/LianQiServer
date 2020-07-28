var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'lianqi');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 10,
      disconnectOnTimeout: true,
      useDict: true, // 路由压缩
      useProtobuf : true,
      //useCrypto: true
      /*
          checkClient: function(type, version) {
      // check the client type and version then return true or false
    },
    handshake: function(msg, cb){
      cb(null, { message pass to client in handshake phase });
    }
       */
    });

  app.set('pushSchedulerConfig', {

    scheduler: [ 
      {
        id: 'direct',
        scheduler: pomelo.pushSchedulers.direct
      },

      {
        id: 'buffer0.01',
        scheduler: pomelo.pushSchedulers.buffer,
        options: {flushInterval: 50}
      },

      {
        id: 'buffer2',
        scheduler: pomelo.pushSchedulers.buffer,
        options: {flushInterval: 2000}
      }
    ],

    selector: function(reqId, route, msg, recvs, opts, cb) {
       // opts.userOptions is passed by response/push/broadcast
       // 
       console.log('user options is: ', opts.userOptions);
       if(opts.type === 'push') {
         cb('direct');
         return;
       }
       if (opts.type === 'response') {
         cb('direct');
         return ;
       }
       if (opts.type === 'broadcast') {
         cb('buffer2');
         return ;
       }
    }
  });
});

app.configure('production|development', 'gate', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      useProtobuf : true,
      heartbeat : 10,
      disconnectOnTimeout: true,
      useDict: true, // 路由压缩
      useProtobuf : true,
      //useCrypto: true
    });
  app.set('pushSchedulerConfig', {

    scheduler: [ 
      {
        id: 'direct',
        scheduler: pomelo.pushSchedulers.direct
      },

      {
        id: 'buffer0.1',
        scheduler: pomelo.pushSchedulers.buffer,
        options: {flushInterval: 100}
      },

      {
        id: 'buffer2',
        scheduler: pomelo.pushSchedulers.buffer,
        options: {flushInterval: 2000}
      }
    ],

    selector: function(reqId, route, msg, recvs, opts, cb) {
       // opts.userOptions is passed by response/push/broadcast
       console.log('user options is: ', opts.userOptions);
       if(opts.type === 'push') {
         cb('direct');
         return;
       }
       if (opts.type === 'response') {
         cb('direct');
         return ;
       }
       if (opts.type === 'broadcast') {
         cb('buffer2');
         return ;
       }
    }
  });
});

//启动pomelo
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
