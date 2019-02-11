import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { COMMON } from "../../CommonData";
import { SFightRecord } from "./MsgLogin";

export class SCPushFightRecord{
    //攻击纪录
    public record:SFightRecord = null;

    public static parse(obj:any):SCPushFightRecord{
        var info:SCPushFightRecord = new SCPushFightRecord();
        info.record = SFightRecord.parse(obj.record);
        return info;
    }
}

export default class MsgPushFightRecord extends MessageBase{
    public param:any;
    public resp:SCPushFightRecord;

    constructor(){
        super(NetConst.PushFightRecord);
        this.isLocal = true;
    }
    public respFromLocal(){
        var record:SFightRecord = new SFightRecord();
        record.time = new Date().getTime();
        record.fightUid = "";
        record.fightName = "路人甲";
        record.befightUid =COMMON.accountId;
        record.befightName = COMMON.userInfo.name;
        record.score = 3;
        record.isRabCard = false;
        var json:any;
        json ={
            record:record
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCPushFightRecord.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}