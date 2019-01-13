import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SResInfo } from "./MsgLogin";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";

export class CSCardDestroy{
    //卡牌uid 
    public cardUuid:string = "";  
}

export class SCCardDestroy{
    //卡牌uid 
    public cardUuid:string = "";  
    //资源信息
    public resInfo:SResInfo = null;
    public static parse(obj:any){
        var data:SCCardDestroy = new SCCardDestroy();
        data.cardUuid = obj.cardUuid;
        data.resInfo = SResInfo.parse(obj.resInfo);
        return data;
    }
}

export default class MsgCardDestroy extends MessageBase{
    public param:CSCardDestroy;
    public resp:SCCardDestroy;

    constructor(){
        super(NetConst.CardDestroy);
        // this.isLocal = true;
    }
    public static create(cardUUid:string){
        var msg = new MsgCardDestroy();
        msg.param = new CSCardDestroy();
        msg.param.cardUuid = cardUUid;
        return msg;
    }

    public respFromLocal(){
        var json:any;
        var cardInfo:CardInfo = Card.getCardByUUid(this.param.cardUuid);
        var cfg:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",cardInfo.grade,"level",cardInfo.level)[0];
        var destroyGet:number = Number(cfg.destoryGetStore);
        var res:SResInfo = COMMON.resInfo.cloneServerInfo();
        res.lifeStone+= destroyGet;
        json ={
            cardUuid:this.param.cardUuid,
            resInfo:res
        }
        
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCCardDestroy.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}