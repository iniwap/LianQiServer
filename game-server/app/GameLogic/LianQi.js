/**
 * Module dependencies
 */
var Rule = require('./Rule');
var LianQiLogic = require('./LianQiLogic');

///////////////////////////////////////////////////////
function LianQi(){
  this.games = {};// roomid : chessbord 字典
  this.ruleJson = {};
}

LianQi.prototype.init = function(){
  this.games = {};
  this.ruleJson = {};
  return [true,""];
}

LianQi.prototype.uninit = function(){
  this.games = {};
  this.ruleJson = {};
  return [true,""];
}

LianQi.prototype.addGame = function(roomId,ruleString){
  this.ruleJson = JSON.parse(ruleString);
  this.games[roomId] = new LianQiLogic.ChessBoard(this.ruleJson.gridlevel);
  return [true,""];
}

LianQi.prototype.removeGame = function(roomId){
  if(this.games[roomId] != undefined && this.games[roomId] != null){
      delete this.games[roomId];
  }
  return [true,""];
}

LianQi.prototype.endGame = function(roomId){
  return getGame(roomId);
}

LianQi.prototype.getGame = function(roomId){
  if(this.games[roomId] != undefined && this.games[roomId] != null){
    return [true,this.games[roomId]];//返回整个棋盘，游戏控制自行解析使用
  }

  return [false,undefined];
}

LianQi.prototype.startGame = function(roomId){
  //do nothing?
  return [true,""];
}

LianQi.prototype.endTurn = function(roomId,playerId){

  if(this.games[roomId] != undefined && this.games[roomId] != null){
    this.games[roomId].endAction(playerId);
    Rule.cleanAttacks(this.games[roomId]);
    return [true,""];
  }
  return [false,""];
}
//[是否成功，是否可以移动，失败原因信息]
LianQi.prototype.placeChess = function(roomId, playerId, x, y, direction){
  if(this.games[roomId] != undefined && this.games[roomId] != null){
    //落子
    let lcb = this.games[roomId].getCopy();
    if (!Rule.tryPlaceChessToGameBoard(lcb,x,y, direction,playerId)){
        return [false,false,"落子失败"];
    }
    this.games[roomId].addNewChess(x,y, direction, playerId);
    Rule.GameBoardCalculateItself(this.games[roomId]);
    return [true,this.games[roomId].deads.Count > 0,""];
  }
  return [false,false,"找不到对局"];
}
//移动[是否成功，是否可以继续移动，失败原因信息，moveList]
LianQi.prototype.chessMove = function(roomId, playerId, moveList){
  //movelist中的playerid必须=playerid
  var moveSuccessList = [];
  if(this.games[roomId] != undefined && this.games[roomId] != null){
    //移动棋子
    if(this.games[roomId].deads.Count > 0){
      Rule.washChessBoard(this.games[roomId]);
      //对movelist列表中的棋子执行移动操作
      for(var i = 0;i < moveList.length;i++){
        if(moveList[i].playerId != playerId) continue;// 过滤非法棋子，即不是自己的错误棋子
        if(Rule.moveChessInBoard(this.games[roomId].findChessByPosition(moveList[i].x,moveList[i].y), this.games[roomId])){
          moveSuccessList.push(moveList[i]);
        }
      }
      if(moveSuccessList.length > 0){
        return [true,this.games[roomId].deads.Count > 0,"",moveSuccessList]
      }
    }
  }
  return [false,false,"非法移动操作"];
}

/**
 * Expose 'LianQi' constructor.
 */
module.exports = LianQi;

