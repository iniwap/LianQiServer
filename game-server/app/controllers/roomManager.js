/**
 * Module dependencies
 */
var DEF = require('../consts/consts');
var utils = require('../util/utils');
var roomLogger = require('pomelo-logger').getLogger('room-log', __filename);
var Room = require('../models/Room');
var pomelo = require('pomelo');

var exp = module.exports;

//限定roomid范围 在100000-999999之间，不采用一直递增的算法.因为需要房号用来显示，需要房号重复利用

var gRoomList = {};
var gRoomID = DEF.ROOM.ROOM_ID_BEGIN;
var gRoomCnt = 0;
var gPlazaConfig = null;

//创建房间
exp.onCreateRoom = function(app,data,cb) {
	//同一个用户只能创建一个房间
	for(var i in gRoomList){
		var room = gRoomList[i];
		if(room.owner == data.userID){
			cb(DEF.RET_SUCCESS,{flag:0,roomId:room.roomId,roomName:room.roomName,roomPassword:room.pwd,rule:room.rule});
			return;
		}
	}

	if(data.roomType != Number(DEF.ROOM.ROOM_TYPE.ROOM_ROOM) 
		&& data.roomType != Number(DEF.ROOM.ROOM_TYPE.ROOM_TEAM)){
		
		cb(DEF.RET_ERROR,{flag:-1});
		return;
	}

	app.rpc.db.dbRemote.getPlayerData('*',data.userID,function(flag,user){
		if(flag != 0){
			cb(DEF.RET_ERROR,{flag:-1});
			return;
		}

		//客户端需要过滤这个操作，原则上不存在这个情况
		if(user.gold < data.baseScore){
			cb(DEF.RET_ERROR,{flag:-1});
			return;
		}
		var rl = 0;
		if(data.baseScore < 500){
			rl = Number(DEF.ROOM.PLAZA_ROOM_LEVEL.PLAZA_LEVEL_LOW);
		}else if(data.baseScore >= 500 && data.baseScore < 5000){
			rl = Number(DEF.ROOM.PLAZA_ROOM_LEVEL.PLAZA_LEVEL_MIDDLE);
		}else if(data.baseScore >= 5000){
			rl = Number(DEF.ROOM.PLAZA_ROOM_LEVEL.PLAZA_LEVEL_HIGH);
		}

		var room = createRoom(false,data.roomType,{rule:data.rule,					
						baseScore:data.baseScore,
						minScore:data.minScore,
						maxScore:data.maxScore,
						roomLevel:rl,
			pwd:data.roomPassword,roomName:data.roomName,owner:data.userID,app:app});
		
		if(!!room){
			//目前设定创建房间后，不直接进入	
			cb(DEF.RET_SUCCESS,{flag:0,roomId:room.roomId,roomName:room.roomName,roomPassword:room.pwd,rule:room.rule});

			if(data.roomType == Number(DEF.ROOM.ROOM_TYPE.ROOM_ROOM)){
				onRoomStateChange(DEF.ROOM.ROOMSTATE_CHANGE_TYPE.ROOMSTATE_ADD,room);
			}else{

			}

		}else{
			cb(DEF.RET_ERROR,{flag:-1});
		}
	});
}
//加入房间 - 包括场次系统房间和自建房间
exp.onJoinRoom = function(app,data,cb) {
	//可能这里需要直接拒绝人数和阶数不支持的情况
	if(data.roomId == 0){
		if(checkIfInRoom(data.userID,cb)){
			//已经在房间中
			return;
		}
	}
	//这里需要查询用户信息
	app.rpc.db.dbRemote.getPlayerData('*',data.userID,function(flag,user){
		if(flag != 0){
			cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_ACCOUNT_ERR,DEF.ROOM.ROOM_ID_INVLID);
			return;
		}

		//是否已经在房间中
		if(user.room_id != 0){
			var room = gRoomList[user.room_id];
			if(!!room) {
				//查询房间是否真的存在，存在进入该房间
				//此时为断线重连 to do
			  	//进入房间
				enterRoom(room,user,user.serverId,true,false,cb);

				return;
			}else{
				//重置用户房间号位0，此处是出错处理
				app.rpc.db.dbRemote.updateUserRoomID('*',[user.id],0,function(){});
			}
		}

		//首先判断roomid是否为0
		if(data.roomId  != 0){
			//加入已经创建的房间，非系统创建，用户自行创建的房间
		  var room = gRoomList[data.roomId];
		  if(!room) {
		  	//房间不存在，加入房间失败
		  	cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINGROOM_FAIL_ROOM_NOT_EXIST,DEF.ROOM.ROOM_ID_INVLID);
		  	return;
		  }else{
		  	if(room.isAutoCreate){
		  		//系统房间不允许输入加入,非法操作
		  		cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINGROOM_FAIL_ROOM_NOT_EXIST,DEF.ROOM.ROOM_ID_INVLID);
		  		return;
		  	}

		  	//房间存在，执行加入
		  	//如果需要判断房间密码，则判断密码
		  	if(room.pwd != ""){
		  		if(data.pwd != room.pwd){
		  			cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_PWD_ERR,DEF.ROOM.ROOM_ID_INVLID);
		  			return;
		  		}
		  	}

		  	//进入房间
		  	//需要判断用户是否满足底分限制
			if(room.maxScore != 0 && user.gold > room.maxScore){
				//钱太多了
				cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_GOLD_MORE,DEF.ROOM.ROOM_ID_INVLID);
				return;
			}else if(user.gold < room.minScore){ //这里可能还要处理 倍率
				cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_GOLD_LESS,DEF.ROOM.ROOM_ID_INVLID);
				//钱太少
				return;
			}
			
			enterRoom(room,user,user.serverId,false,false,cb);

			//此处应该一定是自建房
			if(!room.isAutoCreate){
				onRoomStateChange(DEF.ROOM.ROOMSTATE_CHANGE_TYPE.ROOMSTATE_UPDATE,room);
			}
		  }
		}else{
			//加入系统创建的房间，即点击模式进入的房间
			var plaza = getPlazaData(data.plazaID);
			if(plaza == null){
				cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_PLAZA_ERR,DEF.ROOM.ROOM_ID_INVLID);
				return;
			}

			//根据用户金币信息，自动选择一个level等级的场次
			var levelIndex = -1;

			if(plaza.lmt_type == DEF.LOBBY.LMT_TYPE.LMT_BY_GOLD){

				var levelList = plaza['levelList'];
				if(user.gold < levelList[0].minsr){
					// 钱不够进入任何房间了
					cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_GOLD_LESS,DEF.ROOM.ROOM_ID_INVLID);

					return;
				}else if(user.gold > levelList[levelList.length - 1].minsr){
					//此时只能进入最高级的场次
					levelIndex = levelList.length - 1;
				}else{
					for(var i = 0;i<levelList.length - 1;i++){
						if(levelList[i].minsr < user.gold <= levelList[i].maxsr){
							levelIndex = i;
							break;
						}
					}
				}
			}else if(plaza.lmt_type == DEF.LOBBY.LMT_TYPE.LMT_BY_LEVEL){
				/*
				if(user.score < plaza.minsr){
					//段位过低
					cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_LEVEL_LESS,DEF.ROOM.ROOM_ID_INVLID);
					return;
				}else if(user.score > plaza.maxsr){
					//段位过高
					cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_LEVEL_MORE,DEF.ROOM.ROOM_ID_INVLID);
					return;
				}
				*/
			}

			if(levelIndex == -1){
				cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_PLAZA_ERR,DEF.ROOM.ROOM_ID_INVLID);
				console.error("查找合适的场等级错误，plazaid:%d,userID:%d",data.plazaID,data.userID);
				return;
			}
			
			var baseScore = levelList[levelIndex].base_score;
			var minScore = levelList[levelIndex].minsr;
			var maxScore = levelList[levelIndex].maxsr;
			var levelid = levelList[levelIndex].levelid;
			
			//优先从已经有人在等待的房间中选择让用户进入
			//从现有系统分配的房间列表中找到一个满足条件的房间，进入
			var findRoom = DEF.ROOM.ROOM_ID_INVLID;
			for(var key in gRoomList){
				if(gRoomList[key].plazaID == data.plazaID){
					var tmpRoom = gRoomList[key];
					if(!tmpRoom.getIsFull() 
						&& tmpRoom.ruleJson.playerNum == data.playerNum
						&& tmpRoom.ruleJson.gridLevel == data.gridLevel
						&& tmpRoom.roomLevel == levelid){
							findRoom = key;
							break;
					}
				}
			}
			//是否找到满足条件的 //加入房间
			if(findRoom != DEF.ROOM.ROOM_ID_INVLID){
				//进入房间
				enterRoom(gRoomList[findRoom],user,user.serverId,false,false,cb);

			}else{

				//由于一个场支持两种人数模式
				//这里需要修改rule里的playernum和gridlevel
				var tmpRuleJson = JSON.parse(plaza.rule);
				tmpRuleJson.playerNum = data.playerNum;
				tmpRuleJson.gridLevel = data.gridLevel;

				var room = createRoom(true,plaza.room_type,{plazaID:plaza.plazaid,
					baseScore:baseScore,
					roomLevel:levelid,
					minScore:minScore,
					maxScore:maxScore,
					name:plaza.name,
					rule:JSON.stringify(tmpRuleJson),
					app:app});
				//进入房间
				enterRoom(room,user,user.serverId,false,false,cb);
			}
		}
	});
}
//离开房间
exp.onLeaveRoom = function(data,cb) {
	var room = gRoomList[data.roomId];
	if(!!room) {
		//存在
		if(room.getPlayerIsPlayingByUserID(data.userID)){
			//正在游戏中，不能离开。后续开发为由机器人代替
			cb(DEF.ROOM.PLAYER_LEAVE.LEAVE_CANT_LEAVE,{type:DEF.ROOM.PLAYER_LEAVE.LEAVE_CANT_LEAVE,
				leaveResult:1,msg:"您正在游戏中，不能离开！"});
		}else{
			//房主离开房间，视为解散房间
			if(data.userID == room.owner){
				//LEAVE_DISSOLVE
				cb(DEF.ROOM.PLAYER_LEAVE.LEAVE_NORMAL,{type:DEF.ROOM.PLAYER_LEAVE.LEAVE_DISSOLVE,
						leaveResult:0,msg:"房间成功解散！"});
				room.onDissolve(data.userID);
				removeRoomFromRoomList(room,DEF.ROOM.PLAYER_LEAVE.LEAVE_DISSOLVE);
			}else{
				//先响应，再剔除用户
				if(room.getIfPlayerInRoom(data.userID)){
					cb(DEF.ROOM.PLAYER_LEAVE.LEAVE_NORMAL,{type:DEF.ROOM.PLAYER_LEAVE.LEAVE_NORMAL,
						leaveResult:0,msg:"正常离开房间"});
					//是否需要删除房间
					if(room.onPlayerLeave(data.userID)){
						//移除
						removeRoomFromRoomList(room,DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_NORMAL);
					}

				}else{
					cb(DEF.ROOM.PLAYER_LEAVE.LEAVE_NOT_IN_ROOM,{type:DEF.ROOM.PLAYER_LEAVE.LEAVE_NOT_IN_ROOM,
						leaveResult:0,msg:"您不在房间中"});
				}
			}
		}
	}else{
		//不存在，即用户不在房间中，客户端收到需要直接退出游戏界面
		cb(DEF.ROOM.PLAYER_LEAVE.LEAVE_NOT_IN_ROOM,{type:DEF.ROOM.PLAYER_LEAVE.LEAVE_NOT_IN_ROOM,
			leaveResult:0,msg:"房间不存在"});
	}
}
//房间列表
exp.onGetRoomList = function(data,cb) {
	// 只返回用户自己创建的房间，不返回系统自动创建的房间
	var roomList = [];
	for(var i in gRoomList){
		if(!gRoomList[i].isAutoCreate){
			var room = {roomId:gRoomList[i].roomId,
						roomName:gRoomList[i].roomName,
						roomDes:"",
						roomPwd:gRoomList[i].pwd,
						isFull:gRoomList[i].getIsFull(),
						roomPersonCnt:gRoomList[i].getPlayerNum()};

			roomList.push(room);
		}
	}
	cb(roomList);
}
//房间聊天
exp.onPlayerTalkMsg = function(data,cb) {
	var room = gRoomList[data.roomId];
	if(!!room) {
		//房间存在
		room.playerTalk(data.seat,data.userID,data.content);
		cb({flag:DEF.RET_SUCCESS,seat:data.seat,content:data.content});
	}else{
		//房间不存在
		cb({flag:DEF.RET_ERROR});
	}
}
//托管 - 暂不支持
exp.onTrust = function(data,cb) {

}
//玩家准备 站起 坐下 等
exp.onPlayerAct = function(data,cb){	
	var room = gRoomList[data.roomId];
	if(!!room) {
		//房间存在
		room.onPlayerAct(data.act,data.seat,data.userID);
		cb(DEF.RET_SUCCESS);
	}else{
		//房间不存在
		cb(DEF.RET_ERROR);
	}
}
//客户端通知 可以开始游戏了
exp.onNotifyStartGame = function(data){
	var room = gRoomList[data.roomId];

	if(!!room) {
		room.onNotifyStartGame(data);
	}else{
		console.error("用户开启游戏，但房间不存在，[roomId :%d,userID:%d ]",data.roomId,data.userID);
	}
}

//玩家断开
exp.onUserDisconnect = function(data,cb){
	//用户掉线。
	//如果在游戏中，托管或者直接结束对局
	//如果不在游戏中，直接退出房间	
	for(var i in gRoomList){
		var room = gRoomList[i];
		var all = room.getAllPlayer();
		for(var j in all){
			if(all[j].userID == data.userID){
				
				//打印
				cb(all[j].userData.name);

				room.onPlayerOffline(data.userID);

				//是否需要删除房间 //后续如果有需求保留房间，则不删除
				if(room.getPlayerNum() == 0){
					//移除
					removeRoomFromRoomList(room,DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_OWNER_OFFLINE);
				}

				return;
			}
		}
	}
	cb('玩家已经不在游戏中，无需处理');
}
exp.onCheckIfRoomTimeOut = function(data,cb){
	for(var i in gRoomList){
		var room = gRoomList[i];
		var now = new Date().getTime();

		var ifShouldRemoveRoom = false;
		var rmType = DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_WAIT_TIMEOUT;

		if(now - room.roomTimestamp > 1000 * 60 * DEF.ROOM.ROOM_MAX_EXIST_TIME){
			//超过最长使用时间，解散房间
			ifShouldRemoveRoom = true;
			rmType = DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_EXIST_TIMEOUT;
		}else{
			//不是系统创建的房间
			if(!room.isAutoCreate && room.state == DEF.ROOM.ROOM_GAME_STATE.ROOM_WAIT){
				if(now - room.roomTimestamp > 1000 * 60 * DEF.ROOM.ROOM_MAX_WAIT_TIME){
					//等待其他玩家，超时解散房间
					ifShouldRemoveRoom = true;
					rmType = DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_WAIT_TIMEOUT;
				}
			}
		}
		if(ifShouldRemoveRoom){
			//解散房间
			room.onRoomRemoved(rmType);
			//移除房间
			removeRoomFromRoomList(room,rmType);
		}
	}
	cb();
}

exp.notifyGameState = function(data,cb){
	var room = gRoomList[data.roomId];
	if(!!room) {
		cb(DEF.RET_SUCCESS);//直接优先响应
		if(room.notifyGameState(data)){
			//结束游戏，删除房间信息
			
			//或者再来一局，重置信息，而不是直接删除
			room.onRoomRemoved(DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_GAMEEND);
			//移除房间
			removeRoomFromRoomList(room,DEF.ROOM.PLAYER_LEAVE_ROOM_TYPE.LEAVE_ROOM_GAMEEND);
		}
		
	}else{
		cb(DEF.RET_ERROR);
	}
}

exp.onPlayerEnter = function(data){
	var room = gRoomList[data.roomId];

	if(!!room) {
		room.onPlayerEnter(data.userID,data.isRelink);
	}else{
		console.error("onPlayerEnter not  exist [roomId :%d,userID:%d ]",data.roomId,data.userID);
	}
}

exp.onReportTalentList = function(data,cb){
	var room = gRoomList[data.roomId];

	if(!!room) {
		room.onReportTalentList(data,cb);
	}else{
		cb({seat:data.seat,talentList:[]});
	}
}

exp.restAllGamingUserRoomId = function(app,data,cb){
	var userIDs = [];
	for(var key in gRoomList){
		var tmpRoom = gRoomList[key];
		var allPlayer = tmpRoom.getAllPlayer();
		for(var i in allPlayer) {
	  		var player = allPlayer[i];
	  		if(player.playerState == DEF.ROOM.STATE_TYPE.STATE_TYPE_PLAYING){
	  			userIDs.push(player.userID);
	  		}
		}
	}
	app.rpc.db.dbRemote.updateUserRoomID('*',userIDs,0,cb);
}

exp.test = function(data,cb){
	console.log('------------------------------无敌分割线--------------------------------');

	console.log('当前房间号为：%d,房间总数为：%d',gRoomID,gRoomCnt);
	for(var i in gRoomList){
		var room = gRoomList[i];
		console.log("房间ID:%d,是否系统创建：%d,时间戳：%d,状态:%d,玩家如下：",room.roomId,room.isAutoCreate,room.roomTimestamp,room.state);
		var all = room.getAllPlayer();
		for(var j in all){
			if(all[j].userID != 0){
				console.log("ID：%d,seat:%d,state:%d", 
					all[j].userID,all[j].seat,all[j].playerState);
			}
		}
	}
	cb();
}
exp.setPlazaConfig =  function(result){
	gPlazaConfig = result;
}
//----------------------私有------------------------------
var checkIfInRoom = function(userID,cb){
	for(var key in gRoomList){
		var room = gRoomList[key];
		var allPlayer = room.getAllPlayer();
		for(var i in allPlayer) {
      		var player = allPlayer[i];
      		if(player.userID == userID){
				cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINGROOM_ALREADY_IN_ROOM,
					{roomId:room.roomId,owner:room.owner,levelId:room.roomLevel,
						rule:room.rule,isRelink:false,plazaid:room.plazaID,roomType:room.roomType,baseScore:room.baseScore});

      			return true;
      		}
		}
	}
	return false;
}
var enterRoom = function (room,user,serverId,isRelink,isRobot,cb) {

	//添加用户
	if(!room.addPlayer(user,serverId,isRobot)){
		//加入房间失败
		cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_FIAL_SYSERR,DEF.ROOM.ROOM_ID_INVLID);
	}else{

		if(isRelink){
			cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINGROOM_ALREADY_IN_ROOM,
				{roomId:room.roomId,owner:room.owner,levelId:room.roomLevel,rule:room.rule,isRelink:isRelink,
					plazaid:room.plazaID,roomType:room.roomType,baseScore:room.baseScore});
		}else{
			cb(DEF.ROOM.JOIN_ROOM_RESULT.JOINROOM_SUCCESS,
				{roomId:room.roomId,owner:room.owner,levelId:room.roomLevel,rule:room.rule,isRelink:isRelink,
					plazaid:room.plazaID,roomType:room.roomType,baseScore:room.baseScore});
		}
	}
}

var createRoom = function(isAutoCreate,roomType,roomData){
	//如果没有找到则创建一个					
	var room = new Room(isAutoCreate,roomType,++gRoomID,roomData);

	//或者也可以发现选择的房号已经被占用的时候，返回创建失败
	if(!!gRoomList[gRoomID]) {
		--gRoomID;
		return null;
	}

	gRoomCnt++;
	gRoomList[gRoomID] = room;

	//如果gRoomID > MAX ,则重新开始 ,在巨大的用户量的时候，可能存在bug
	if(gRoomID >= DEF.ROOM.ROOM_ID_END){
		gRoomID = DEF.ROOM.ROOM_ID_BEGIN;
	}

	return room;
}

//房间状态变化，需要广播给所有在线用户
var onRoomStateChange = function(type,room){

  var result = {type:type,roomId:room.roomId};

  switch(type){
    case DEF.ROOM.ROOMSTATE_CHANGE_TYPE.ROOMSTATE_ADD :
      result['roomName'] = room.roomName;
      result['roomPassword'] = room.roomPassword;
      result['rule'] = room.rule;
      break;
    case DEF.ROOM.ROOMSTATE_CHANGE_TYPE.ROOMSTATE_REMOVE :
      break;
    case DEF.ROOM.ROOMSTATE_CHANGE_TYPE.ROOMSTATE_UPDATE :
      result['personCnt'] = room.getPlayerNum();
      break;
  }
  //向所有人广播房间房间状态变化
  var channelService = pomelo.app.get('channelService');
  channelService.broadcast('connector','room.roomHandler.roomStateChange',result,{binded: true});
}

var removeRoomFromRoomList = function(room,type){
	//房间是否为自建房，是则通知删除
	if(!room.isAutoCreate){
		onRoomStateChange(DEF.ROOM.ROOMSTATE_CHANGE_TYPE.ROOMSTATE_REMOVE,room);
	}

	--gRoomCnt;
	delete gRoomList[room.roomId];
	roomLogger.warn("房间被删除，房间ID:%d,原因值:%d",room.roomId,type);
}

var getPlazaData = function(plazaid){
	for(var i = 0; i < gPlazaConfig.length;i++){
		if(gPlazaConfig[i].plazaid == plazaid){
			return gPlazaConfig[i];
		}
	}
	return null;
}





