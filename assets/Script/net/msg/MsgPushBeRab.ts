import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MsgCardSummon, { SCardInfo, CardSummonType } from "./MsgCardSummon";
import { SEnemyInfo } from "./MsgGetEnemyList";
import { COMMON } from "../../CommonData";

export class SCPushBeRab{
    //抢夺时间
    public rabTime:number = 0;
    //抢夺者名字
    public rabEnemyName:string ="";
    //丢失卡牌
    public loseCard:SCardInfo=null;
    //最新仇人列表
    public personalEnmeyList:Array<SEnemyInfo> = [];

    public static parse(obj:any):SCPushBeRab{
        var info:SCPushBeRab = new SCPushBeRab();
        info.rabTime = obj.rabTime;
        info.rabEnemyName = obj.rabEnemyName;
        info.loseCard = SCardInfo.parse(obj.loseCard);
        info.personalEnmeyList = [];
        obj.personalEnmeyList.forEach((enemyInfo:any) => {
            info.personalEnmeyList.push(SEnemyInfo.parse(enemyInfo));
        });
        return info;
    }
}

export default class MsgPushBeRab extends MessageBase{
    public param:any;
    public resp:SCPushBeRab;

    constructor(){
        super(NetConst.PushBeRab);
        this.isLocal = true;
    }
    public respFromLocal(){
        var json:any;
        json ={
            rabTime:new Date().getTime(),
            rabEnemyName:COMMON.userInfo.name,
            loseCard:MsgCardSummon.randomCardInfo(CardSummonType.LifeStone),
            personalEnmeyList:[]
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCPushBeRab.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}