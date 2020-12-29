/**
 * Module dependencies
 */
var UTILS = require('../util/utils');
var DEF = require('../consts/consts');
var pomelo = require('pomelo');

var exp = module.exports;

var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {  
      host: 'localhost',  //116.62.57.248
      port: 3306,  
      database: 'lianqi', 
      username:"iafun",
      user:'iafun',
      password: 'Huqu*6110@',  
      debug: false,  
      pool: true,  
      connectionLimit: 100,
     // socketPath: '/tmp/mysql.sock'
  }); //port number depends on your configuration

//用户model
var User = schema.define('User',{
    area:{type:Number,dataType: 'tinyint',length:3},  
    name:{type:String,dataType:'varchar',limit:30,default:"Lianqi"},  
    sex:{type:Number,dataType:'tinyint', length:1,default:0}, 
    head:{type:String,dataType:'varchar',limit:255,default:"1"},
    vip: { type: Number, dataType: 'int',length:11,default:0},  
    gold: { type: Number, dataType: 'int',length:11 ,default:Number(DEF.LOBBY.FIRST_LOGIN_AWARD_GOLD)},  //默认1000金币
    win: { type: Number, dataType: 'int',length:11,default:0}, 
    win_rate: { type: Number, dataType: 'double',length:11,default:0.0},  
    lose: { type: Number, dataType: 'int',length:11 ,default:0},  
    draw: { type: Number, dataType: 'int',length:11 ,default:0},  
    escape: { type: Number, dataType: 'int',length:11 ,default:0},  
    talent: { type: Number, dataType: 'int',length:11 ,default:0},  
    game_time: { type: Number, dataType: 'int',length:11 ,default:0},  
    exp: { type: Number, dataType: 'int',length:11 ,default:0},  
    phone: { type: Number, dataType: 'int',length:11 ,default:0}, 
    room_id: { type: Number, dataType: 'int',length:11 ,default:0},  
    adult: { type: Number, dataType: 'tinyint',length:1 ,default:1},  
    charm: { type: Number, dataType: 'int',length:11 ,default:0},  
    score: { type: Number, dataType: 'int',length:11 ,default:0},  
    diamond: { type: Number, dataType: 'int',length:11 ,default:1000},//默认10钻石  
    energy: { type: Number, dataType: 'int',length:11 ,default:20},  //默认20体力
    lastlogin_time: { type: Date, dataType: 'datetime' ,default: UTILS.Date},  
    register_time: { type: Date, dataType: 'datetime' ,default: UTILS.Date},  
    client_type:{type:Number,dataType: 'tinyint',length:1,default:0}, 
    client_ip: { type: Number, dataType: 'int',length:11 ,default:0},  
    client_appver: { type: Number, dataType: 'int',length:11 ,default:0},  
    client_osver: { type: Number, dataType: 'int',length:11 ,default:0},  
    deviceid:{type:String,dataType:'varchar',limit:128,default:""},
    logintype:{type:Number,dataType:'tinyint', length:1,default:0},
    channelid:{type:Number,dataType:'int', length:11,default:0},
    serverId:{type:String,dataType:'varchar',limit:20,default:""},
  },{  
    table:'lianqi_user'
});
//抽奖配置model
var LuckDrawConfig = schema.define('LuckDrawConfig',{  
    type:{type:Number,dataType: 'tinyint',length:3},
    prop_id: { type: Number, dataType: 'int',length:11 },  
    gold_num: { type: Number, dataType: 'int',length:11 }
  },{  
    table:'luckdraw_config'
});
var SignInConfig = schema.define('SignInConfig',{  
    type:{type:Number,dataType: 'tinyint',length:3},  
    day:{type:Number,dataType:'tinyint', length:3}, 
    prop_id:{type:Number,dataType:'int', length:11}, 
    gold_num:{type:Number,dataType:'int', length:11}
  },{  
    table:'signin_config'
});

//系统公告model
var NoticeMsg = schema.define('NoticeMsg',{  
    type:{type:Number,dataType:'tinyint', length:1},
    content:{type:String,dataType:'varchar',limit:255}
  },{  
    table:'notice_msg'
});

var FeedBack = schema.define('FeedBack',{
    user_id:{type:Number,dataType:'int', length:11},
    type:{type:Number,dataType:'tinyint', length:1},
    content:{type:String,dataType:'varchar',limit:255}
  },{  
    table:'feed_back'
});

var PlazaConfig = schema.define('PlazaConfig',{
    plazaid: { type: Number, dataType: 'int',length:11 },  
    room_type: { type: Number, dataType: 'tinyint',length:1 }, 
    star: { type: Number, dataType: 'tinyint',length:1 },  
    lmt_type:{type:Number,dataType: 'tinyint',length:3},
    rule:{type:String,dataType:'varchar',limit:255},
    name:{type:String,dataType:'varchar',limit:255},
    des:{type:String,dataType:'varchar',limit:1024}
  },{  
    table:'plaza_config'
});

var PlazaLmtConfig = schema.define('PlazaLmtConfig',{  
    plazaid: { type: Number, dataType: 'int',length:11 },  
    base_score: { type: Number, dataType: 'int',length:11 },  
    minsr: { type: Number, dataType: 'int',length:11 },  
    maxsr: { type: Number, dataType: 'int',length:11 },  
    levelid: { type: Number, dataType: 'tinyint',length:1 },  
  },{  
    table:'plaza_lmt_config'
});

var PropConfig = schema.define('PropConfig',{  
    type:{type:Number,dataType: 'tinyint',length:3},  
    price:{type:Number,dataType:'int', length:11}, 
    name:{type:String,dataType:'varchar',limit:255}, 
    pic:{type:String,dataType:'varchar',limit:255}, 
    des:{type:String,dataType:'varchar',limit:255}, 
    data:{type:String,dataType:'varchar',limit:255}
  },{  
    table:'prop_config'
});

var StoreConfig = schema.define('StoreConfig',{  
    point:{type:String,dataType:'varchar',limit:255}, 
    price:{type:Number,dataType:'int', length:11}, 
    name:{type:String,dataType:'varchar',limit:255}, 
    des:{type:String,dataType:'varchar',limit:255}, 
    pic:{type:String,dataType:'varchar',limit:255},
    data:{type:String,dataType:'varchar',limit:255}
  },{  
    table:'store_config'
});

var ThirdParty = schema.define('ThirdParty',{  
    head_url:{type:String,dataType:'varchar',limit:2048}, 
    sex:{type:Number,dataType:'tinyint', length:1}, 
    openid:{type:String,dataType:'varchar',limit:255}, 
    nick:{type:String,dataType:'varchar',limit:255}, 
    authtime:{type:Date,dataType:'timestamp'},
    outtime:{type:Number,dataType:'int',length:11},
    user_id:{type:Number,dataType:'int', length:11},
    access_token:{type:String,dataType:'varchar',limit:255}
  },{  
    table:'third_party'
});

var UserEmail = schema.define('UserEmail',{  
    user_id:{type:Number,dataType:'int',length:11}, 
    type:{type:Number,dataType:'tinyint', length:1}, 
    has_read:{type:Number,dataType:'tinyint',length:1}, 
    title:{type:String,dataType:'varchar',limit:30}, 
    content:{type:String,dataType:'varchar',limit:1024}, 
    author:{type:String,dataType:'varchar',limit:30}, 
    send_time:{type:Date,dataType:'datetime'},
    end_time:{type:Date,dataType:'datetime'}
  },{  
    table:'user_email'
});

var UserExtraInfo = schema.define('UserExtraInfo',{  
    user_id:{type:Number,dataType:'int',length:11}, 
    des:{type:String,dataType:'varchar',limit:255}
  },{  
    table:'user_extrainfo'
});

var UserFriend = schema.define('UserFriend',{  
    friend_id:{type:Number,dataType:'int',length:11},
    user_id:{type:Number,dataType:'int',length:11},  
    friend_score:{type:Number,dataType:'int', length:11}
  },{  
    table:'user_friend'
});

var UserPackage = schema.define('UserPackage',{
    user_id:{type:Number,dataType:'int',length:11},   
    prop_id:{type:Number,dataType:'int',length:11}, 
    prop_cnt:{type:Number,dataType:'int', length:11},
    end_time:{type:Date,dataType:'datetime'}
  },{  
    table:'user_package'
});

//----------------------------------数据缓存，避免多次查询数据库-----------------------------


//-----------------------------------大厅操作接口-------------------------------------------
exp.getUserData = function (msg,cb) {
    if(DEF.LOBBY.eLoginType.LOGIN_TYPE_YK == msg.loginType){
        if(msg.userID == 0 ){
            //首次登陆
            //用户不存在
            //首先检查deviceid是否存在
            User.findOne({where:{deviceid:msg.deviceID}},function(err,result){
                
                if(result === [] || result === {} || !!!result){
                    //new
                    var user = User({
                                    area:msg.area,
                                    logintype:msg.loginType,
                                    deviceid:msg.deviceID,
                                    channelid:msg.channelID,
                                    client_appver:msg.appVersion,
                                    client_ip:msg.ipAddr,
                                    client_osver:msg.osVersion,
                                    networktype:msg.netWorkType,
                                    serverId:msg.serverId});
                    
                    user.save(function(err,u){                        
                        user.updateAttribute('name', "游客"+u.id, function(){});
                        u.name = "游客"+u.id;
                        cb(DEF.LOBBY.eLoginResultFlag.LOGIN_SUCCESS,u);

                        //插入一条，新用户赠送1000积分的个人邮件
                        var content = JSON.stringify({content:"新玩家免费赠送1000积分，游戏多多，奖励多多",
                                                        hasAward:1,
                                                        type:Number(DEF.LOBBY.eAwardType.GOLD),
                                                        propId:0,
                                                        awardCnt:Number(DEF.LOBBY.FIRST_LOGIN_AWARD_GOLD),
                                                        awardIcon:"",
                                                        hasGottenAward:0});
                        addUserEmail(u.id,0,"新玩家送积分",content,"世界联棋委员会",UTILS.Date(DEF.LOBBY.FOREVER_TIME));

                        var content = JSON.stringify({content:"欢迎来到联棋世界,祝您游戏愉快",
                                                        hasAward:0,
                                                        type:Number(DEF.LOBBY.eAwardType.NONE),
                                                        propId:0,
                                                        awardCnt:0,
                                                        awardIcon:"",
                                                        hasGottenAward:0});
                        addUserEmail(u.id,0,"系统消息",content,"系统",UTILS.Date(DEF.LOBBY.FOREVER_TIME));

                        var content = JSON.stringify({content:"恭喜您获得新皮肤:吃遍天下",
                                                        hasAward:1,
                                                        type:Number(DEF.LOBBY.eAwardType.PROP),
                                                        propId:1,
                                                        awardCnt:1,
                                                        awardIcon:"1",
                                                        hasGottenAward:0});
                        addUserEmail(u.id,0,"恭喜获得新皮肤",content,"世界联棋委员会",UTILS.Date(DEF.LOBBY.FOREVER_TIME));
                        //是否下发消息???
                        
                    });

                    user.destroy();
                }else{

                    //这里判断是否每日赠送过积分
                    checkEveryDayLoginAward(msg.userID,result.lastlogin_time);

                    User.update(msg.userID,{ lastlogin_time: UTILS.Date(0), 
                                    channelid:msg.channelID,
                                    client_appver:msg.appVersion,
                                    client_ip:msg.ipAddr,
                                    client_osver:msg.osVersion,
                                    networktype:msg.netWorkType,
                                    serverId:msg.serverId} 
                        ,(ltime)=>console.log(result.name + "最后登陆时间是：" + UTILS.Date(0)));
                    cb(DEF.LOBBY.eLoginResultFlag.LOGIN_SUCCESS,result);
                }
            });

        }else{
            //后续登陆
            User.find(msg.userID,function(err,result){
                if(result === [] || result === {} || !!!result){
                    cb(DEF.LOBBY.eLoginResultFlag.LOGIN_FAIL_NOT_EXIST_ACCOUT,result);
                }
                else{

                    User.update(msg.userID, { lastlogin_time: UTILS.Date(0), 
                                    channelid:msg.channelID,
                                    client_appver:msg.appVersion,
                                    client_ip:msg.ipAddr,
                                    client_osver:msg.osVersion,
                                    networktype:msg.netWorkType,
                                    serverId:msg.serverId} 
                        ,(ltime)=>console.log(result.name + "最后登陆时间是：" + UTILS.Date(0)));
                    cb(DEF.LOBBY.eLoginResultFlag.LOGIN_SUCCESS,result);

                    //每日登录 送多少积分，插入一条邮件信息
                    //这里需要判断今天是否已经送过积分
                    checkEveryDayLoginAward(msg.userID,result.lastlogin_time);
                }
            });
        }
    }else if(DEF.LOBBY.eLoginType.LOGIN_TYPE_QQ == msg.loginType
        || DEF.LOBBY.eLoginType.LOGIN_TYPE_WX == msg.loginType ){

        if(msg.openID == ""){
            cb(DEF.LOBBY.eLoginResultFlag.LOGIN_FAIL_OPENID_ERROR,{});
        }else{
            //先查是否存在openid
            ThirdParty.findOne({where:{openid:msg.openID}},function(err,result){
                
                if(result === [] || result === {} || !!!result){
                    //new
                    var user = User({
                                    area:msg.area,
                                    logintype:msg.loginType,
                                    deviceid:msg.deviceID,
                                    channelid:msg.channelID,
                                    client_appver:msg.appVersion,
                                    client_ip:msg.ipAddr,
                                    client_osver:msg.osVersion,
                                    networktype:msg.netWorkType,
                                    serverId:msg.serverId,
                                    name:msg.nickName,
                                    sex:msg.sex,
                                    head:msg.head,
                                });
                    
                    user.save(function(err,u){
                        cb(DEF.LOBBY.eLoginResultFlag.LOGIN_SUCCESS,u);

                        //插入一条，新用户赠送1000积分的个人邮件
                        var content = JSON.stringify({content:"新玩家免费赠送1000积分，游戏多多，奖励多多",
                                                        hasAward:1,
                                                        type:Number(DEF.LOBBY.eAwardType.GOLD),
                                                        propId:0,
                                                        awardCnt:Number(DEF.LOBBY.FIRST_LOGIN_AWARD_GOLD),
                                                        awardIcon:"",
                                                        hasGottenAward:0});
                        addUserEmail(u.id,0,"新玩家送积分",content,"世界联棋委员会",UTILS.Date(DEF.LOBBY.FOREVER_TIME));

                        var content = JSON.stringify({content:"欢迎来到联棋世界,祝您游戏愉快",
                                                        hasAward:0,
                                                        type:Number(DEF.LOBBY.eAwardType.NONE),
                                                        propId:0,
                                                        awardCnt:0,
                                                        awardIcon:"",
                                                        hasGottenAward:0});
                        addUserEmail(u.id,0,"系统消息",content,"系统",UTILS.Date(DEF.LOBBY.FOREVER_TIME));

                        var content = JSON.stringify({content:"恭喜您获得新皮肤:吃遍天下",
                                                        hasAward:1,
                                                        type:Number(DEF.LOBBY.eAwardType.PROP),
                                                        propId:1,
                                                        awardCnt:1,
                                                        awardIcon:"1",
                                                        hasGottenAward:0});
                        addUserEmail(u.id,0,"恭喜获得新皮肤",content,"世界联棋委员会",UTILS.Date(DEF.LOBBY.FOREVER_TIME));
                        
                        //生成第三方登陆信息记录
                        ThirdParty.create({head_url:msg.head,
                            access_token:msg.token,
                            sex:msg.sex,
                            openid:msg.openID,
                            nick:msg.nickName,
                            user_id:u.id,
                            authtime:UTILS.Date(0),
                            outtime:msg.expireTime},
                            function(){
                        });
                    });

                    user.destroy();

                }else{

                    User.find(result.user_id,function(err,result){
                        if(result === [] || result === {} || !!!result){
                            cb(DEF.LOBBY.eLoginResultFlag.LOGIN_FAIL_NOT_EXIST_ACCOUT,result);
                        }
                        else{

                            User.update(result.user_id, { lastlogin_time: UTILS.Date(0), 
                                            channelid:msg.channelID,
                                            client_appver:msg.appVersion,
                                            client_ip:msg.ipAddr,
                                            client_osver:msg.osVersion,
                                            networktype:msg.netWorkType,
                                            serverId:msg.serverId} 
                                ,(ltime)=>console.log(result.nick + "最后登陆时间是：" + UTILS.Date(0)));
                            cb(DEF.LOBBY.eLoginResultFlag.LOGIN_SUCCESS,result);

                            //每日登陆送
                            //这里判断是否每日赠送过积分
                            checkEveryDayLoginAward(msg.userID,result.lastlogin_time);
                        }
                    });
                }
            });   
        }
    }else{
        cb(DEF.LOBBY.eLoginResultFlag.LOGIN_FAIL_NOT_SUPPORT_TYPE,{});
    }
};
exp.changeNickName = function(msg,cb){
    //可以通过pomelo的filetr来完成，而不是在这里操作，这里已经是合理的name
    //这里需要判断name的合法性，主要是过滤字
    User.findOne({where:{name:msg.nickName}},function(err,result){
        if(result === [] || result === {} || !!!result){
            User.update(msg.userID, { name: msg.nickName},function(){});
            cb(DEF.LOBBY.eChangeNameFlag.CHANGE_SUCCESS,result);
        }else{
            cb(DEF.LOBBY.eChangeNameFlag.CHANGE_FAIL_FOR_EXIST,result);
        }
    });
}
exp.getLuckDrawConfig = function (msg,cb) {
    LuckDrawConfig.all({},function(err,result){  
        cb(err,result);  
    }); 
};
exp.getSignInConfig = function (msg,cb) {
    SignInConfig.all({},function(err,result){  
        cb(err,result);  
    }); 
};

exp.getNoticeMsg= function (msg,cb) {
    NoticeMsg.all({},function(err,result){  
        cb(err,result);  
    }); 
};
exp.getPlazaConfig = function (msg,cb) {
    PlazaConfig.all({},function(err1,result1){  
        PlazaLmtConfig.all({},function(err2,result2){
            var result = [];
            //这里需要解析出所有plazaid,并获取与其对应的levellist
            for(var i = 0;i<result1.length;i++){
                var plazaCfg = {};
                plazaCfg['plazaid'] = result1[i]['plazaid'];
                plazaCfg['room_type'] = result1[i]['room_type'];
                plazaCfg['star'] = result1[i]['star'];
                plazaCfg['lmt_type'] = result1[i]['lmt_type'];
                plazaCfg['rule'] = result1[i]['rule'];
                plazaCfg['name'] = result1[i]['name'];
                plazaCfg['des'] = result1[i]['des'];

                var levelList = [];
                for(var j = 0 ;j<result2.length;j++){
                    if(result1[i].plazaid == result2[j].plazaid){
                        levelList.push(result2[j]);
                    }
                }
                plazaCfg['levelList'] = levelList;

                result.push(plazaCfg);
            }

            cb(err2,result);
        }); 
    }); 
};
exp.getPropConfig = function (msg,cb) {
    PropConfig.all({},function(err,result){  
        cb(err,result);  
    }); 
};
exp.getStoreConfig = function (msg,cb) {
    StoreConfig.all({},function(err,result){  
        cb(err,result);  
    }); 
};
exp.getUserEmail = function (msg,cb) {
    UserEmail.all({where:{user_id:msg.userID},order: "send_time DESC"},function(err,result){  
        cb(err,result);  
    }); 
};
exp.getUserPackage = function (msg,cb) {
    UserPackage.all({where:{user_id:msg.userID}},function(err,result){  
        cb(err,result);  
    }); 
};
exp.getUserFriend = function (msg,cb) {
    UserFriend.all({where:{user_id:msg.userID}},function(err,result){  
        //这里需要查处friendid 再去查user表，来填写相关信息
        cb(err,result);  
    }); 
};
exp.getRankList = function(msg,cb){
    //根据scope和type来查询
    var orderBy = "gold DESC";
    if(msg.type == DEF.LOBBY.RANK_TYPE.RANK_GOLD){
        orderBy = "gold DESC";
    }else if(msg.type == DEF.LOBBY.RANK_TYPE.RANK_CHARM){
        orderBy = "charm DESC";
    }else if(msg.type == DEF.LOBBY.RANK_TYPE.RANK_DIAMOND){
        orderBy = "diamond DESC";
    }else if(msg.type == DEF.LOBBY.RANK_TYPE.RANK_SCORE){
        orderBy = "score DESC";
    }else if(msg.type == DEF.LOBBY.RANK_TYPE.RANK_WINRATE){
        orderBy = "win_rate DESC";
    }
    else{
        cb(DEF.RET_ERROR,[]);//
    }

    if(msg.scope == DEF.LOBBY.RANK_SCOPE_TYPE.RANK_ALL){
        User.all({order: orderBy, limit: 50},function(err,result){
            cb(DEF.RET_SUCCESS,result);
        });
    }else if(msg.scope == DEF.LOBBY.RANK_SCOPE_TYPE.RANK_FRIEND){
        UserFriend.all({where:{user_id:msg.userID}},function(err,fresult){  
            //这里需要查处friendid 再去查user表，来填写相关信息
            var friendu = new Array();
            for(var i = 0;i<result.length;i++){
                friendu.push(result[i].friend_id)
            }

            User.all({ where:{id:friendu},order: orderBy,limit:50},function(err,result){
                cb(DEF.RET_SUCCESS,result);
            });
        }); 
    }else if(msg.scope == DEF.LOBBY.RANK_SCOPE_TYPE.RANK_AREA){
        User.all({ where:{area:msg.area},order: orderBy, limit: 50},function(err,result){
            cb(DEF.RET_SUCCESS,result);
        });
    }else{
        cb(DEF.RET_ERROR,[]);
    }
};

//----------------------------游戏操作接口-------------------------------------------------
exp.updateUserGold = function(userID,changeGold,gameEnd,cb){
    User.find(userID,function(err,user){
        if(gameEnd){
            var win = user.win;
            var lose = user.lose;
            var draw = user.draw;
            var win_rate = user.win_rate;
            if(changeGold > 0){
                win += 1;
            }else if(changeGold < 0){
                lose += 1;
            }else{
                draw += 1;
            }
            win_rate = 100.00 * win/(win + lose + draw);

            User.update(userID, {gold:user.gold + changeGold,win:win,lose:lose,draw:draw,win_rate:win_rate});

        }else{
            User.update(userID, {gold:user.gold + changeGold});
        }
        cb();
    });
}

exp.getPlayerData = function(userID,cb){
    User.find(userID,function(err,result){
        if(result === [] || result === {} || !!!result){
            cb(DEF.RET_ERROR,{});
        }
        else{
            cb(DEF.RET_SUCCESS,result);
        }
    });
};

exp.updateUserRoomID = function(userIDs,roomId,cb){
    User.bulkUpdate({ where:{id:userIDs}, update:{ room_id:roomId} } ,function(rid){
        cb(userIDs.length);
    });
};
exp.onFeedback = function(msg,cb){
    //这里需要判定是不是弹幕，是的话是发给所有在线玩家，而不是插入数据库
    if(DEF.LOBBY.eFeedbackType.DANMU != msg.type){
        FeedBack.create({user_id:msg.userID,type:msg.type,content:msg.content},function(){
            cb(DEF.RET_SUCCESS,{type:msg.type,content:"您的反馈已收到，我们会尽快处理，请注意查收您的信箱，谢谢！"});
        });
    }else{
        //发送弹幕
    }
};
exp.updateUserEmail = function(msg,cb){
    UserEmail.find(msg.awardEmailId,function(err,result){
        if(result === [] || result === {} || !!!result){
            cb(DEF.RET_ERROR,{});
        }
        else{
            if(DEF.LOBBY.eReqUpdateEmailActionType.READ == msg.type){
                //设置邮件为已读 - UPDATE
                UserEmail.update(msg.awardEmailId, { has_read: 1 },function(){
                    cb(DEF.RET_SUCCESS,{type:msg.type,awardEmailId:msg.awardEmailId});
                });

            }else if(DEF.LOBBY.eReqUpdateEmailActionType.DEL == msg.type){
                //删除邮件 - DEL
                
                
            }else if(DEF.LOBBY.eReqUpdateEmailActionType.GET_AWARD == msg.type){
                //领取邮件奖励 - GET
                var content = JSON.parse(result.content);
                //已经领取过了
                if(content.hasGottenAward == 1){
                    cb(DEF.RET_SUCCESS,{type:msg.type,awardEmailId:msg.awardEmailId});
                    return;
                }

                content.hasGottenAward = 1;
                //此处需要发奖励
                if(!!content.hasAward){
                    if(Number(DEF.LOBBY.eAwardType.GOLD) == content.type){
                        //增加金币
                        User.find(msg.userID,function(err,user){
                            User.update(msg.userID, {gold:user.gold + content.awardCnt});
                            console.info("玩家领取金币奖励",msg.userID,msg.awardEmailId,content.awardCnt);
                        });
                    }else if(Number(DEF.LOBBY.eAwardType.PROP) == content.type){
                        //添加道具
                        UserPackage.create({user_id:msg.userID,
                            prop_id:content.propId,
                            prop_cnt:content.awardCnt,
                            end_time:UTILS.Date(DEF.LOBBY.FOREVER_TIME)});

                            console.info("玩家领取道具奖励",msg.userID,msg.awardEmailId,content.propId,content.awardCnt);

                            //addUserEmail(u.id,0,"新玩家送积分",content,"世界联棋委员会",UTILS.Date(DEF.LOBBY.FOREVER_TIME));
                            var pushInfo = JSON.stringify({content:"恭喜<color=red>游客"+msg.userID+"</color>获得永久皮肤<color=green><b>吃遍天下</b></color>",
                                                         type:1,playCnt:2});

                            var channelService = pomelo.app.get('channelService');
                            channelService.broadcast('connector',
                                'lobby.lobbyHandler.awardEmail',
                                {type:2,needAdd2Email:0,id:0,has_read:1,title:"",author:"",content:pushInfo,send_time:"",end_time:""},
                                {binded: true});


                    }else{
                        cb(DEF.RET_ERROR,{});// 错误的奖励类型
                        return;
                    }
                }else{
                    cb(DEF.RET_ERROR,{});
                    return;
                }
                UserEmail.update(msg.awardEmailId, { content:JSON.stringify(content) },function(){
                    cb(DEF.RET_SUCCESS,{type:msg.type,awardEmailId:msg.awardEmailId});
                });
            }else{
                cb(DEF.RET_ERROR,{});
            }
        }
    });
};

//开启天赋槽
exp.updateUserTalentslot = function(userID,slot,gold,diamond,cb){
    User.find(userID,function(err,user){
        var new_slot = user.talent + slot;
        var currentGold = user.gold - gold;
        var currentDiamond = user.diamond - diamond;
        User.update(userID, {gold:currentGold,diamond:currentDiamond,talent:new_slot});
        cb(DEF.RET_SUCCESS,new_slot,currentGold,currentDiamond);
    });
};

//----------------------------内部接口--------------------------------------
var checkEveryDayLoginAward = function(userID,lastlogin_time){

    var time_now = UTILS.Date(0);
    var time_lastlogin = new Date(lastlogin_time);

    if(time_now.getFullYear() == time_lastlogin.getFullYear() 
        && time_now.getMonth() == time_lastlogin.getMonth() 
        && time_now.getDate() == time_lastlogin.getDate()){
        return;
    }
    var content = JSON.stringify({content:"每日登录游戏，就送100积分，祝您游戏愉快～！",
                                    hasAward:1,
                                    type:Number(DEF.LOBBY.eAwardType.GOLD),
                                    propId:0,
                                    awardCnt:Number(DEF.LOBBY.EVERYDAY_LOGIN_AWARD_GOLD),
                                    awardIcon:"",
                                    hasGottenAward:0});
    addUserEmail(userID,0,"每日登录送积分",content,"世界联棋委员会",UTILS.Date(DEF.LOBBY.FOREVER_TIME));
}

var addUserEmail = function(userID,type,title,content,author,endTime){
    UserEmail.create({user_id:userID,
        type:0,
        has_read:0,
        title:title,
        content:content,
        author:author,
        send_time:UTILS.Date(0),
        end_time:endTime},
        function(){
            //
    });
}
