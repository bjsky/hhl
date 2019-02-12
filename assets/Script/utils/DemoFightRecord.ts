import { SFightRecord } from "../net/msg/MsgLogin";
import { COMMON } from "../CommonData";
import StringUtil from "./StringUtil";
import { Card } from "../module/card/CardAssist";
import CardInfo from "../model/CardInfo";

export default class DemoFightRecord{
    public static initDemo(){
        var uid:string = COMMON.accountId;
        var name:string = COMMON.userInfo.name;
        var uid2:string = StringUtil.getUUidClient();
        var name2:string = "假想敌";
        var record:SFightRecord = this.createFightRecord(new Date().getTime(),uid,name,uid2,name2,2,false);
        var record1:SFightRecord = this.createFightRecord(new Date().getTime(),uid2,name2,uid,name,3,false);
        var record2:SFightRecord = this.createFightRecord(new Date().getTime(),uid,name,uid2,name2,2,true,"",1,1);
        var record3:SFightRecord = this.createFightRecord(new Date().getTime(),uid2,name2,uid,name,1,true,"",3,3);
        this.demo1=[record,record1,record2,record3]; 
    }

    public static demo1:SFightRecord[];

    public static createFightRecord(time,uid,uName,beUid,beName,score,isRabCard
        ,uuid:string = "",cardId:number =0,grade:number =0):SFightRecord{
        var record:SFightRecord = new SFightRecord();
        record.time = time;
        record.fightUid = uid;
        record.fightName = uName;
        record.befightUid = beUid;
        record.befightName = beName;
        record.score = score;
        record.isRabCard = isRabCard;
        record.rabCardUuid = uuid;
        record.rabCardId = cardId;
        record.rabCardGrade = grade;
        return record;
    }

    public static createBeRabFightRecord():SFightRecord{
        var loseCardUUid:string = Card.getCardUUidRandom();
        var loseCardInfo:CardInfo = Card.getCardByUUid(loseCardUUid);
        var record:SFightRecord = this.createFightRecord(new Date().getTime(),
        StringUtil.getUUidClient(),"假想敌",COMMON.accountId,COMMON.userInfo.name,3,true,
        loseCardUUid,loseCardInfo.cardId,loseCardInfo.grade);
        return record;
    }
}