import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SCardInfo } from "./MsgCardSummon";
import StringUtil from "../../utils/StringUtil";
import { Card } from "../../module/card/CardAssist";
import CardInfo from "../../model/CardInfo";

export class SCPushFightCard{
    //时间
    public time:number = 0;
    //玩家uid
    public fightEnemyUid:string = "";
    //玩家名字
    public fightEnemyName:string = '';
    //积分结果
    public score:number = 0;
    //抢夺卡牌
    public rabCard:SCardInfo = null;

    public static parse(obj:any):SCPushFightCard{
        var info:SCPushFightCard = new SCPushFightCard();
        info.time = obj.time;
        info.fightEnemyUid = obj.rabEnemyUid;
        info.fightEnemyName = obj.rabEnemyName;
        if(obj.rabCard!=undefined || obj.rabCard!=null){
            info.rabCard = SCardInfo .parse(obj.rabCard);
        }
        info.score = obj.score;
        return info;
    }
}

export default class MsgPushFightCard extends MessageBase{
    public param:any;
    public resp:SCPushFightCard;

    constructor(){
        super(NetConst.PushFightCard);
        // this.isLocal = true;
    }
    public static create():MsgPushFightCard{
        var msg:MsgPushFightCard = new MsgPushFightCard();
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
        this.resp = SCPushFightCard.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}