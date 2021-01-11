/**
 * Module dependencies
 */
var DEF = require('../consts/consts');
var pomelo = require('pomelo');
var utils = require('../util/utils');
var channelUtil = require('../util/channelUtil');
var Player = require('./Player');
var schedule = require('pomelo-scheduler');

///////////////////////////////////////////////////////
function Room(isAutoCreate,roomType,roomId,roomData){

  this.isAutoCreate = isAutoCreate;//是否是系统自动分配的房间
  this.roomId = roomId;
  this.rule = roomData.rule;//房间规则
  this.ruleJson = JSON.parse(this.rule);
  this.state = DEF.ROOM.ROOM_GAME_STATE.ROOM_WAIT;
  this.firstHandSeat = 255;//先手人
  this.clockID = null;//倒计时定时器id
  this.waitPassTime = 0;//倒计时
  this.round = 1;//当前回合数，用来实现 有限制回合的场

  this.roomType  = roomType;
  this.roomLevel = roomData.roomLevel;//场id 对应于下面三个参数
  this.baseScore = roomData.baseScore;//底分
  this.minScore = roomData.minScore;//允许的积分下限
  this.maxScore = roomData.maxScore;//允许的积分上限

  if(this.isAutoCreate){

    this.plazaID = roomData.plazaID;
    this.pwd = "";
    this.roomName = roomData.name;//房间名字
    this.owner = 0;//房主
    this.roomTimestamp = new Date().getTime();

  }else{
    this.plazaID = 0;
    this.pwd = roomData.pwd;//房间密码
    this.roomName = roomData.roomName;//房间名字
    this.owner = roomData.owner;//房主
    this.roomTimestamp = new Date().getTime();//需要检测自建房间的存在时长，超过自动解散
  }

  this.playerManager = new Player(this.ruleJson.playerNum);

  // room channel, push msg within the room
  this.channel = null;
  this.channelService = pomelo.app.get('channelService');
  this.createChannel();

  //用于rpc调用
  this.app = roomData.app;//

  //用来暂时缓存收到start game 玩家的个数
  this.recStartGameNum = 0;
  this.recStartGameClock = [];

  //游戏记录，包括消灭，倍率，棋子数
  this.gameRecord = [{seat:0,hasAbandon:0,area:0,realArea:0,kill:0,multi:1},
                  {seat:1,hasAbandon:0,area:0,realArea:0,kill:0,multi:1},
                  {seat:2,hasAbandon:0,area:0,realArea:0,kill:0,multi:1},
                  {seat:3,hasAbandon:0,area:0,realArea:0,kill:0,multi:1}];
}

Room.prototype.getIsFull = function(){
  return this.playerManager.getPlayerNum() >= this.ruleJson.playerNum;
}

Room.prototype.createChannel = function() {
  if(this.channel) {
    return this.channel;
  }
  var channelName = channelUtil.getRoomChannelName(this.roomId);
  this.channel = this.channelService.getChannel(channelName, true);
  if(this.channel) {
    return this.channel;
  }
  return null;
};

Room.prototype.getAllPlayer = function(){
  return this.playerManager.getAllPlayer();
}

Room.prototype.addPlayer = function(data, serverId,isRobot) {

  if(!this.playerManager.addPlayer(data,isRobot)) {
    console.error("Room add player ,add player fail:%d,%s",data.id,serverId);
    return false;
  }

  if(!this.addPlayer2Channel(data,serverId)) {
    return false;
    console.error("Room add player ,add channel fail:%d,%s",data.id,serverId);
  }

  return true;
};

Room.prototype.addPlayer2Channel = function(data,serverId) {
  if(!this.channel) {
    return false;
  }
  if(data) {
    this.channel.leave(data.id, serverId);
    this.channel.add(data.id, serverId);
    return true;
  }
  return false;
};

Room.prototype.sendMsgToOtherExceptSeat = function(route,seat,data){
  var allPlayer = this.playerManager.getAllPlayer();
  for(var i in allPlayer) {
      var player = allPlayer[i];
      if(player.seat != DEF.ROOM.ROOM_INVLID_SEAT && player.seat != seat){
        var sid = this.channel.getMember(player.userID)['sid'];
        this.channelService.pushMessageByUids(route,data,[{uid: player.userID,sid: sid}]);
      }
  }
}
Room.prototype.sendMsgToOtherExceptUserID = function(route,userID,data){
  var allPlayer = this.playerManager.getAllPlayer();
  for(var i in allPlayer) {
      var player = allPlayer[i];
      if(player.userID != 0 && player.userID != userID){
        
        var sid = this.channel.getMember(player.userID)['sid'];
        this.channelService.pushMessageByUids(route,data,[{uid: player.userID,sid: sid}]);
      }
  }
}

Room.prototype.sendMsgToAll = function(route,data){
  this.channel.pushMessage(route, data, null);
}

Room.prototype.sendMsgToSeat = function(route,seat,data){
  var allPlayer = this.playerManager.getAllPlayer();
  for(var i in allPlayer) {
      var player = allPlayer[i];
      if(player.seat != DEF.ROOM.ROOM_INVLID_SEAT && player.seat == seat){
        var sid = this.channel.getMember(player.userID)['sid'];
        this.channelService.pushMessageByUids(route,data,[{uid: player.userID,sid: sid}]);
        break;
      }
  }
}
Room.prototype.sendMsgToUserID = function(route,userID,data){
  var allPlayer = this.playerManager.getAllPlayer();
  for(var i in allPlayer) {
      var player = allPlayer[i];
      if(player.userID != 0 && player.userID == userID){
        var sid = this.channel.getMember(userID)['sid'];
        this.channelService.pushMessageByUids(route,data,[{uid: userID,sid: sid}]);
        break;
      }
  }
}

//玩家进入
Room.prototype.onPlayerEnter = function(userID,isRelink){
  var allPlayer = this.playerManager.getAllPlayer();
  var self = null;

  //向自己以及其他玩家推送自己的信息
  for(var i in allPlayer) {
      if(allPlayer[i].userID == userID){
        self = {userID:allPlayer[i].userID,
                  name:allPlayer[i].userData.name,
                  headUrl:allPlayer[i].userData.head,
                  sex:allPlayer[i].userData.sex,
                  vip:allPlayer[i].userData.vip,
                  gold:allPlayer[i].userData.gold,
                  win:allPlayer[i].userData.win,
                  lose:allPlayer[i].userData.lose,
                  draw:allPlayer[i].userData.draw,
                  escape:allPlayer[i].userData.escape,
                  talent:allPlayer[i].userData.talent,
                  score:allPlayer[i].userData.score,
                  exp:allPlayer[i].userData.exp,
                  charm:allPlayer[i].userData.charm,
                  seat:allPlayer[i].seat
        };
        break;
      }
  }
  this.sendMsgToAll("room.roomHandler.playerInfo",self);


  //向自己推送其他玩家信息
  for(var i in allPlayer) {
      //有用户才发
      if(allPlayer[i].userID != userID && allPlayer[i].userID != 0){
        var player = {userID:allPlayer[i].userID,
                  name:allPlayer[i].userData.name,
                  headUrl:allPlayer[i].userData.head,
                  sex:allPlayer[i].userData.sex,
                  vip:allPlayer[i].userData.vip,
                  gold:allPlayer[i].userData.gold,
                  win:allPlayer[i].userData.win,
                  lose:allPlayer[i].userData.lose,
                  draw:allPlayer[i].userData.draw,
                  escape:allPlayer[i].userData.escape,
                  talent:allPlayer[i].userData.talent,
                  score:allPlayer[i].userData.score,
                  exp:allPlayer[i].userData.exp,
                  charm:allPlayer[i].userData.charm,
                  seat:allPlayer[i].seat
        };
        
        this.sendMsgToUserID("room.roomHandler.playerInfo",userID,player);
      }
  }

    //严重注意。此时可能是准备，也可能是游戏中，目前只可能是游戏中
  if(this.getPlayerIsOfflineByUserID(self.userID) || isRelink){
    
    this.playerManager.updatePlayerStateByUserID(self.userID,DEF.ROOM.STATE_TYPE.STATE_TYPE_PLAYING);
    //重连发送相关信息  //game.lianQiHandler.lianQiFlag
    this.sendMsgToUserID("game.lianQiHandler.lianQiFlag",self.userID,{flag:DEF.GAME.GAME_FLAG.RELINK_TYPE_BEGIN});
    //直接startgame
    this.sendMsgToUserID("game.lianQiHandler.lianQiStart",self.userID,{flag:0,firstHandSeat:this.firstHandSeat});
    //直接发送当前棋盘数据,需要从游戏请求 
    this.app.rpc.game.lianQiRemote.onRelink('*',{userID:self.userID,seat:self.seat,roomId:this.roomId},function(flag){});

    console.log("用户重连进游戏，userID:%d",self.userID);
  }else{

    //自动准备没有用到，应该放到ruleJson.rule里配置为autoStart，目前客户端会自动触发或者会点击准备的
    if(this.ruleJson.rule == "autoStart"){
      //是否是自动准备设定 //也可以是客户端决定是否自动准备，如果是自动上发act-准备
      //如果是自动准备，则发送玩家状态
      this.playerManager.updatePlayerState(self.userID,DEF.ROOM.STATE_TYPE.STATE_TYPE_ROOMREADY);

      //通知所有玩家用户状态变化
      this.onPlayerStateChange(DEF.ROOM.STATE_TYPE.STATE_TYPE_ROOMREADY,self.userID,self.seat,true);

      //如果全部已经准备，则自动开始
      if(this.playerManager.getAllPlayerReady()){
        //start game
        this.notifyClientStartGame();//此处应该先通知客户端开始游戏
      }
    }else if(this.ruleJson.rule == "default"){
      //如果其他用户状态不是sitdown，那么就应该想当前这个用户发送其他用户状态
      for(var i in allPlayer) {
        //有用户才发
        if(allPlayer[i].userID != self.userID && allPlayer[i].userID != 0){
          if(allPlayer[i].playerState != DEF.ROOM.STATE_TYPE.STATE_TYPE_SITDOWN){
            //向当前玩家发送该玩家状态
            var stateInfo = {state:allPlayer[i].playerState,userID:allPlayer[i].userID,seat:allPlayer[i].seat};
            this.sendMsgToUserID("room.roomHandler.playerState",self.userID,stateInfo);
          }
        }
      }
    }
  }
}

//玩家状态变化
Room.prototype.onPlayerStateChange = function(playerState,userID,playerSeat,needSelf){
    //通知所有玩家用户状态变化
    var stateInfo = {state:playerState,userID:userID,seat:playerSeat};

    if(!!needSelf){
      this.sendMsgToAll("room.roomHandler.playerState",stateInfo);
    }else{
      this.sendMsgToOtherExceptUserID("room.roomHandler.playerState",userID,stateInfo);
    }
}

//玩家动作,坐下，站起、准备等。目前只有准备和离开
Room.prototype.onPlayerAct = function(act,seat,userID){

  //不是坐下状态过滤准备
  if(this.playerManager.getPlayerStateBySeat(seat) != DEF.ROOM.STATE_TYPE.STATE_TYPE_SITDOWN){
    return;
  }

  if(act == DEF.ROOM.PLAYER_ACT.ACT_READY){
    this.playerManager.updatePlayerStateBySeat(seat,DEF.ROOM.STATE_TYPE.STATE_TYPE_ROOMREADY);
    this.onPlayerStateChange(DEF.ROOM.STATE_TYPE.STATE_TYPE_ROOMREADY,userID,seat,false);
  }else{
    console.log("不支持的用户状态变化" + act);
    return;
  }

  //如果全部已经准备，则自动开始
  if(this.playerManager.getAllPlayerReady() 
    && (this.roomType == DEF.ROOM.ROOM_TYPE.ROOM_PLAZA || this.roomType == DEF.ROOM.ROOM_TYPE.ROOM_CLASSIC_PLAZA)){
    //start game
    this.notifyClientStartGame();
  }else{
    // 需要房主手动开启游戏
  }
}

Room.prototype.getPlayerIsPlayingBySeat = function(seat){
  return this.playerManager.getPlayerIsPlayingBySeat(seat);
}

Room.prototype.getPlayerIsOfflineBySeat = function(seat){
  return this.playerManager.getPlayerIsOfflineBySeat(seat);
}

Room.prototype.getPlayerIsPlayingByUserID = function(userID){
  return this.playerManager.getPlayerIsPlayingByUserID(userID);
}

Room.prototype.getPlayerIsOfflineByUserID = function(userID){
  return this.playerManager.getPlayerIsOfflineByUserID(userID);
}

Room.prototype.getPlayerNum = function(){
  return this.playerManager.getPlayerNum();
}

Room.prototype.getIfPlayerInRoom = function(userID){
  var allPlayer = this.playerManager.getAllPlayer();
  for(var i in allPlayer) {
    if(allPlayer[i].userID == userID) return true;
  }

  return false;
}

Room.prototype.onPlayerLeave = function(userID){
  //处理用户离开
  if(!!this.channel) {
    var sid = this.channel.getMember(userID)['sid'];
    this.channel.leave(userID,sid);
  }

  var seat = this.playerManager.playerLeave(userID);

  //房间中没有玩家了，如果是则删除所有
  if(this.getPlayerNum() == 0){
    return true;
  }else{
    var leaveMsg = {seat:seat,userID:userID,type:DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_NORMAL};
    this.sendMsgToOtherExceptUserID("room.roomHandler.playerLeave",userID,leaveMsg);
  }
  return false;
}

//解散房间
Room.prototype.onDissolve = function(userID){
  
  var allPlayer = this.playerManager.getAllPlayer();

  for(var i in allPlayer) {
      if(allPlayer[i].userID == 0){
        continue;
      }

      if(allPlayer[i].userID != userID){
        var leaveMsg = {seat:allPlayer[i].seat,userID:userID,type:DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_OWNER_DISSOLVE};
        this.sendMsgToUserID("room.roomHandler.playerLeave",allPlayer[i].userID,leaveMsg);
      }

      //移除
      if(!!this.channel) {
        var sid = this.channel.getMember(allPlayer[i].userID)['sid'];
        this.channel.leave(allPlayer[i].userID,sid);
      }
  }
}

Room.prototype.playerTalk = function(seat,userID,content){
  this.sendMsgToOtherExceptUserID("room.roomHandler.playerTalkMsg",userID,{flag:DEF.RET_SUCCESS,seat:seat,content:content});
}
Room.prototype.onPlayerOffline = function(userID){

  var seat = this.playerManager.getPlayerSeatByUserID(userID);
  //  如果用户在游戏中，不能离开
  if(this.getPlayerIsPlayingByUserID(userID) || this.getPlayerIsOfflineByUserID(userID)){
    //设置玩家状态为离线
    this.onPlayerStateChange(DEF.ROOM.STATE_TYPE.STATE_TYPE_OFFLINE,userID,seat,false);
    
    var stateInfo = {state:DEF.ROOM.STATE_TYPE.STATE_TYPE_OFFLINE,userID:userID,seat:seat};

    this.sendMsgToOtherExceptUserID("room.roomHandler.playerState",userID,stateInfo);

    return;
  }

  if(!!this.channel) {
    var sid = this.channel.getMember(userID)['sid'];
    this.channel.leave(userID,sid);
  }

  this.playerManager.playerLeave(userID);

  var leaveMsg = {seat:seat,userID:userID,type:DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_NORMAL};
  this.sendMsgToOtherExceptUserID("room.roomHandler.playerLeave",userID,leaveMsg);
}

Room.prototype.onReportTalentList = function(data,cb){
  //记录该玩家的天赋配置列表，在游戏初始化的时候传过去，进行初始化游戏
  if(this.playerManager.getPlayerUserIDBySeat(data.seat) != data.userID){
    //座位和userid不对应，不应该发生此类错误
    cb({seat:data.seat,talentList:""});
    return;
  }
  var player = this.playerManager.getPlayerBySeat(data.seat);
  var strTalentList = data.talentList.split(",");
  player.talentList = strTalentList.map(function(data){return Number(data);});

  //自己上报的响应
  cb({seat:player.seat,talentList:player.talentList.join(",")});

  var allPlayer = this.playerManager.getAllPlayer();
  //向该玩家发送其他人的天赋列表 - 此消息必须有seat之后发送
  for(var i in allPlayer) {
      //有用户才发
      if(allPlayer[i].userID != data.userID && allPlayer[i].userID != 0){        
        this.sendMsgToUserID("room.roomHandler.talentList",data.userID,{seat:allPlayer[i].seat,talentList:allPlayer[i].talentList.join(",")});
      }
  }
  //向其他玩家发送该玩家的天赋列表 - 
  for(var i in allPlayer) {
      //有用户才发
      if(allPlayer[i].userID != data.userID && allPlayer[i].userID != 0){        
        this.sendMsgToUserID("room.roomHandler.talentList",allPlayer[i].userID,{seat:player.seat,talentList:player.talentList.join(",")});
      }
  }
}

Room.prototype.onRoomRemoved = function(type){
  
  //重置数据库中用户所在的房间id
  this.updateUsersRoomIdInDB(0);

  //通知房间删除
    var allPlayer = this.playerManager.getAllPlayer();

    for(var i in allPlayer) {
      var player = allPlayer[i];
      /*
        if(!!this.channel) {
          var sid = this.channel.getMember(player.userID)['sid'];
          this.channel.leave(player.userID,sid);
        }
       */

      this.sendMsgToUserID("room.roomHandler.playerLeave",player.userID,{seat:player.seat,userID:player.userID,type:type})
    }
}

// 客户端通知的游戏开始了 --- 此处需要修改优化，只有当房主点击开始按钮，且已经启动了游戏界面后才可以发动start，而不是点击就发
// 所有用户均需要在启动完成后发送这个消息，通知服务端
Room.prototype.onNotifyStartGame = function(data){

    //这里需要判断是否是正常的开启，比如人离开了但是还是没有禁用开始按钮
    if(this.ruleJson.playerNum != this.playerManager.getPlayerNum()) {
      return;
    }

    // 只有房主才能开启游戏
    if(this.roomType == DEF.ROOM.ROOM_TYPE.ROOM_PLAZA || this.roomType == DEF.ROOM.ROOM_TYPE.ROOM_CLASSIC_PLAZA){
      this.receiveStartGame(this.ruleJson.playerNum);
    }else{
        if(data.userID == this.owner/* && !data.isEnterRoomFinsh */){
          this.notifyClientStartGame(this.owner);//房主的话就向其他玩家发送
        }else{
          this.receiveStartGame(this.ruleJson.playerNum);
        }
    }
}
//---------------------------------游戏过程--------------------------------------------------------
Room.prototype.receiveStartGame = function(total){
    this.delClock(this.recStartGameClock[this.recStartGameNum]);
    
    this.recStartGameNum++;
    if(this.recStartGameNum == total){
      this.startGame();
      this.recStartGameClock = [];
      this.recStartGameNum = 0;
    }
}
Room.prototype.notifyClientStartGame = function(owner = 0){
  var timerNum = this.ruleJson.playerNum;
  if(this.roomType == DEF.ROOM.ROOM_TYPE.ROOM_PLAZA || this.roomType == DEF.ROOM.ROOM_TYPE.ROOM_CLASSIC_PLAZA){
    //向所有客户端发送启动游戏开始
    this.sendMsgToAll("room.roomHandler.notifyStartGame",{});
  }else{
    // 此种情况属于房主主动触发，其已经向服务器发送过start game了，也就是其已经进入游戏界面，不需要再向其发送
     this.sendMsgToOtherExceptUserID("room.roomHandler.notifyStartGame",owner,{});
     timerNum = timerNum - 1;//减少一个房主的
     this.recStartGameNum = this.recStartGameNum + 1;//已经收到一个
  }

  //此处需要启动定时器，超时，也认为收到startgame
  for(var i = 0;i < timerNum;i++){
    var cid = schedule.scheduleJob({start:Date.now()+2000}, function(data){
      //
      data.self.recStartGameNum++;
      if(data.self.recStartGameNum == data.self.ruleJson.playerNum){
        data.self.startGame();
        data.self.recStartGameClock = [];
        data.self.recStartGameNum = 0;
      }

    }, {self:this});

    this.recStartGameClock.push(cid);
  }
}

Room.prototype.ednGame = function(data,cb){
  this.state = DEF.ROOM.ROOM_GAME_STATE.ROOM_WAIT;
  this.roomTimestamp = new Date().getTime();
}

Room.prototype.startGame = function(){
  //启动游戏
  this.app.rpc.game.lianQiRemote.onStartGame('*',{roomId:this.roomId,rule:this.rule},function(flag){
    //添加游戏对局失败
    if(flag != 0){
      //这里可能需要调用roomManager,删除房间
      //正常情况，不可能出现添加对局失败
      console.log("Room Start Game Error");
    }else{
      console.log("Room Start Game Success");
    }
  });
}

//游戏过程数据通知
Room.prototype.notifyGameState = function(data){
  var end = false;
  switch(data.type){
    case DEF.GAME.NOTIFY_GAME_STATE.START:
      this.notifyStartGame(data.data);
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.PLAY:
      this.notifyPlay(data.seat,data.data);
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.MOVE:
      this.notifyMove(data.seat,data.data);
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.DRAW:
      this.notifyDraw(data.seat,data.data);
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.PASS:
      this.notifyPass(data.seat,data.data);
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.ABANDON:
      this.notifyAbandon(data.seat,data.data);
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.END:
      this.notifyEND(data.seat,data.data);
      end = true;
      break;
    case DEF.GAME.NOTIFY_GAME_STATE.RELINK:
      this.notifyRelink(data.seat,data.userID,data.data,data.banDirList);
      break;
  }
  return end;
}
Room.prototype.notifyRelink = function(seat,userID,data,banDirList){
    //直接发送当前棋盘数据,需要从游戏请求  
    this.sendMsgToUserID("game.lianQiHandler.lianQI",userID,{turn:seat,checkerBoard:data});
    
    //发送当前手以及禁用方向
    this.sendMsgToUserID("game.lianQiHandler.lianQITurn",userID,
      {seat:seat,isPassTurn:1,isTimeOut:0,round:this.round,lmt:banDirList});

    //发送重连结束标志
    this.sendMsgToUserID("game.lianQiHandler.lianQiFlag",userID,{flag:DEF.GAME.GAME_FLAG.RELINK_TYPE_END});
}
Room.prototype.notifyPlay = function(seat,data){
  //发送给其他人
  this.sendMsgToOtherExceptSeat("game.lianQiHandler.lianQiPlay",seat,data);
}
Room.prototype.notifyMove = function(seat,data){
  this.sendMsgToOtherExceptSeat("game.lianQiHandler.lianQiMove",seat,data);
}
Room.prototype.notifyDraw = function(seat,data){
  this.sendMsgToOtherExceptSeat("game.lianQiHandler.lianQiDraw",seat,data);
}
Room.prototype.notifyPass = function(seat,data){
  //首先判断用户是否已经投降，已经投降需要直接自动pass
  if(this.gameRecord[data.seat].hasAbandon == 1){
    
    this.app.rpc.game.lianQiRemote.onAbandonPass('*',{seat:data.seat,roomId:this.roomId,userID:this.playerManager.getPlayerUserIDBySeat(data.seat)},
      function(flag){});

    //abandonpass
    if(data.isAbandon || data.isTimeOut){
        this.sendMsgToAll("game.lianQiHandler.lianQiAbandonPass",{seat:data.seat});
    }else{
      this.sendMsgToOtherExceptSeat("game.lianQiHandler.lianQiAbandonPass",seat,{seat:data.seat});
    }

    return;
  }

  //正常处理
  data.round = this.round;

  if(data.isTimeOut || data.isAbandon){
    this.sendMsgToAll("game.lianQiHandler.lianQITurn",data);
  }else{
    this.sendMsgToOtherExceptSeat("game.lianQiHandler.lianQITurn",seat,data);
  }

  //回合＋1
  this.round += 1;

  //是否配置了回合限制，如果配置了且超出回合，则结束游戏
  if(this.ruleJson.lmtRound != 0 && this.round > this.ruleJson.lmtRound){
      //结束游戏
      this.app.rpc.game.lianQiRemote.onEndGame('*',{roomId:this.roomId},function(flag){});
  }else{
    //是否配置每手时间限制，如果设置了限时，则启动倒计时，超时则自动换手
    this.stepClock(Number(DEF.GAME.GAME_STEP.GAME_STEP_PASS),data.seat,Number(this.ruleJson.lmtTurnTime));
  }
}
Room.prototype.notifyAbandon = function(seat,data){

  //一旦被标记为投降，后续不能再执行该玩家的换手

  this.sendMsgToOtherExceptSeat("game.lianQiHandler.lianQiAbandon",seat,data);

  this.gameRecord[seat].hasAbandon = 1;
  var abandonCnt = 0;
  for(var i = 0;i < this.ruleJson.playerNum;i++){
    if(this.gameRecord[i].hasAbandon == 1){
      abandonCnt += 1;
    }
  }

  //只剩下一个人了，结束游戏
  if(abandonCnt == this.ruleJson.playerNum - 1){
    // 投降不需要确认，直接请求游戏逻辑结束游戏
    this.app.rpc.game.lianQiRemote.onEndGame('*',{roomId:this.roomId},function(flag){});
  }else{
    //自动pass掉当前轮
    
    this.clockID = this.delClock(this.clockID);

    this.app.rpc.game.lianQiRemote.onAbandonPass('*',{seat:seat,roomId:this.roomId,userID:this.playerManager.getPlayerUserIDBySeat(seat)},
      function(flag){});
  }
}

Room.prototype.notifyEND = function(seatList,data){
  // 这里需要做一些处理，比如保存数据到数据库
  // 特殊牌型等
  // 清理本room的一切信息
  this.clockID = this.delClock(this.clockID);

  var poolGold = 0;
  for(var r = 0 ;r < this.ruleJson.playerNum;r++){
    if(this.gameRecord[r].hasAbandon == 1){
      poolGold += this.gameRecord[r].multi * this.baseScore * 2/5;
    }else{
      poolGold += this.gameRecord[r].multi * this.baseScore;
    }
  }

  //获取棋子数量
  for(var s in seatList){
    for(var d in data){
      if(data[d].playerID == s){
        //这里可以再加一层循环判断，不过不是必要的
        this.gameRecord[seatList[s].seat].area += 1;
        this.gameRecord[seatList[s].seat].realArea += 1;
      }
    }
  }

  //如果投降了，把area设置成 －1
  var abandonCnt = 0;
  for(var r in this.gameRecord){
    if(this.gameRecord[r].hasAbandon == 1){
      this.gameRecord[r].area = -1;
      abandonCnt += 1;
    }
  }

  //根据area 排序
  this.gameRecord.sort(function(playerA,playerB){return playerA.area < playerB.area});

  var result = [];
  var allPlayer = this.playerManager.getAllPlayer();
  for(var i in allPlayer) {
      var rst = {};
      rst['seat'] = allPlayer[i].seat;

      for(var r in this.gameRecord){
        if(this.gameRecord[r].seat == allPlayer[i].seat){

          rst['area'] = this.gameRecord[r].realArea;//棋子数
          rst['kill'] = this.gameRecord[r].kill;//消灭，这个需要记录累加
          rst['multi'] = this.gameRecord[r].multi;//目前不支持调节倍数,固定为1
          rst['hasAbandon'] = this.gameRecord[r].hasAbandon;

          if(this.gameRecord[r].hasAbandon == 1){
            rst['score'] = this.baseScore * this.gameRecord[r].multi * 3/5;//投降的玩家只扣除40% - 因为投降不需要显示输，只显示退的钱
            break;
          }

          //2 人和4人 计算方式不同
          if(this.ruleJson.playerNum == 2){
            if(r == 0){
              rst['score'] = poolGold;//金币输赢 
            }else{
              rst['score'] = -poolGold;
            }
          }else if(this.ruleJson.playerNum == 3){ //暂时不支持，后续添加
            if(r == 0){
              rst['score'] = 2 * poolGold / 3;//金币输赢 
            }else if(r == 1){
              rst['score'] = poolGold / 3;//金币输赢 
            }else if(r == 2){
              rst['score'] = - poolGold;//金币输赢 
            }
          }else if(this.ruleJson.playerNum == 4){
            if(r == 0){
              if(abandonCnt == 0){
                rst['score'] = 3 * poolGold / 5;//金币输赢
              }else if(abandonCnt == 1){
                rst['score'] = 4 * poolGold / 5;
              }else if(abandonCnt == 2){
                rst['score'] = poolGold;
              }else if(abandonCnt == 3){
                rst['score'] = poolGold;
              }
            }else if(r == 1){
              if(abandonCnt == 0){
                rst['score'] = 8 * poolGold / 25;//金币输赢 
              }else if(abandonCnt == 1){
                rst['score'] = poolGold / 5;
              }else if(abandonCnt == 2){
                rst['score'] = 0;
              }
            }else if(r == 2){
              if(abandonCnt == 0){
                rst['score'] = 2 * poolGold / 25;//金币输赢
              }else if(abandonCnt == 1){
                rst['score'] = 0;
              }
            }else if(r == 3){
              if(abandonCnt == 0){
                rst['score'] = - poolGold;//金币输赢 
              }
            }
          }

          break;
        }
      }
      
      result.push(rst);
  }

  //根据输赢排序
  result.sort(function(playerA,playerB){return playerA.score < playerB.score});

  this.sendMsgToAll("game.lianQiHandler.lianQiResult",{poolGold:poolGold,checkerBoard:[],result:result,type:[0,1,0,0]});

  //或许可以启定时器，等待用户几秒钟，如果没有准备，则自动踢出到大厅
  //也可以直接踢出到大厅，用户自行离开，而不是直接退出

  //直接在外部删除该room数据
  //
  
  //更新数据库 //扣除对局费
  for(var i in result){
    var userID = this.playerManager.getPlayerUserIDBySeat(result[i].seat);
    var base = this.baseScore * this.gameRecord[r].multi;
    var charge = 0;
    var chageGold = result[i].score - base - charge;
    if(result[i].hasAbandon == 1){
      //如果投降过，分数需要修正为 -
      chageGold = -this.baseScore * this.gameRecord[r].multi * 2/5 - charge;
    }
    this.app.rpc.db.dbRemote.updateUserGoldForGameResult('*',userID,chageGold,function(){
      //console.info("对局结束，更新玩家[%d],金币信息[%d]",userID,result[i].score);
    });
  }

  //清空
  this.gameRecord = [{seat:0,hasAbandon:0,area:0,realArea:0,kill:0,multi:1},
                  {seat:1,hasAbandon:0,area:0,realArea:0,kill:0,multi:1},
                  {seat:2,hasAbandon:0,area:0,realArea:0,kill:0,multi:1},
                  {seat:3,hasAbandon:0,area:0,realArea:0,kill:0,multi:1}];
}

Room.prototype.notifyStartGame = function(data){
    this.state = DEF.ROOM.ROOM_GAME_STATE.ROOM_PLAYING;
    var allPlayer = this.playerManager.getAllPlayer();
    //所有玩家状态设置成游戏中
    for(var i in allPlayer) {
        this.playerManager.updatePlayerStateBySeat(allPlayer[i].seat,DEF.ROOM.STATE_TYPE.STATE_TYPE_PLAYING);
    }

    //这里可以有个掷骰子的动作
    //率先掷骰子
    var seatList = [];//传递给游戏，做对应关系
    var player = allPlayer[Math.floor(Math.random()*allPlayer.length)];

    //记录先手是谁，用于客户端计算匹配
    this.firstHandSeat = player.seat;

    //向所有用户发送开始
    this.sendLianQiStart();
    
    //data是落子顺序，需要与当前座位对应
    for(var i = 0;i < allPlayer.length;i++) {
      if(allPlayer[i].userID != 0){
        var realSeat = (i + Number(player.seat))%allPlayer.length;
        seatList.push({seat:realSeat,userID:allPlayer[realSeat].userID,talentList:allPlayer[i].talentList});
      }
    }
    
    //立即开始游戏
    this.app.rpc.game.lianQiRemote.onLianQiStart('*',{roomId:this.roomId,rule:this.rule,seatList:seatList,isThreeBan:this.getIfBanThreeDir()},function(flag){});

    //发送当前手 //开局无禁止方向

    //如果是3禁手模式
    var gameBanDirect = [];
    if(this.getIfBanThreeDir()){
      gameBanDirect = [DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE,
                            DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE,
                            DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE];
    }else{
      gameBanDirect = [DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE,
                            DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE];
    }

    this.sendMsgToAll("game.lianQiHandler.lianQITurn",{seat:player.seat,isPassTurn:0,isTimeOut:0,round:this.round,lmt:gameBanDirect});
    this.stepClock(Number(DEF.GAME.GAME_STEP.GAME_STEP_PASS),player.seat,Number(this.ruleJson.lmtTurnTime));

    //此时将数据库用户房间状态设置成用户在房间中，直到用户对局游戏结束
    this.updateUsersRoomIdInDB(this.roomId);
}

Room.prototype.sendLianQiStart = function(){
  this.sendMsgToAll("game.lianQiHandler.lianQiStart",{flag:0,firstHandSeat:this.firstHandSeat});
}

Room.prototype.updateUsersRoomIdInDB = function(roomId){
  var allPlayer = this.playerManager.getAllPlayer();

  var userIDs = [];//数据库更新用户房间id
  for(var i = 0;i < allPlayer.length;i++) {
    if(allPlayer[i].userID != 0){
      userIDs.push(allPlayer[i].userID);
    }
  }
  this.app.rpc.db.dbRemote.updateUserRoomID('*',userIDs,roomId,function(flag){});
}

//--------------------------------游戏步骤定时器-----------------------------------

Room.prototype.stepClock = function(step,seat,maxTime){
  
  //原则上来说，这个判断没有意义，不会进去
  this.clockID = this.delClock(this.clockID);

  this.waitPassTime = 0;

  //如果不存在或者＝0，说明是不限制每手时长，不启动定时器
  if(!!!this.ruleJson.lmtTurnTime || this.ruleJson.lmtTurnTime == 0){
    return;
  }

  this.clockID = schedule.scheduleJob({start:Date.now()+1000, period:1000, count: maxTime}, function(data){
    
    if(data.self.waitPassTime - data.MAX > 0) 
    {
      console.warn("定时器出错超过的错误，一定是哪里写错了！");
      return;
    }
    data.self.waitPassTime += 1;
    
    if(data.self.waitPassTime - data.MAX == 0){
      //切换下棋方
      // 这里好像两边都要pass-或者直接通知游戏逻辑pass，最简单
      data.self.app.rpc.game.lianQiRemote.onClockTimeOut('*',
        {roomId:data.self.roomId,seat:data.seat,step:data.step,userID:data.self.playerManager.getPlayerUserIDBySeat(data.seat)},
        function(flag){});

      //  不能在定时器的回调里，删除定时器
        //data.self.clockID = data.self.delClock(data.self.clockID);
    }

  }, {step:step,seat:seat,MAX:maxTime,self:this});
}


//-----------------------------------------------------------------------------
Room.prototype.delClock = function(clockID){
  if(clockID != null){
    schedule.cancelJob(clockID);
  }
  return null;
}

Room.prototype.getIfBanThreeDir = function(){
  if(this.isAutoCreate && this.plazaID == 10001 /*三禁手的场id*/){
    return true;
  }else{
    return false;
  }
}

/**
 * Expose 'Room' constructor.
 */
module.exports = Room;

