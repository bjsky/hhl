import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SCardInfo } from "./MsgCardSummon";
import { SResInfo } from "./MsgLogin";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";

export class CSCardUpLv{
    //卡牌uid 
    public cardUuid:string = "";  
    //卡牌消耗灵石，客户端算,简化服务器
    public upCostlifeStone:number = 0;  
}

export class SCCardUpLv{
    //卡牌信息
    public cardInfo:SCardInfo = null;
    //资源信息
    public resInfo:SResInfo = null;

    public static parse(obj:any){
        var data:SCCardUpLv = new SCCardUpLv();
        data.cardInfo = SCardInfo.parse(obj.cardInfo);
        data.resInfo = SResInfo.parse(obj.resInfo);
        return data;
    }
}

//卡牌升级
export default class MsgCardUpLv extends MessageBase{
    public param:CSCardUpLv;
    public resp:SCCardUpLv;

    constructor(){
        super(NetConst.CardUpLv);
        // this.isLocal = true;
    }

    public static create(cardUUid:string,cost:number){
        var msg = new MsgCardUpLv();
        msg.param = new CSCardUpLv();
        msg.param.cardUuid = cardUUid;
        msg.param.upCostlifeStone = cost;
        return msg;
    }

    public respFromLocal(){
        var json:any;
        var cardInfo:CardInfo = Card.getCardByUUid(this.param.cardUuid);
        var sInfo:SCardInfo = cardInfo.cloneServerInfo();
        var res:SResInfo = COMMON.resInfo.cloneServerInfo();
        res.lifeStone-= this.param.upCostlifeStone;
        sInfo.level+=1;
        json ={
            cardInfo:sInfo,
            resInfo:res
        }
        
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCCardUpLv.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}