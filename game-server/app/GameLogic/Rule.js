//
//游戏规则逻辑
//
var LianQiLogic = require("./LianQiLogic");

var Rule = module.exports;

//确定这个地方能否下子
Rule.getGridValidState = function(board,xx,yy){
    let boardSize = board.boardSize;
    //完全越界的情况
    if ((xx < 0 && xx < -boardSize) ||
        (xx > 0 && xx > boardSize) ||
        (yy < 0 && yy < -boardSize) ||
        (yy > 0 && yy > boardSize))
    {
        return LianQiLogic.eGridValidState.OUTRANGE;
    }
    //两个尖角越界的情况
    if (xx > 0)
    {
        if (yy < xx - boardSize)
        {
            return LianQiLogic.eGridValidState.INVALID;
        }
    }
    else if (xx < 0)
    {
        if (yy > boardSize + xx)
        {
            return LianQiLogic.eGridValidState.INVALID;
        }
    }

    if (board.findChessByPosition(xx, yy) != null)
    {
        return LianQiLogic.eGridValidState.USING;
    }

    return LianQiLogic.eGridValidState.VOID;
}
Rule.washChessBoard = function(lcb ) {
    for(let item of lcb.deads)
    {
        if (item.type == LianQiLogic.eSpecialLinkType.DEAD) {
            let lc = lcb.findChessByIdnum(item.fromIdm);
            if(lc != null){
                let index = lcb.chesses.indexOf(lc);
                if(index != -1){
                    lcb.chesses.splice(index,1);
                }
            }
        }
    }
    Rule.GameBoardCalculateItself(lcb);
    
    return lcb;
}
Rule.getTryResult = function(board,xx,yy,dir,playerId) {
    let gvs = Rule.getGridValidState(board, xx, yy);
    if (gvs != LianQiLogic.eGridValidState.VOID){
        return null;
    }
    let idm = board.addNewChess(xx, yy, dir, playerId);
    if (idm < 0){
        return null;
    }
    Rule.GameBoardCalculateItself(board);
    return board;
}
Rule.tryPlaceChessToGameBoard = function(board,xx,yy,dir,playerId){
    let gvs = Rule.getGridValidState(board, xx, yy);
    if (gvs != LianQiLogic.eGridValidState.VOID){
        return false;
    }

    let ss = board.places.length;
    if (ss > 2) {
        //严重问题！！ 过去存储超过限额！
        //return false;
    }

    if (ss == 1)
    {
        let pm = board.places[0];
        if (pm.placeOwnner == playerId) {
            //该玩家这回合已经下过了！
            return false;
        }
        if (pm.chessDir == dir) {
            //这个方向是禁手方向！
            return false;
        }
    }
    else if (ss == 2) {
        let pm0 = board.places[0];
        let pm1 = board.places[1];
        if (pm1.placeOwnner == playerId) {
            //该玩家这回合已经下过了！
            return false;
        }
        if (pm0.chessDir == dir || pm1.chessDir == dir) {
            //这个方向是禁手方向！
            return false;
        }
    }
    let idm = board.addNewChess(xx, yy, dir, playerId);
    if(idm < 0){
        //此位置存在错误！
        return false;
    }

    Rule.GameBoardCalculateItself(board);

    if (board.findChessByIdnum(idm).health <= 0) {
        //下在此处生命值会不够！
        return false;
    }

    return true;
}

Rule.hasChessThisInList = function(rfs,lc){
    for(r in rfs) {
        if (r.chess == lc) {
            return true;
        }
    }

    return false;
}
Rule.GameBoardCalculateItself = function(lcb){
    let lcs = lcb.chesses;
    //清空buff列表
    for(let l of lcs){
        l.buffers = [];
    }

    let rfs = [];
    for(let l of lcs){
        if (Rule.hasChessThisInList(rfs,l)){
            continue;
        }
        else{
           Rule.checkRing(lcb, l.identityNumber, rfs);
        }
    }
    for(let r of rfs){
        let be  = {
            perfromChess : r.chess.identityNumber,
            acceptChess : r.chess.identityNumber,
            bfType : LianQiLogic.eBufferType.RING,
            healthChange : r.level,
            attackChange : 0,
            absorbChange : 0
        };
        r.chess.buffers.push(be);
    }
    //重新获得buff列表（Basic，Thron，Kiss，Ring）
    for(let l of lcs){
        let hasFront = false;
        let hasBack = false;
        let fc = null;
        let bc = null;
        //获取前方棋子
        let pos = lcb.getPointPos(l.x, l.y, l.dir);
        let bh = 3;
        let gvs = Rule.getGridValidState(lcb, pos[0], pos[1]);

        if (gvs == LianQiLogic.eGridValidState.USING){
            hasFront = true;
            fc = lcb.findChessByPosition(pos[0], pos[1]);
            if ( fc!= null){
                if (fc.ownner != l.ownner){
                    bh--;
                }
            }else{
                //指向的格子上应该有棋子却找不到！！
                return;
            }
        }
        else {
            hasFront = false;
        }
        //获取后方棋子
        let pos2 = lcb.getPointPos(l.x, l.y, (l.dir + 3) % 6);
        gvs = Rule.getGridValidState(lcb, pos2[0], pos2[1]);

        if (gvs == LianQiLogic.eGridValidState.USING){
            hasBack = true;
            bc = lcb.findChessByPosition(pos2[0], pos2[1]);
            if (bc != null){
                if (bc.ownner != l.ownner){
                    bh--;
                }
            }else{
                //指向的格子上应该有棋子却找不到！！
                return;
            }
        }else{
            hasBack = false;
        }

        //增加基础buff
        let be = {
            perfromChess : l.identityNumber,
            acceptChess : l.identityNumber,
            bfType : LianQiLogic.eBufferType.BASIC,
            healthChange : bh,
            attackChange : 1,
            absorbChange : 0
        };
        l.buffers.push(be);
        
        //如果后背的是己方，并且方向和自己正好相反（背对背），增加双三的buff
        if (hasBack && bc.ownner == l.ownner && (l.dir+3)%6 == bc.dir) {
            let be = {
                perfromChess : bc.identityNumber,
                acceptChess : l.identityNumber,
                bfType : LianQiLogic.eBufferType.THRON,
                healthChange : 0,
                attackChange : 3,
                absorbChange : 0
            };
            l.buffers.push(be);
        }
        //如果前面是友方，而且方向正好相对（面对面），加上吸收力增值
        if (hasFront && fc.ownner== l.ownner && (l.dir + 3) % 6 == fc.dir){
            l.buffers.push({
                perfromChess : fc.identityNumber,
                acceptChess : l.identityNumber,
                bfType : LianQiLogic.eBufferType.ABSORBER,
                healthChange : 0,
                attackChange : 0,
                absorbChange : 2
            });
            //如果有吸收，而且后方是敌人，就加一个吸收的debuff
            if (hasBack && bc.ownner != l.ownner){
                bc.buffers.push({
                    perfromChess : l.identityNumber,
                    acceptChess : bc.identityNumber,
                    bfType : LianQiLogic.eBufferType.ABSORBER,
                    healthChange : 0,
                    attackChange : -2,
                    absorbChange : 0
                });
            }
        }
        if (hasFront) {
            if (fc.ownner == l.ownner) {
                fc.buffers.push({
                    perfromChess : l.identityNumber,
                    acceptChess : fc.identityNumber,
                    bfType : LianQiLogic.eBufferType.SUPPORT,
                    healthChange : 0,
                    attackChange : 0,
                    absorbChange : 0
                });
            }
            else
            {
                fc.buffers.push({
                    perfromChess : l.identityNumber,
                    acceptChess : fc.identityNumber,
                    bfType : LianQiLogic.eBufferType.ATTACK,
                    healthChange : 0,
                    attackChange : 0,
                    absorbChange : 0
                });
            }
        }

        let be2 = l.getSuchBuff(LianQiLogic.eBufferType.BASIC);
        if ( be2 != null){
            l.health = be2.healthChange;
            l.absorb = 0;
            l.attack = be2.attackChange;
        }
        else {
            //严重错误，没有基础buff
        }

        be2 = l.getSuchBuff(LianQiLogic.eBufferType.THRON);
        if (be2 != null){
            l.attack = be2.attackChange;
        }

        be2 = l.getSuchBuff(LianQiLogic.eBufferType.ABSORBER);
        if (be2 != null){
            l.absorb = be2.absorbChange;
        }

        be2 = l.getSuchBuff(LianQiLogic.eBufferType.RING);
        if (be2 != null) {
            l.health += be2.healthChange;
        }
        //此处不能更新被吸收的buff,因为这个时候可能没加上
    }
    //减少基本攻击力，最小到0
    for(let l of lcs){
        let be3 = l.getSuchBuff(LianQiLogic.eBufferType.ABSORBEE);
        if (be3 != null) {
            l.attack += be3.attackChange;
            if (l.attack < 0) {
                l.attack = 0;
            }
        }
    }
    //更新互助列表
    for(let l of lcs){
        let bes = l.getSuchBuffAll(LianQiLogic.eBufferType.SUPPORT);
        for(let bfe of bes){
            let nc = lcb.findChessByIdnum(bfe.perfromChess);
            if (nc == null) {
                //重大错误！！ 找不到本能找到的棋子！
                return;
            }
            bfe.attackChange = nc.attack;
            bfe.absorbChange = 0;
            bfe.healthChange = 1;
        }
    }
    //更新攻击列表，直接减少生命
    for(let l of lcs){
        let bes = l.getSuchBuffAll(LianQiLogic.eBufferType.SUPPORT);
        for(let bfe of bes){
            l.attack += bfe.attackChange;
            l.health += bfe.healthChange;
        }
    }

    for(let l of lcs){
        let bes = l.getSuchBuffAll(LianQiLogic.eBufferType.ATTACK);
        for(let bfe of bes){
            let nc = lcb.findChessByIdnum(bfe.perfromChess);
            if (nc == null){
                //重大错误！！ 找不到本能找到的棋子！
                return;
            }
            l.health -= nc.attack;
        }
    }

    lcb.attacks = [];
    lcb.skills = [];
    lcb.deads = [];

    let tscl = [];
    for(let lc of lcb.chesses) {
        if (lc.health <= 0) {
            lcb.deads.push({
                fromIdm : lc.identityNumber,
                toIdm : lc.identityNumber,
                type : LianQiLogic.eSpecialLinkType.DEAD
            });
            let bes = lc.buffers;
            for(let be of bes) {
                if (be.bfType == LianQiLogic.eBufferType.ATTACK) {
                    tscl.push({fromIdm : be.perfromChess,toIdm : be.acceptChess,type : LianQiLogic.eSpecialLinkType.ATTACK});
                }
            }
        }
    }

    for(let scl of tscl) {
        if (lcb.deads.indexOf(scl) == -1) {
            lcb.attacks.push(scl);
        }
    }
}

Rule.checkRing = function(boardRef,idm,rfs) {
    let l  = boardRef.findChessByIdnum(idm);
    if (l == null){
        //严重错误！ 找不到的开始值！
        return;
    }
    let fc = boardRef.findChessInDir(l.x, l.y, l.dir);
    //l指向的不为空，fc是己方
    if (fc != null && fc.ownner == l.ownner){
        Rule.getNextLength(fc, l, boardRef, 0, rfs);
    }
    return;
}
//递归函数
Rule.getNextLength = function(origin,thisC, boardRef,depth, rfs){
    //当递归回到了头的时候-->返回长度
    if (thisC == origin){
        rfs.push({chess : thisC,level : depth + 1});
        return depth+1;
    }

    if (depth > 10) {
        //环过长
        return -1;
    }
    //对于所有五种方向进行判断（除了自己指向的方向）
    for (var i = 0; i < 6; i++){
        if (thisC.dir == i){
            continue;
        }
        //获得现在这个方向的棋子
        let nc  = boardRef.findChessInDir(thisC.x, thisC.y, i);
        if (nc != null && nc.ownner == thisC.ownner){
            //如果非空则找这个棋子指向的对象
            let nc2  = boardRef.findChessInDir(nc.x, nc.y, nc.dir);
            //如果这个棋子指向自己
            if (nc2 == thisC){
                //对这个方向进行搜索
                let result = Rule.getNextLength(origin, nc, boardRef, depth + 1, rfs);
                //递归回来的结果如果是可用的
                if (result > 0){
                    rfs.push({chess : thisC,level : result});
                    return result;
                }
                //否则继续找其他方向
            }
        }
    }
    //如果这里所有方向都不行，则返回不可用的-1
    return -1;
}
Rule.getTryEndBoard = function(chessIdentityNumber ,lcb ){

    let lc = lcb.findChessByIdnum(chessIdentityNumber);
    if(lc == null) return null;
    let pos = lcb.getPointPos(lc.x, lc.y, lc.dir);
    let gvs = Rule.getGridValidState(lcb, pos[0], pos[1]);

    if (gvs != LianQiLogic.eGridValidState.VOID){
        return null;
    }else{
        let lcb2 = lcb.getCopy();
        let lc2 = lcb2.findChessByIdnum(lc.identityNumber);
        if (lc2 == null){
            //严重错误
            return null;
        }
        lc2.x = pos[0];
        lc2.y = pos[1];

        Rule.GameBoardCalculateItself(lcb2);
        return lcb2;
    }
}
Rule.getTryChessesEndBoard = function(chessIdentityNumbers,lcb) {

    let lcb2 = lcb.getCopy();
    for(let co of chessIdentityNumbers) {
        //获取新棋子
        let lc = lcb.findChessByIdnum(co);
        if(lc == null) return null;

        let pos = lcb.getPointPos(lc.x, lc.y, lc.dir);
        let gvs = Rule.getGridValidState(lcb, pos[0], pos[1]);

        if (gvs != LianQiLogic.eGridValidState.VOID){
            return null;
        }else{
            //棋子存在而且位置可用
            let lc2 = lcb2.findChessByIdnum(lc.identityNumber);
            //移动棋子
            if (lc2 == null){
                //不可移动的时候严重错误
                return null;
            }
            lc2.x = pos[0];
            lc2.y = pos[1];
        }
    }
    Rule.GameBoardCalculateItself(lcb2);
    return lcb2;
}

Rule.moveChessInBoard = function(lc ,lcb){
    let pos = lcb.getPointPos(lc.x, lc.y, lc.dir);
    let gvs = Rule.getGridValidState(lcb, pos[0], pos[1]);
    if (gvs != LianQiLogic.eGridValidState.VOID){
        return false;
    }else{
        let lcb2 = lcb.getCopy();
        let lc2 = lcb2.findChessByIdnum(lc.identityNumber);
        if (lc2 == null){
            //严重错误
            return false;
        }
        lc2.x = pos[0];
        lc2.y = pos[1];
        Rule.GameBoardCalculateItself(lcb2);
        if (lc2.health <= 0) {
            return false;
        }
        lc.x = pos[0];
        lc.y = pos[1];
        Rule.GameBoardCalculateItself(lcb);
    }
    return true;
}
Rule.moveChessInBoardUnsafe = function(lc,lcb ){
    let pos = lcb.getPointPos(lc.x, lc.y, lc.dir);
    lc.x = pos[0];
    lc.y = pos[1];
    Rule.GameBoardCalculateItself(lcb);
    return true;
}
Rule.cleanAttacks = function(lcb){
    Rule.washChessBoard(lcb);
    lcb.skills = [];
    lcb.deads = [];
    lcb.attacks = [];
    for(let lc of lcb.chesses) {
        lc.buffers = [];
    }
}
Rule.getUsableDirection = function(lcb) {
   let ud =[];
    for (var i = 0; i < 6; i++){
        ud.push(i);
    }
    for(let item of lcb.places){
        if (item.placeOwnner >= 0) {
            let index = ud.indexOf(item.chessDir);
            if(index != -1){
                ud.splice(index,1);
            }
        }
    }
    return ud;
}