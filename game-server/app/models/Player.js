var DEF = require('../consts/consts');
var utils = require('../util/utils');


function Player(MAX_PLAYER_NUM) {
  this.playerDataArray = new Array(MAX_PLAYER_NUM);
  this.playerNum = 0;
  this.timerList = [];

  //初始化用户数据
  for(var i = 0; i < this.playerDataArray.length; ++i) {
    this.playerDataArray[i] = {seat: Number(DEF.ROOM.ROOM_INVLID_SEAT),isRobot:false,userID:0,
      playerState:DEF.ROOM.STATE_TYPE.STATE_TYPE_NONE,userData:{},talentList:[]};
  }
}

Player.prototype.getAllPlayer = function(){
  return this.playerDataArray;
}

Player.prototype.getPlayerByUserID = function(userID){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == userID) {
      return this.playerDataArray[i];
    }
  }
  return {};
}

Player.prototype.getPlayerBySeat = function(seat){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].seat == seat) {
      return this.playerDataArray[i];
    }
  }
  return {};
}
Player.prototype.getPlayerSeatByUserID = function(userID){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == userID) {
      return this.playerDataArray[i].seat;
    }
  }
  return Number(DEF.ROOM.ROOM_INVLID_SEAT);
}

Player.prototype.getPlayerUserIDBySeat = function(seat){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].seat == seat) {
      return this.playerDataArray[i].userID;
    }
  }
  return 0;
}

Player.prototype.addPlayer = function(data,isRobot) {
  var inRoomSeat = this.isPlayerInRoom(data.id);
  if(inRoomSeat != DEF.ROOM.ROOM_INVLID_SEAT){
    //fuck here??
    //更新下用户数据
    this.playerDataArray[inRoomSeat].userData = data;
    this.playerDataArray[inRoomSeat].isRobot = isRobot;
    return true;
  }

  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == 0) {

      this.playerDataArray[i] = {seat: Number(i),isRobot: isRobot,
          userID:data.id,playerState:DEF.ROOM.STATE_TYPE.STATE_TYPE_SITDOWN,userData:data};

      if(this.playerNum < this.playerDataArray.length) {//此处并无必要
        this.playerNum ++;
      }

      return true;
    }
  }
  return false;
};

// player num in the room
Player.prototype.getPlayerNum = function() {
  return this.playerNum;
};

// are there MAX_MEMBER_NUM members in the room
Player.prototype.isRoomFull = function() {
  return this.getPlayerNum() >= this.playerDataArray.length;
};

Player.prototype.kick = function(userID) {

  for(var i in this.playerDataArray) {
    var o = this.playerDataArray[i];
    if(o.userID != 0 && o.userID == userID) {

      this.playerDataArray[i] = {seat: Number(DEF.ROOM.ROOM_INVLID_SEAT),isRobot:false,userID:0,
          playerState:DEF.ROOM.STATE_TYPE.STATE_TYPE_NONE,userData:{},talentList:[]};

      this.playerNum = Math.max(this.playerNum - 1, 0);
      return true;
    }
  }
};

Player.prototype.isPlayerInRoom = function(userID) {
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID != 0 
        && this.playerDataArray[i].userID == userID) {
        return i;
    }
  }
  return DEF.ROOM.ROOM_INVLID_SEAT;
};

Player.prototype.updatePlayerState = function(userID,state){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == userID) {
      this.playerDataArray[i].playerState = state;
    }
  }
}
Player.prototype.getAllPlayerReady = function(){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].playerState != DEF.ROOM.STATE_TYPE.STATE_TYPE_ROOMREADY) {
      return false;
    }
  }
  return true;
}

Player.prototype.updatePlayerStateBySeat = function(seat,state){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].seat == seat) {
      this.playerDataArray[i].playerState = state;
      break;
    }
  }
}
Player.prototype.updatePlayerStateByUserID = function(userID,state){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == userID) {
      this.playerDataArray[i].playerState = state;
      break;
    }
  }
}
Player.prototype.getPlayerStateBySeat = function(seat){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].seat == seat) {
      return this.playerDataArray[i].playerState;
    }
  }
  return DEF.ROOM.STATE_TYPE.STATE_TYPE_NONE;
}

Player.prototype.getPlayerIsPlayingByUserID = function(userID){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == userID
      && this.playerDataArray[i].playerState == DEF.ROOM.STATE_TYPE.STATE_TYPE_PLAYING) {
        return true;
    }
  }
  return false;
}

Player.prototype.getPlayerIsPlayingBySeat = function(seat){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].seat == seat
      && this.playerDataArray[i].playerState == DEF.ROOM.STATE_TYPE.STATE_TYPE_PLAYING) {
        return true;
    }
  }
  return false;
}


Player.prototype.getPlayerIsOfflineBySeat = function(seat){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].seat == seat
      && this.playerDataArray[i].playerState == DEF.ROOM.STATE_TYPE.STATE_TYPE_OFFLINE) {
        return true;
    }
  }
  return false;
}
Player.prototype.getPlayerIsOfflineByUserID = function(userID){
  for(var i in this.playerDataArray) {
    if(this.playerDataArray[i].userID == userID
      && this.playerDataArray[i].playerState == DEF.ROOM.STATE_TYPE.STATE_TYPE_OFFLINE) {
        return true;
    }
  }
  return false;
}

Player.prototype.playerLeave = function(userID){
  var leaveSeat = Number(DEF.ROOM.ROOM_INVLID_SEAT);
  for(var i in this.playerDataArray) {
    var o = this.playerDataArray[i];
    if(o.userID != 0 && o.userID == userID) {
      leaveSeat = o.seat;
      this.playerDataArray[i] = {seat: Number(DEF.ROOM.ROOM_INVLID_SEAT),isRobot:false,userID:0,
        playerState:DEF.ROOM.STATE_TYPE.STATE_TYPE_NONE,userData:{},talentList:[]};

      this.playerNum = Math.max(this.playerNum - 1, 0);
      break;
    }
  }
  return leaveSeat;
}
/**
 * Expose 'playerManager' constructor.
 */
module.exports = Player;

