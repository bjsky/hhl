import MessageBase from "./MessageBase";
import { SResInfo, SUserInfo } from "./MsgLogin";
import NetConst from "../NetConst";

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

    public static parse(obj:any):SCCardSummon{
        return null;
    }
}

/**
 * 服务器单个卡牌数据
 */
export class SCardInfo{

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
        
        var json:any ={

        };
        
        this.resp = this.parse(json);
        return this;
    }

    protected parse(obj:any){
        return SCCardSummon.parse(obj);
    }
}
