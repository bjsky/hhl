import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SResInfo, SUserInfo, SBattleInfo } from "./MsgLogin";
import MsgCardSummon, { SCardInfo, CardSummonType } from "./MsgCardSummon";
import { COMMON } from "../../CommonData";
import { Battle } from "../../module/battle/BattleAssist";
import { SRabRecord } from "./MsgGetEnemyList";
export class CSFightRevenge{
    //敌人uid
    public enemyUid:string ="";
    //战斗结束增加经验，前端算好
    public addExp:number = 0;
    //战斗结束增加钻石，前段算好
    public addDiamond:number = 0;
    //增加的红名点，前端算好
    public addRedPoint:number = 0;
    //是否抢卡
    public isGetCard:boolean = false;
    //抢卡时的概率，抢卡会保存纪录，概率跟抽卡概率格式一样，前端给，如，1;66|2;24|3;8|4;2|5;0.4
    public getCardRate:string = "";
}

export class SCFightRevenge{
    //敌人uid
    public enemyUid:string ="";
    //战斗完成增加的经验
    public addExp:number = 0;
    //战斗完成后的res信息
    public resInfo:SResInfo;
    //战斗完成后的等级经验信息
    public userInfo:SUserInfo;
    //战斗完成后的战场信息（重置复仇时间），红名增加，抢卡增加抢夺纪录
    public battleInfo:SBattleInfo;
    //战斗完成后获得的卡牌(如果没有为null,获得卡牌就是更改敌人卡牌的归属，并且等级重置为1级，同时推送给丢失卡牌的玩家)
    public addCard:SCardInfo;

    public static parse(obj:any):SCFightRevenge{
        var info:SCFightRevenge = new SCFightRevenge();
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

//复仇
export default class MsgFightRevenge extends MessageBase{
    public param:CSFightRevenge;
    public resp:SCFightRevenge;

    constructor(){
        super(NetConst.FightRevenge);
        this.isLocal = true;
    }

    //复仇
    public static createRevenge(uid:string,
        addExp:number,addDiamond:number,addRedPoint:number
        ,isGetCard:boolean,rate:string){
        var msg = new MsgFightRevenge();
        msg.param = new CSFightRevenge();
        msg.param.enemyUid = uid;
        msg.param.addExp = addExp;
        msg.param.addDiamond = addDiamond;
        msg.param.addRedPoint = addRedPoint;
        msg.param.isGetCard = isGetCard;
        msg.param.getCardRate = rate;
        return msg;
    }

    public respFromLocal(){
        var json:any;
        var resInfo = COMMON.resInfo.cloneServerInfo();
        resInfo.diamond+= this.param.addDiamond;
        var userInfo = COMMON.userInfo.cloneAddExpServerInfo(this.param.addExp);
        var battleInfo = Battle.battleInfo.cloneServerInfo();
        battleInfo.redPoint += this.param.addRedPoint;
        battleInfo.revengeStartTime = new Date().getTime();
        var addCard:SCardInfo = null;
        var record:SRabRecord = null;
        if(this.param.isGetCard){
            addCard = MsgCardSummon.randomCardInfo(CardSummonType.LifeStone);
            record = new SRabRecord();
            record.beRabName = "路人甲";
            record.cardGrade = addCard.grade;
            record.cardId = addCard.cardId;
            record.time = new Date().getTime();
            battleInfo.rabRecord.push(record);
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
        this.resp = SCFightRevenge.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}