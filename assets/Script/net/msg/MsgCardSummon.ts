import MessageBase from "./MessageBase";
import { SResInfo, SUserInfo } from "./MsgLogin";
import NetConst from "../NetConst";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";

export enum CardSummonType{
    LifeStone = 0,  //灵石
    Viedo,          //视频
}

//卡牌召唤客户端数据
export class CSCardSummon{
    //召唤类型
    public summonType:CardSummonType = 0;
    //消耗灵石（客户端算）
    public stoneCost:number = 0;
}
//卡牌召唤服务器数据
export class SCCardSummon{
    //获得的卡牌；
    public newCard:SCardInfo = null;
    //最新的res
    public retRes:SResInfo = null;
    //经验等级
    public userInfo:SUserInfo = null;
    //更新灵石抽奖次数
    public stoneSummonNum:number = 0;
    //更新视频抽奖次数
    public videoSummonNum:number = 0;

    public static parse(obj:any):SCCardSummon{
        var data:SCCardSummon = new SCCardSummon();
        data.newCard = SCardInfo.parse(obj.newCard);
        data.retRes = SResInfo.parse(obj.retRes);
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.stoneSummonNum = obj.stoneSummonNum;
        data.videoSummonNum = obj.videoSummonNum;
        return data;
    }
}

/**
 * 服务器单个卡牌数据
 */
export class SCardInfo{
    //卡牌的唯一id:时间戳+6位随机数
    public uuid:string ="";
    //卡牌的id
    public cardId:number = 0;
    //卡牌的品级
    public grade:number = 0;
    //卡牌的等级
    public level:number = 0;

    public static parse(obj:any):SCardInfo{
        var data:SCardInfo = new SCardInfo();
        data.uuid = obj.uuid;
        data.cardId = obj.cardId;
        data.grade = obj.grade;
        data.level = obj.level;
        return data;
    }

}
/**
 * 卡牌召唤消息
 */
export default class MsgCardSummon extends  MessageBase {
    public param:CSCardSummon;
    public resp:SCCardSummon;

    constructor(summonType:CardSummonType,stoneCost:number=0){
        super(NetConst.CardSummon);

        this.param = new CSCardSummon();
        this.param.summonType = summonType;
        this.param.stoneCost = stoneCost;
    }

    public static createLocal(summonType:CardSummonType,stoneCost:number=0){
        var msg = new MsgCardSummon(summonType,stoneCost);
        msg.isLocal = true;
        return msg;
    }


    public respFromLocal(){
        var cardInfo = MsgCardSummon.randomCardInfo(this.param.summonType);
        var retRes:SResInfo = COMMON.resInfo.cloneServerInfo();
        retRes.lifeStone -= this.param.stoneCost;
        var card:any = CFG.getCfgDataById(ConfigConst.CardInfo,cardInfo.cardId);
        var userInfo = COMMON.userInfo.cloneAddExpServerInfo(card.summonGetExp);
        var json:any ={
            newCard:cardInfo,
            retRes:retRes,
            userInfo:userInfo,
            stoneSummonNum:(this.param.summonType == CardSummonType.LifeStone)?COMMON.stoneSummonNum+1:COMMON.stoneSummonNum,
            videoSummonNum:(this.param.summonType == CardSummonType.Viedo)?COMMON.videoSummonNum+1:COMMON.videoSummonNum
        };
        
        this.resp = this.parse(json);
        return this;
    }

    public static randomCardInfo(type:number){
        var cardUUid:string = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        var cardId = Card.getSummonCardId();
        var cardInfo = {
            uuid:cardUUid,
            level:1,
            cardId:cardId,
            grade:(type == CardSummonType.LifeStone)?Card.getStoneSummonGuide():Card.getVideoSummonGuide()
        }
        return cardInfo;
    }

    protected parse(obj:any){
        return SCCardSummon.parse(obj);
    }
}
