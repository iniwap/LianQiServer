//
//联棋游戏逻辑
//

var Rule = require('./Rule');

var LianQiLogic = module.exports;

LianQiLogic.eGridValidState = {
    VOID : 0,
    USING : 1,
    INVALID : 2,
    OUTRANGE : 3,
};
LianQiLogic.eBufferType = {
    BASIC : 0,
    SUPPORT : 1,
    ATTACK : 2,
    THRON : 3,
    RING : 4,
    ABSORBER : 5,
    ABSORBEE : 6,
};

LianQiLogic.Chess = class
{
    constructor(xx,yy,dd,oo,idnum) {
        this.x = xx;
        this.y = yy;
        this.dir = dd;
        this.ownner = oo;
        this.health = 0;
        this.attack = 0;
        this.absorb = 0;
        this.buffers = [];
        this.identityNumber = idnum;
    }
    //通过坐标比较是否是同一个棋子
    isPosEqual(xx,yy){
        if (this.x == xx && this.y == yy) {
            return true;
        }
        return false;
    }
    isIDEqual(nid){
        return nid == this.identityNumber;
    }
    getSuchBuff(bt){
        for (var i = 0;i <this.buffers.length;i++) {
            if (this.buffers[i].bfType == bt) {
                return this.buffers[i];
            }
        }
        return null;
    }
    getSuchBuffAll(bt){
        let bes = [];
        for (var i = 0;i < this.buffers.length;i++) {
            if (this.buffers[i].bfType == bt) {
                bes.push(this.buffers[i]);
            }
        }
        return bes;
    }
    hasSuchBuff(bt){
        for (var i = 0;i < this.buffers.length;i++) {
            if (this.buffers[i].bfType == bt) {
                return true;
            }
        }
        return false;
    }
    getCopy(){
        let lc = new LianQiLogic.Chess(this.x,this.y,this.dir,this.ownner,this.identityNumber);
        lc.health = this.health;
        lc.absorb = this.absorb;
        lc.attack = this.attack;
        for(let be of this.buffers) {
            lc.buffers.push({
                perfromChess : be.perfromChess,
                acceptChess : be.acceptChess,
                bfType : be.bfType,
                healthChange : be.healthChange,
                attackChange : be.attackChange,
                absorbChange : be.absorbChange
            });
        }

        return lc;
    }
}
LianQiLogic.eChessBoardState = {
    HEALTH : 0,
    POSITION_MIXED : 1,
    ID_MIXED : 2,
}

LianQiLogic.eSpecialLinkType = {
    DEAD : 0,
    ATTACK : 1,
    SKILL : 2,
}

LianQiLogic.ChessBoard = class
{
    constructor(level) {
        this.boardSize = level;
        this.chesses = [];
        this.places = [];
        this.deads = [];
        this.attacks = [];
        this.skills = [];
        this.identityNumberNow = 0;
        this.roundNum = 0;
    }

    //根据位置找棋子
    findChessByPosition(xx,yy){
        for (var i = 0; i < this.chesses.length;i++){
            if (this.chesses[i].isPosEqual(xx, yy)){
                return this.chesses[i];
            }
        }
        return null;
    }

    getPointX(x,dir){
        switch (dir){
            case 0: return x - 1;
            case 1: return x;
            case 2: return x + 1;
            case 3: return x + 1;
            case 4: return x;
            case 5: return x - 1;
            default:
                break;
        }
        return -1;
    }

    getPointY(y ,dir){
        switch (dir){
            case 0: return y;
            case 1: return y + 1;
            case 2: return y + 1;
            case 3: return y;
            case 4: return y - 1;
            case 5: return y - 1;
            default:
                break;
        }
        return -1;
    }

    getPointPos(xx,yy,dir){
        let re = [0,0];
        re[0] = this.getPointX(xx, dir);
        re[1] = this.getPointY(yy, dir);
        return re;
    }

    findChessInDir(xx,yy,dir){
        let fx = 0, fy = 0;
        fx = this.getPointX(xx, dir);
        fy = this.getPointY(yy, dir);

        for(let lc of this.chesses){
            if (lc.isPosEqual(fx, fy)){
                return lc;
            }
        }
        return null;
    }

    //根据ID找棋子
    findChessByIdnum(idn) {
        for(let lc of this.chesses){
            if (lc.isIDEqual(idn)){
                return lc;
            }
        }
        return null;
    }

    checkChessBoardState(){
        let cbsi = {
            state : LianQiLogic.eChessBoardState.HEALTH,
            info : ""
        };
        for (var i = 0; i < this.chesses.length; i++)
        {
            for (var j = i+1; j < this.chesses.length; j++)
            {
                if (this.chesses[i].isIDEqual(this.chesses[j].identityNumber))
                {
                    cbsi.state = LianQiLogic.eChessBoardState.ID_MIXED;
                    cbsi.info = i + "、"+ j +"棋子ID" + this.chesses[i].identityNumber+ "重复！";
                    return cbsi;
                }
                if (this.chesses[i].isPosEqual(this.chesses[j].x,this.chesses[j].y))
                {
                    cbsi.state = LianQiLogic.eChessBoardState.ID_MIXED;
                    cbsi.info = i + "、"+ j +"棋子位置" + this.chesses[i].x +"/"+ this.chesses[i].y+ "重合!";
                    return cbsi;
                }
            }
        }
        cbsi.state = LianQiLogic.eChessBoardState.HEALTH;
        cbsi.info = "棋子全部正常!";
        return cbsi;
    }

    makeNewChess(xx,yy,dir,ownner){
        let nlc = new LianQiLogic.Chess(xx, yy, dir, ownner, this.identityNumberNow);
        this.chesses.push(nlc);
        this.identityNumberNow++;
        return this.identityNumberNow - 1;
    }

    addForbiddenDir(dir,ownner){
        let dirs = Rule.getUsableDirection(this);
        let pm = {
            placeOwnner : ownner,
            chessID : this.identityNumberNow,
            chessDir : dir
        };
        this.places.push(pm);
        if (this.places.length > 2)
        {
            this.places.splice(0,1);
        }
    }

    addNewChessUnSafe(xx,yy,dir,ownner){
        let nlc = new LianQiLogic.Chess(xx, yy, dir, ownner, this.identityNumberNow);
        this.chesses.push(nlc);
        let pm = {
            placeOwnner : ownner,
            chessID : this.identityNumberNow,
            chessDir : dir
        };
        this.places.push(pm);
        if (this.places.length > 2)
        {
            this.places.splice(0,1);
        }
        this.identityNumberNow++;
        return this.identityNumberNow - 1;
    }

    addNewChess(xx,yy,dir,ownner){
        let nlc = new LianQiLogic.Chess(xx, yy, dir, ownner, this.identityNumberNow);
        this.chesses.push(nlc);

        let cbsi = this.checkChessBoardState();

        if (cbsi.state != LianQiLogic.eChessBoardState.HEALTH) {
            this.chesses.splice(this.chesses.indexOf(nlc),1);
            return -1;
        }

        let dirs = Rule.getUsableDirection(this);
        if (dirs.indexOf(dir) == -1) {
            this.chesses.splice(this.chesses.indexOf(nlc),1);
            return -2;
        }

        let pm = {
            placeOwnner : ownner,
            chessID : this.identityNumberNow,
            chessDir : dir
        };
        this.places.push(pm);
        if (this.places.length > 2)
        {
            this.places.splice(0,1);
        }

        this.identityNumberNow++;
        return this.identityNumberNow - 1;
    }

    endAction(np){
        let ss = this.places.length;
        let pm = {
            placeOwnner : -1,
            chessID : -1,
            chessDir : -1
        };
        if (ss == 0) {
            this.places.push(pm);
        }
        else if (ss == 1 && np != this.places[0].placeOwnner) {
            this.places.push(pm);
        }
        else if (ss == 2 && np != this.places[1].placeOwnner) {
            this.places.push(pm);
            this.places.splice(0,1);
        }
        this.roundNum++;
    }
    getCopy(){
        let lcb = new LianQiLogic.ChessBoard(this.boardSize);
        lcb.identityNumberNow = this.identityNumberNow;
        for(let lc of this.chesses) {
            lcb.chesses.push(lc.getCopy());
        }
        for(let pm of this.places) {
            lcb.places.push({placeOwnner : pm.placeOwnner,chessID : pm.chessID,chessDir : pm.chessDir});
        }

        for(let sc of this.deads) {
            lcb.deads.push({fromIdm : sc.fromIdm,toIdm : sc.toIdm,type : sc.type});
        }
        for(let sc of this.attacks){
            lcb.attacks.push({fromIdm : sc.fromIdm,toIdm : sc.toIdm,type : sc.type});
        }
        for(let sc of this.skills){
            lcb.skills.push({fromIdm : sc.fromIdm,toIdm : sc.toIdm,type : sc.type});
        }
        lcb.roundNum = this.roundNum;

        return lcb;
    }
}
