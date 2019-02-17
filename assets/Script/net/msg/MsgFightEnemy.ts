import MessageBase from "./MessageBase";
import MsgLogin, { SResInfo, SUserInfo, SBattleInfo, SFightRecord } from "./MsgLogin";
import MsgCardSummon, { SCardInfo, CardSummonType } from "./MsgCardSummon";
import NetConst from "../NetConst";
import { COMMON } from "../../CommonData";
import { Battle } from "../../module/battle/BattleAssist";
import MsgCardSummonGuide from "./MsgCardSummonGuide";

//战斗会保存战斗纪录，并且推送给对应的敌人，为了数据库性能，建议一个玩家最多保存30条纪录
export class CSFightEnemy{
    //敌人uid，可能为空，为空不抢卡，不推送结果
    public enemyUid:string ="";
    //敌人名字
    public enemyName:string ="";
    //战斗结束增加经验，前端算好
    public addExp:number = 0;
    //战斗结束增加钻石，前段算好
    public addDiamond:number = 0;
    //增加的积分，前端算好，自己增加，敌人减少（小于0取0）
    public addScore:number = 0;
    //消耗行动力，减少行动力，可能为0，复仇不消耗行动力
    public costActionPoint:number = 0;
    //是否复仇，设置复仇开始时间
    public isRevenge:boolean = false;
    //是否抢卡
    public isRabCard:boolean = false;
    //抢卡时的概率，概率跟抽卡概率格式一样，前端给，如，1;66|2;24|3;8|4;2|5;0.4，抢卡时更改卡牌的归属，等级重置为1级
    public rabCardRate:string = "";
    //是否引导中，引导中固定获得一张3星卡牌，敌人不是玩家，所有不抢卡，相当于抽卡
    public isGuide:boolean = false;
}
//战斗结束返回增加的经验，资源，战场信息，获得卡牌（如果有）
export class SCFightEnemy{
    //敌人uid，取参数的
    public enemyUid:string ="";
    //战斗完成增加的经验
    public addExp:number = 0;
    //战斗完成后的res信息
    public resInfo:SResInfo;
    //战斗完成后的等级经验信息
    public userInfo:SUserInfo;
    //战斗完成后的战场信息（行动力，行动力开始时间或者复仇开始时间），积分
    public battleInfo:SBattleInfo;
    //获得的卡牌,如果有的话，没有为null
    public addCard:SCardInfo = null;

    public static parse(obj:any):SCFightEnemy{
        var info:SCFightEnemy = new SCFightEnemy();
        info.enemyUid = obj.enemyUid;
        info.addExp =obj.addExp;
        info.resInfo = SResInfo.parse(obj.resInfo);
        info.userInfo = SUserInfo.parse(obj.userInfo);
        info.battleInfo = SBattleInfo.parse(obj.battleInfo);
        if(obj.addCard!=undefined && obj.addCard!=null){
            info.addCard = SCardInfo.parse(obj.addCard);
        }
        return info;
    }
}

//攻击敌人
export default class MsgFightEnemy extends MessageBase{
    public param:CSFightEnemy;
    public resp:SCFightEnemy;

    constructor(){
        super(NetConst.FightEnemy);
        this.isLocal = true;
    }

    //攻击敌人
    public static create(uid:string,uname:string
        ,addExp:number,addDiamond:number,addScore:number
        ,costActionPoint:number,isRevenge:boolean,isRabCard:boolean,rate:string,isGuide:boolean){
        var msg = new MsgFightEnemy();
        msg.param = new CSFightEnemy();
        msg.param.enemyUid = uid;
        msg.param.enemyName = uname;
        msg.param.addExp = addExp;
        msg.param.addDiamond = addDiamond;
        msg.param.addScore = addScore;
        msg.param.costActionPoint = costActionPoint;
        msg.param.isRevenge = isRevenge;
        msg.param.isRabCard = isRabCard;
        msg.param.rabCardRate = rate;
        msg.param.isGuide = isGuide;
        return msg;
    }

    public respFromLocal(){
        var json:any;
        var resInfo = COMMON.resInfo.cloneServerInfo();
        resInfo.diamond+= this.param.addDiamond;
        var userInfo = COMMON.userInfo.cloneAddExpServerInfo(this.param.addExp);
        var battleInfo = Battle.battleInfo.cloneServerInfo();
        battleInfo.actionPoint -= this.param.costActionPoint;
        battleInfo.score += this.param.addScore;
        if(this.param.isRevenge){
            battleInfo.revengeStartTime = new Date().getTime();
        }
        var addCard:SCardInfo = null;
        if(this.param.isRabCard){
            addCard = MsgCardSummon.randomCardInfo(CardSummonType.LifeStone);
        }

        if(this.param.isGuide){
            addCard = MsgCardSummonGuide.randomCardInfo(3);
        }

        json ={
            enemyUid:this.param.enemyUid,
            addExp:this.param.addExp,
            resInfo:resInfo,
            userInfo:userInfo,
            battleInfo:battleInfo,
            addCard:addCard
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCFightEnemy.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}