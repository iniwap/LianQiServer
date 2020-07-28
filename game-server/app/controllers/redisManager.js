/**
 * Module dependencies
 */
var UTILS = require('../util/utils');
var DEF = require('../consts/consts');

var exp = module.exports;

var Schema = require('jugglingdb').Schema;
var schema = new Schema('redis', {  
      host: 'localhost',  //serverip
      port: 6379,
      debug: true,
      password:"lq717",
}); //port number depends on your configuration

var SignIn = schema.define('SignIn',{
    user_id:{type:Number,dataType:'int'},   
    prop_id:{type:Number,dataType:'int'}, 
    prop_cnt:{type:Number,dataType:'int'},
    end_time:{type:Date,dataType:'datetime'}
  },{  
    restPath:'/signIn'
});

var LuckDraw = schema.define('LuckDraw',{
    user_id:{type:Number,dataType:'int'},   
    prop_id:{type:Number,dataType:'int'}, 
    prop_cnt:{type:Number,dataType:'int'},
    end_time:{type:Date,dataType:'datetime'}
  },{  
    restPath:'/luckDraw'
});

exp.redisSignIn = function (msg,cb) {
  cb(DEF.RET_SUCCESS,{flag:0,type:1,prop_id:0,gold_num:1000});
};

exp.redisLuckDraw = function (msg,cb) {
  cb(DEF.RET_SUCCESS,{flag:0,type:1,prop_id:0,gold_num:1000});
};

exp.getSiginLuckDrawInfo = function(msg,cb) {

};