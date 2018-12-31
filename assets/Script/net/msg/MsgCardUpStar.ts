import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SCardInfo } from "./MsgCardSummon";
import { SResInfo } from "./MsgLogin";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";
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

    public static parse(obj:any){
        var data:SCCardUpStar = new SCCardUpStar();
        data.cardInfo = SCardInfo.parse(obj.cardInfo);
        data.useCardUuid = obj.useCardUUid;
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
        sInfo.grade+=1;
        sInfo.level = 1;
        json ={
            cardInfo:sInfo,
            useCardUUid:this.param.useCardUuid
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