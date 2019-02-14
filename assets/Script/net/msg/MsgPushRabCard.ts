import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { COMMON } from "../../CommonData";
import { SFightRecord } from "./MsgLogin";
import { SCardInfo } from "./MsgCardSummon";
import StringUtil from "../../utils/StringUtil";
import { Card } from "../../module/card/CardAssist";
import CardInfo from "../../model/CardInfo";

export class SCPushRabCard{
    //时间
    public time:number = 0;
    //玩家uid
    public rabEnemyUid:string = "";
    //玩家名字
    public rabEnemeyName:string = '';
    //积分变化
    public score:number = 0;
    //抢夺卡牌
    public rabCard:SCardInfo = null;

    public static parse(obj:any):SCPushRabCard{
        var info:SCPushRabCard = new SCPushRabCard();
        info.time = obj.time;
        info.rabEnemyUid = obj.rabEnemyUid;
        info.rabEnemeyName = obj.rabEnemeyName;
        info.rabCard = SCardInfo .parse(obj.rabCard);
        info.score = obj.score;
        return info;
    }
}

export default class MsgPushRabCard extends MessageBase{
    public param:any;
    public resp:SCPushRabCard;

    constructor(){
        super(NetConst.PushRabCard);
        this.isLocal = true;
    }
    public static create():MsgPushRabCard{
        var msg:MsgPushRabCard = new MsgPushRabCard();
        msg.param = {};
        return msg;
    }
    public respFromLocal(){
        var time:number = new Date().getTime();
        var rabEnemyUid = StringUtil.getUUidClient();
        var rabEnemeyName  ="假想敌";
        var rabCardUuid = Card.getCardUUidRandom();
        var rabCard:CardInfo = Card.getCardByUUid(rabCardUuid); 
        var sInfo:SCardInfo = rabCard.cloneServerInfo();
        var json:any;
        json ={
            time:time,
            rabEnemyUid:rabEnemyUid,
            rabEnemeyName:rabEnemeyName,
            score:3,
            rabCard:sInfo
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCPushRabCard.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}