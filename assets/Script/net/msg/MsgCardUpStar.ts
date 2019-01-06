import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SCardInfo } from "./MsgCardSummon";
import { SResInfo } from "./MsgLogin";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
export class CSCardUpStar{
    //卡牌uid 
    public cardUuid:string = "";  
    //合成消耗卡牌uuid
    public useCardUuid:string = "";
}

export class SCCardUpStar{
    //升星卡牌信息
    public cardInfo:SCardInfo = null;
    //合成消耗卡牌uuid
    public useCardUuid:string = "";
    //最新的资源
    public resInfo:SResInfo = null;

    public static parse(obj:any){
        var data:SCCardUpStar = new SCCardUpStar();
        data.cardInfo = SCardInfo.parse(obj.cardInfo);
        data.useCardUuid = obj.useCardUUid;
        data.resInfo = SResInfo.parse(obj.resInfo);
        return data;
    }
}
//卡牌升星
export default class MsgCardUpStar extends MessageBase{
    public param:CSCardUpStar;
    public resp:SCCardUpStar;

    constructor(){
        super(NetConst.CardUpStar);
        this.isLocal = true;
    }

    public static create(cardUUid:string,useCardUUid:string){
        var msg = new MsgCardUpStar();
        msg.param = new CSCardUpStar();
        msg.param.cardUuid = cardUUid;
        msg.param.useCardUuid = useCardUUid;
        return msg;
    }

    public respFromLocal(){
        var json:any;
        var cardInfo:CardInfo = Card.getCardByUUid(this.param.cardUuid);
        var sInfo:SCardInfo = cardInfo.cloneServerInfo();
        var res = COMMON.resInfo.cloneServerInfo();
        var cost = CFG.getCfgByKey(ConfigConst.CardUp,"grade",sInfo.grade)[0].needGold;
        res.gold -= Number(cost);
        sInfo.grade+=1;
        sInfo.level = sInfo.level;
        json ={
            cardInfo:sInfo,
            useCardUUid:this.param.useCardUuid,
            resInfo:res
        }
        
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCCardUpStar.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}