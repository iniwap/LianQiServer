//
//游戏过程管理
//
var UTILS = require('../util/utils');
var DEF = require('../consts/consts');
var LianQi = require('../GameLogic/LianQi')
var lianQi = new LianQi();

var ENDING = 2;

var exp = module.exports;

var gSeatList = {};

/**
 *   GAME:{
    GAME_STEP:{
      GAME_STEP_NONE:0,//空状态
      GAME_STEP_START:1,//对局开始
      GAME_STEP_DICE:2,//掷骰子
      GAME_STEP_PLAY:3,//落子阶段
      GAME_STEP_MOVE_OR_PASS:4,
      GAME_STEP_MOVE:5,//移动阶段 - 实际上没有该阶段，因为可以选择不move
      GAME_STEP_PASS:6,//回合结束阶段
      GAME_STEP_ABANDON:7,//投降阶段
      GAME_STEP_DRAW:8,//请和阶段
      GAME_STEP_END:9//结束
    },
 */
//算法初始化
exp.init = function(cb){
  init(cb);
};
//算法重置
exp.uninit = function(cb){
  uninit(cb);
};


exp.onClockTimeOut = function(app,data,cb){
  // 自动点pass
  cb(DEF.RET_SUCCESS);

  var currentTurn = getGameSeat(data.roomId,data.seat);
  if(getHasAbandon(data.roomId,currentTurn)){
    //已经投降了，拒绝处理落子动作
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }
  
  if(data.step == Number(DEF.GAME.GAME_STEP.GAME_STEP_PASS)){
    doOnPass(app,{seat:data.seat,roomId:data.roomId,userID:data.userID},true,false,function(flag,result){});
  }else{
    // 不支持的定时器
  }
}
// 游戏对局初始化
exp.onStartGame = function(app,data,cb){
  var ret = addGame(data.roomId,data.rule,cb);
  //rpc通知游戏可以开始了，这里不能直接回调给room，会访问不到room本身的数据
  notifyGameState(getRetFlag(ret),DEF.GAME.NOTIFY_GAME_STATE.START,data.roomId,DEF.ROOM.ROOM_INVLID_SEAT,ret,app);
}

exp.onEndGame = function(app,data,cb){
  var ret = endGame(data.roomId,cb);

  var endData = getChessboard(ret[1]);
  //游戏逻辑只返回了棋盘数据
  //结束的数据可能需要添加特殊数据，且只是在room使用处理出需要的数据，并不发给客户端
  notifyGameState(getRetFlag(ret[0]),DEF.GAME.NOTIFY_GAME_STATE.END,data.roomId,gSeatList[data.roomId].seatList,endData,app);

  ////切换到END 此处没有意义
  //changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_END);

  // 清除所有相关数据
  removeGame(data.roomId);
  delete gSeatList[data.roomId];
}

//游戏对局开始
exp.onLianQiStart = function(app,data,cb){
  //禁用方向记录，用于设置禁止方向，以及重连时使用
  var banDirLst = [];
  if(data.isThreeBan){
    banDirLst = [DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE,
                            DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE,
                            DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE];
  }else{
    banDirLst = [DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE,
                          DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE];
  }

  //更细节的游戏步骤需要设置，目前直接跳到可以落子阶段。
  gSeatList[data.roomId] = {currentSeat:data.seatList[0].seat,
                            step:DEF.GAME.GAME_STEP.GAME_STEP_PLAY,
                            rule:data.rule,
                            seatList:data.seatList,
                            hasAbandonList:[0,0,0,0],
                            banDirList:banDirLst};


  // 设置所有玩家的天赋配置列表
  // data.seatList.talentList

  startGame(data.roomId,cb);

  console.log("联棋游戏，开始对局:",gSeatList);
}

exp.onRelink = function(app,data,cb){

  var currentGame = gSeatList[data.roomId];

  if(!!!currentGame){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.NOT_IN_GAME});
    console.error("游戏已经不存在，无法完成重连，roomId:%d",data.roomId);
    return;
  }

  var ret = getGame(data.roomId,cb);

  var gameData = getChessboard(ret[1]);

  notifyRelinkGameState(getRetFlag(ret[0]),
    DEF.GAME.NOTIFY_GAME_STATE.RELINK,
    data.roomId,
    currentGame.currentSeat,
    data.userID,
    gameData,
    app);
}

exp.onPlay = function(app,data,cb){
  if(!!!checkIfInGame(data,cb))return;
  if(gSeatList[data.roomId].step !== DEF.GAME.GAME_STEP.GAME_STEP_PLAY){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }


  var currentTurn = getGameSeat(data.roomId,data.seat);
  if(getHasAbandon(data.roomId,currentTurn)){
    //已经投降了，拒绝处理落子动作
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }

  //判断是否为禁手方向
  for(var dir = 0;dir < gSeatList[data.roomId].banDirList.length;dir++){
    if(gSeatList[data.roomId].banDirList[dir] == data.direction){
      cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.ILLEGAL});
      return;
    }
  }
  var ret = doPlayOrMove(DEF.GAME.NOTIFY_GAME_STATE.PLAY,data,cb,app);
  if(ret[0]){
    //更新禁手方向记录
    if(gSeatList[data.roomId].banDirList[0] == DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE){
      gSeatList[data.roomId].banDirList[0] = data.direction;
    }else if(gSeatList[data.roomId].banDirList[1] == DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE){
      gSeatList[data.roomId].banDirList[1] = data.direction;
    }else{
      if(gSeatList[data.roomId].banDirList.length == 3){
        if(gSeatList[data.roomId].banDirList[2] == DEF.GAME.GAME_DIRECT_TYPE.LIANQI_DIRECTION_TYPE_NONE){
          gSeatList[data.roomId].banDirList[2] = data.direction;
        }else{
          gSeatList[data.roomId].banDirList[0] = gSeatList[data.roomId].banDirList[1];
          gSeatList[data.roomId].banDirList[1] = gSeatList[data.roomId].banDirList[2];
          gSeatList[data.roomId].banDirList[2] = data.direction;
        }
      }else{
        gSeatList[data.roomId].banDirList[0] = gSeatList[data.roomId].banDirList[1];
        gSeatList[data.roomId].banDirList[1] = data.direction;
      }
    }

    if(ret[1]){
      changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_MOVE_OR_PASS);//有可以移动的棋子，进入move-pass阶段
    }else{
      changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_PASS);//没有可以移动棋子，进入pass阶段
    }
  }
}
exp.onPass = function(app,data,cb){

  var currentTurn = getGameSeat(data.roomId,data.seat);
  if(getHasAbandon(data.roomId,currentTurn)){
    //已经投降了，拒绝处理落子动作
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }

  doOnPass(app,data,false,false,cb);
}

//投降触发的换手
exp.onAbandonPass = function(app,data,cb){
  doOnPass(app,data,false,true,cb);
}

exp.onDraw = function(app,data,cb){

  var currentTurn = getGameSeat(data.roomId,data.seat);
  if(getHasAbandon(data.roomId,currentTurn)){
    //已经投降了，拒绝处理落子动作
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }

  //请求和棋，不需要数据
 if(!!!checkIfInGame(data,cb))return;

  notifyGameState(DEF.RET_SUCCESS,DEF.GAME.NOTIFY_GAME_STATE.DRAW,data.roomId,data.seat,{},app);

  //切换到DRAW
 // changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_DRAW);
}
exp.onMove = function(app,data,cb){
  if(!!!checkIfInGame(data,cb))return;

  if(gSeatList[data.roomId].step !== DEF.GAME.GAME_STEP.GAME_STEP_MOVE_OR_PASS){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }

  var currentTurn = getGameSeat(data.roomId,data.seat);
  if(getHasAbandon(data.roomId,currentTurn)){
    //已经投降了，拒绝处理落子动作
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }

  var ret = doPlayOrMove(DEF.GAME.NOTIFY_GAME_STATE.MOVE,data,cb,app)
  if(ret[0]){
    if(ret[1]){
      changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_MOVE_OR_PASS);//仍有可以移动的棋子，进入move-pass阶段
    }else{
      changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_PASS);//没有可以移动棋子，进入pass阶段
    }
  }
}

// 投降
exp.onAbandon = function(app,data,cb){
  if(!!!checkIfInGame(data,cb))return;
  //ABANDON
  var currentTurn = getGameSeat(data.roomId,data.seat);
  
  if(currentTurn == DEF.ROOM.ROOM_INVLID_SEAT){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.SEAT_ERR});
    return;
  }

  if(getHasAbandon(data.roomId,currentTurn)){
    //已经投降了，拒绝处理落子动作
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_STEP});
    return;
  }

  //此处不用游戏逻辑实现，直接强行结束
  cb(DEF.RET_SUCCESS,{flag:DEF.GAME.GAME_OP_RESP_FLAG.SUCCESS,seat:data.seat});

  //var ret = abandon(data.roomId,currentTurn);
  notifyGameState(DEF.RET_SUCCESS,DEF.GAME.NOTIFY_GAME_STATE.ABANDON,data.roomId,data.seat,{seat:data.seat},app);

  //切换到play
 // changeGameStep(data.roomId,DEF.GAME.GAME_STEP.ABANDON);
  //需要room方便控制结束对局，为了更多动画效果呈现
  
  //将此用户标记为已投降，拒绝处理其相关请求
  gSeatList[data.roomId].hasAbandonList[currentTurn] = 1;

}


//---------------------------------内部使用--------------------------
//
//
var doOnPass = function(app,data,timeOut,isAbandon,cb){
  if(!!!checkIfInGame(data,cb))return;

  ///是否合法
  var currentTurn = checkIfIllegal(data.roomId,data.seat,cb);
  if(currentTurn == DEF.ROOM.ROOM_INVLID_SEAT) return ;
  //结束当前轮
  endTurn(data.roomId,currentTurn);
  //将落子方切换到下一个
  nextSeat = changeTurn(data.roomId);

  cb(DEF.RET_SUCCESS,{flag:0,turn:nextSeat});//简单响应

  var lmtDir = gSeatList[data.roomId].banDirList;

  //此时应该发要出子的人的seat，pass就是turn
  notifyGameState(DEF.RET_SUCCESS,DEF.GAME.NOTIFY_GAME_STATE.PASS,
    data.roomId,
    data.seat,
    {seat:nextSeat,lmt:lmtDir,isPassTurn:1,isAbandon:isAbandon,isTimeOut:timeOut?1:0},
    app);

  //设置游戏步骤到play
  changeGameStep(data.roomId,DEF.GAME.GAME_STEP.GAME_STEP_PLAY);

  //此时判断是否已经下满棋盘，下满则结束游戏，该判断只需要正常的pass
  
  if(!timeOut && !isAbandon){
    var ret = getGame(data.roomId,function(){});
    if(ret[0]){
      var ruleJson = JSON.parse(gSeatList[data.roomId].rule);
      var tcnt = 37;
      if(Number(ruleJson.gridLevel) == 6){
        tcnt = 91;
      }

      if(ret[1].chesses.length >= tcnt){
        this.onEndGame(app,{roomId:data.roomId},function(flag){});
      }
    }
  }
}

var changeGameStep = function(roomId,step){

  if(!!!gSeatList[roomId]){
    //原则上不存在这种情况
    return;
  }
  gSeatList[roomId].step = step;

}

var checkIfInGame = function(data,cb){
  var currentGame = gSeatList[data.roomId];

  if(!!!currentGame){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.NOT_IN_GAME});
    console.error("不在游戏中，拒绝处理消息，roomId:%d",data.roomId);
    return false;
  }
  //seat 和userID 是否一致，不一致为非法操作
  
  for(var i in currentGame.seatList){
    if(currentGame.seatList[i].seat == data.seat){
      if(currentGame.seatList[i].userID != data.userID){
        console.error("非法操作，有越过客户端发消息的嫌疑,roomId:%d,userID:%d,seat:%d",data.roomId,data.userID,data.seat);
        cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.ILLEGAL});
        return false;
      }
    }
  }

  return true;
}

var getHasAbandon = function(roomId,currentTurn){
  return gSeatList[roomId].hasAbandonList[currentTurn] == 1;
}

var getRetFlag = function(ret){

  if(ret){
    return DEF.RET_SUCCESS;
  }

  return DEF.RET_ERROR;
}

var getGameSeat = function(roomId,seat){
  var currentGame = gSeatList[roomId];
  var currentTurn = DEF.ROOM.ROOM_INVLID_SEAT;

  if(!!!currentGame){
    console.error("获取游戏座位号失败，roomId:%d,seat:%d",roomId,seat);
    return currentTurn;
  }
  
  for(var i in currentGame.seatList){
    if(currentGame.seatList[i].seat == seat){
      currentTurn = i;
      break;
    }
  }
  
  return currentTurn;
}

var doPlayOrMove = function(type,data,cb,app){

  ///是否合法
  var currentTurn = checkIfIllegal(data.roomId,data.seat,cb);

  if(currentTurn == DEF.ROOM.ROOM_INVLID_SEAT) return false;

  var ret;
  if(type == DEF.GAME.NOTIFY_GAME_STATE.PLAY){
    ret = placeChess(data.roomId,currentTurn,data.x,data.y,data.direction,cb);
  }else{
    ret = chessMove(data.roomId,currentTurn,data.moveList,cb);//移动的话是一个可移动的棋子列表
  }

  if(ret[0]){
    var ndata = {};
    //只发送当前落子，不再发送整个棋盘信息，没有意义
    if(type == DEF.GAME.NOTIFY_GAME_STATE.PLAY){
        ndata = {flag:DEF.GAME.GAME_OP_RESP_FLAG.SUCCESS,
                  seat:data.seat,
                  x:data.x,
                  y:data.y,
                  direction:data.direction};
    }else{
        ndata = {flag:DEF.GAME.GAME_OP_RESP_FLAG.SUCCESS,
            seat:data.seat,
            moveList : ret[3]};//注意这里可能不完全和发上来的movelist一致，所以这里采用游戏逻辑返回的
    }

    // 响应自己落子
    cb(DEF.RET_SUCCESS,ndata);
    //向其他玩家发送落子结果
    notifyGameState(DEF.RET_SUCCESS,type,data.roomId,data.seat,ndata,app);
    
  }

  return ret;
}

var checkIfIllegal = function(roomId,seat,cb){
  //错误的落子方
  var currentGame = gSeatList[roomId];
  var currentTurn = DEF.ROOM.ROOM_INVLID_SEAT;

  if(!!!currentGame){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.SEAT_ERR});
    console.error("联棋游戏，找不到对应的座位列表,seat:%d,roomId:%d",seat,roomId);
    return currentTurn;
  }

  if(currentGame.currentSeat != seat){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.INCORRECT_TURN});
    return currentTurn;
  }else{
    for(var i in currentGame.seatList){
      if(currentGame.seatList[i].seat == seat){
        currentTurn = i;
        break;
      }
    }
    
    if(currentTurn == DEF.ROOM.ROOM_INVLID_SEAT){
      cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.SEAT_ERR});
      console.error("联棋游戏，找不到对应的座位,seat:%d,roomId:%d",seat,roomId,currentGame);
      return currentTurn;
    }
  }
  return currentTurn;
}

//切换落子方
var changeTurn = function(roomId){
    //将落子方移动下一个
  var currentGame = gSeatList[roomId];
  console.log("切换玩家，当前执子方：",currentGame.currentSeat);
  currentGame.currentSeat = (Number(currentGame.currentSeat) + 1)%currentGame.seatList.length;
  console.log("切换玩家，切换后执子方：",currentGame.currentSeat);

  return currentGame.currentSeat;
}

var getChessboard = function(data){

  if(data === DEF.RET_ERROR) return {};
  
  var chessArray = [];
  
  //只取棋子的核心数据信息，对于需要细节的，请新增别的接口访问
  for(var i in data.chesses){
    var chess = {};
    chess['direction'] = data[i].direction;
    chess['playerID'] = data[i].playerID;
    chess['x'] = data[i].x;
    chess['y'] = data[i].y;

    chessArray.push(chess);
  }

  return chessArray;
}
var notifyGameState = function(flag,type,roomId,seat,data,app) {
    app.rpc.room.roomRemote.notifyGameState('*',
      {flag:flag,type:type,roomId:roomId,seat:seat,data:data},
      (flag)=>console.log("notifyGameState %d,ret:%d",type,flag));
}
var notifyRelinkGameState = function(flag,type,roomId,seat,userID,data,app) {
    app.rpc.room.roomRemote.notifyGameState('*',
      {flag:flag,type:type,roomId:roomId,seat:seat,userID:userID,data:data,banDirList:gSeatList[roomId].banDirList},
      (flag)=>console.log("notifyGameState %d,ret:%d",type,flag));
}

//---------------------------算法私有接口----------------------
/*ruleString
{
  "playerNum": 2,
  "gridlevel": 4,
  "rule": "default",
  //--! in the future 
  "gameTime": "360"
  ...
}
 */
var init = function(cb){
  var ret = lianQi.init();

  if(ret[0]){
    cb(DEF.RET_SUCCESS);
    return DEF.RET_SUCCESS;
  }else{
    cb(DEF.RET_ERROR);
    return DEF.RET_ERROR;
  }
}

var uninit = function(cb){
  var ret = lianQi.uninit();

  if(ret[0]){
    cb(DEF.RET_SUCCESS);
    return DEF.RET_SUCCESS;
  }else{
    cb(DEF.RET_ERROR);
    return DEF.RET_ERROR;
  }
}

//添加对局
var addGame = function(roomId,ruleString,cb){

  var ret = lianQi.addGame(roomId,ruleString);

  if(ret[0]){
    cb(DEF.RET_SUCCESS);
    return true;
  }else{
    cb(DEF.RET_ERROR);
    return false;
    //removeGame(data.roomId);似乎没有必要？？
  }
};
//移除对局 - 游戏结束移除
var removeGame = function(roomId){
  return lianQi.removeGame(roomId);
};

var endGame = function(roomId,cb){
  var ret = lianQi.endGame(roomId);
  if(ret[0]){
    cb(DEF.RET_SUCCESS);
    return ret;
  }else{
    console.error("对局结算失败，严重错误！！！");
    cb(DEF.RET_ERROR)
    return DEF.RET_ERROR;
  }
};

var getGame = function(roomId,cb){
  var ret = lianQi.getGame(roomId);
  if(ret[0]){
    cb(DEF.RET_SUCCESS);
    return ret;
  }else{
    cb(DEF.RET_ERROR)
    return DEF.RET_ERROR;
  }
};

//开始游戏
var startGame = function(roomId,cb){
  var ret = lianQi.startGame(roomId);
  if(ret[0]){
    cb(DEF.RET_SUCCESS);
    return DEF.RET_SUCCESS;
  }else{
    cb(DEF.RET_ERROR);
    return DEF.RET_ERROR;
  }
};

//结束执子
var endTurn = function(roomId,playerId,cb){
  return lianQi.endTurn(roomId,playerId);
};

//落子[是否成功，是否可以移动，失败原因信息]
var placeChess = function(roomId, playerId, x, y, direction,cb){

  var ret =  lianQi.placeChess(roomId, playerId, x, y, direction);

  if(!ret[0]){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.ILLEGAL});
  }

  return ret;
};

//移动[是否成功，是否可以继续移动，失败原因信息，moveList]
var chessMove = function(roomId, playerId, moveList,cb){
  var ret = lianQi.chessMove(roomId, playerId,moveList);
  if(!ret[0]){
    cb(DEF.RET_ERROR,{flag:DEF.GAME.GAME_OP_RESP_FLAG.ILLEGAL});
  }

  return ret;
};
