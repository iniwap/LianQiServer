/**
 * Module dependencies
 */
var DEF = require('../consts/consts');
var utils = require('../util/utils');
var roomLogger = require('pomelo-logger').getLogger('lobby-log', __filename);
var pomelo = require('pomelo');

var exp = module.exports;

var gPlazaConfig = null;
var gLuckDrawConfig = null;
var gSigninConfig = null;
var gPropConfig = null;
var gStoreConfig = null;

//------------------------初始化配置数据--------------------------
exp.setPlazaConfig =  function(result){
	gPlazaConfig = result;
}
//抽奖
exp.setLuckDrawConfig =  function(result){
	gLuckDrawConfig = result;
}
exp.setSignInConfig =  function(result){
	gSigninConfig = result;
}
//道具
exp.setPropConfig =  function(result){
	gPropConfig = result;
}
//商城
exp.setStoreConfig =  function(result){
	gStoreConfig = result;
}

//----------------------------------------------------------------
exp.getPlazaConfig =  function(result){
	return gPlazaConfig;
}
//抽奖
exp.getLuckDrawConfig =  function(result){
	return gLuckDrawConfig;
}
exp.getSignInConfig =  function(result){
	return gSigninConfig ;
}
//道具
exp.getPropConfig =  function(result){
	return gPropConfig;
}
//商城
exp.getStoreConfig =  function(result){
	return gStoreConfig ;
}

exp.getUserPackage = function(app,msg,cb){
  app.rpc.db.dbRemote.getUserPackage('*',msg,cb);
}

exp.getNoticeMsg = function(app,msg,cb){
  app.rpc.db.dbRemote.getNoticeMsg('*',msg,cb);
}

exp.getUserEmail = function(app,msg,cb){
  app.rpc.db.dbRemote.getUserEmail('*',msg,cb);
}

exp.updateUserEmail = function(app,msg,cb){
  app.rpc.db.dbRemote.updateUserEmail('*',msg,cb);
}

exp.changeNickName = function(app,msg,cb){
  app.rpc.db.dbRemote.changeNickName('*',msg,cb);
}

exp.getRankList = function(app,msg,cb){
  app.rpc.db.dbRemote.getRankList('*',msg,function(err,result){
    //删除多余数据
    var ret = new Array();
    if(err == DEF.RET_SUCCESS){
      for(var i = 0;i<result.length;i++){
        var u = {};
        u["userID"] = result[i].id;
        u["name"] = result[i].name;
        u["headUrl"] = result[i].head;
        u["score"] = result[i].score;
        u["exp"] = result[i].exp;
        u["charm"] = result[i].charm;
        u["diamond"] = result[i].diamond;
        u["gold"] = result[i].gold;
        u["win_rate"] = result[i].win_rate;
        ret.push(u);
      }
      cb(ret);
  	}else{
  		cb(null);
  	}
   });
}

exp.getUserFriend = function(app,msg,cb){
  app.rpc.db.dbRemote.getUserFriend('*',msg,cb);
}

exp.getSiginLuckDrawInfo = function(app,msg,cb){
  app.rpc.redis.redisRemote.getSiginLuckDrawInfo('*',msg,cb);
}

//---------------------------------------------------------------------
exp.onFeedback = function(app,msg,cb){
  app.rpc.db.dbRemote.onFeedback('*',msg,cb);
}

exp.onOpenTalentslot = function(app,msg,cb){
  app.rpc.db.dbRemote.getPlayerData('*',msg.userID,function(flag,user){
    if(flag != 0){
      cb(DEF.RET_ERROR,{result:1,currentOpenedCnt:0});
      return;
    }

    //已全开
    if(user.talent >= DEF.LOBBY.MAX_TALENT_SLOT){
      cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_FAIL_MAX_SLOT,currentOpenedCnt:user.talent});
      return;
    }

    //检查开槽条件
    if(msg.openBy == DEF.LOBBY.eOpenByType.OPEN_BY_GOLD){
      if(user.gold < DEF.LOBBY.eOpenTalentslotNeed.NEED_GOLD){
        cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_FAIL_LESS_GOLG,currentOpenedCnt:user.talent});
      }else{
        //扣除金币，并增加天赋槽数
        app.rpc.db.dbRemote.updateUserTalentslot('*',msg.userID,1,DEF.LOBBY.eOpenTalentslotNeed.NEED_GOLD,0,function(flag,talent,gold,diamond){
            if(flag == DEF.RET_SUCCESS){
              cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_SUCCESS,currentOpenedCnt:talent,currentGold:gold,currentDiamond:diamond});
            }else{
              cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_FAIL_LESS_GOLG,currentOpenedCnt:talent});
            }
        });
      }
    }else if(msg.openBy == DEF.LOBBY.eOpenByType.OPEN_BY_DIAMOND){
      if(user.diamond < DEF.LOBBY.eOpenTalentslotNeed.NEED_DIAMOND){
        cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_FAIL_LESS_DIAMOND,currentOpenedCnt:user.talent});
      }else{
        //扣除钻石，并增加天赋槽数
        app.rpc.db.dbRemote.updateUserTalentslot('*',msg.userID,1,0,DEF.LOBBY.eOpenTalentslotNeed.NEED_DIAMOND,function(flag,talent,gold,diamond){
            if(flag == DEF.RET_SUCCESS){
              cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_SUCCESS,currentOpenedCnt:talent,currentGold:gold,currentDiamond:diamond});
            }else{
              cb(DEF.RET_ERROR,{result:DEF.LOBBY.eOpenTalentslotResult.OPEN_FAIL_LESS_DIAMOND,currentOpenedCnt:talent});
            }
        });
      }
    }else{
      cb(DEF.RET_ERROR,{result:1,currentOpenedCnt:0});
    }
  });
}

exp.onSigin = function(app,msg,cb){
  
  app.rpc.redis.redisRemote.redisSignIn('*',msg,function(err,result){
    cb(err,result);
  });
}

exp.onLuckDraw = function(app,msg,cb){
  app.rpc.redis.redisRemote.redisLuckDraw('*',msg,function(err,result){
    cb(err,result);
  });
}
