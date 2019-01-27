import MessageBase from "./MessageBase";
import { SResInfo } from "./MsgLogin";
import { SCardInfo } from "./MsgCardSummon";
import NetConst from "../NetConst";
import { COMMON } from "../../CommonData";

//钻石购买参数
export class CSDiamondBuy{
    //钻石消耗
    public diamondCost:number = 0;
    //钻石购买卡的卡牌id
    public diamondBuyCardId:number = 0;
    //钻石购买卡的品级
    public diamondBuyCardGrade:number = 0;
}

//获得奖励返回
export class SCDiamondBuy{
    //最新的资源(消耗钻石)
    public resInfo:SResInfo = null;
    //购买的卡牌
    public newCard:SCardInfo = null;

    public static parse(obj:any):SCDiamondBuy{
        var data:SCDiamondBuy = new SCDiamondBuy();
        data.resInfo = SResInfo.parse(obj.resInfo);
        data.newCard = SCardInfo.parse(obj.newCard);
        return data;
    }
}
export default class MsgDiamondBuy extends MessageBase{
    public param:CSDiamondBuy;
    public resp:SCDiamondBuy;

    constructor(){
        super(NetConst.DiamondBuy);
        this.isLocal = true;
    }

    public static create(cost:number,cardId:number,grade:number){
        var msg = new MsgDiamondBuy();
        msg.param = new CSDiamondBuy();
        msg.param.diamondCost= cost;
        msg.param.diamondBuyCardId = cardId;
        msg.param.diamondBuyCardGrade = grade;
        return msg;
    }

    public respFromLocal(){
        var cardUUid:string = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        var cardInfo = {
            uuid:cardUUid,
            level:1,
            cardId:this.param.diamondBuyCardId,
            grade:this.param.diamondBuyCardGrade,
            skillLevel:1
        }
        var retRes:SResInfo = COMMON.resInfo.cloneServerInfo();
        retRes.diamond -= this.param.diamondCost;
        var json = {
            resInfo:retRes,
            newCard:cardInfo
            };
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCDiamondBuy.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}