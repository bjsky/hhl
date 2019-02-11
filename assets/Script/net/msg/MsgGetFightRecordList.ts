import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SFightRecord } from "./MsgLogin";
import StringUtil from "../../utils/StringUtil";
import { COMMON } from "../../CommonData";

export class CSGetFightRecordList{
    //玩家uid
    public uid:string ="";
}
export class SCGetFightRecordList{
    //攻击纪录列表
    public records:Array<SFightRecord> = null;

    public static parse(obj:any){
        var info:SCGetFightRecordList = new SCGetFightRecordList();
        info.records = [];
        obj.records.forEach((record:any) => {
            var sRecord:SFightRecord = SFightRecord.parse(record);
            info.records.push(sRecord);
        });
        return info;
    }
}
//获取uid的攻击纪录（攻击和被攻击的）
export default class MsgGetFightRecordList extends MessageBase{
    public param:CSGetFightRecordList;
    public resp:SCGetFightRecordList;

    constructor(){
        super(NetConst.GetFightRecordList);
        this.isLocal = true;
    }

    public static create(uid:string){
        var msg = new MsgGetFightRecordList();
        msg.param = new CSGetFightRecordList();
        msg.param.uid = uid;
        return msg;
    }

    public respFromLocal(){
        var json:any ={
            records:DemoFightRecordUtils.getPlayerFightRecord(this.param.uid)
        };
        return this.parse(json);
    }
    private parse(obj:any):MessageBase{
        this.resp = SCGetFightRecordList.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}

export class DemoFightRecordUtils{

    private static _fightRecordMap:any = {};
    private static _fightRecordInited:any ={};
    private static _fightPlayerTest:any ={
        uid:StringUtil.getUUidClient(),
        uName:"假想敌",

    }

    public static getPlayerFightRecord(uid:string){
        if(uid == COMMON.accountId && this._fightRecordInited[uid]== undefined){
            this.initPlayerFightRecord(COMMON.accountId,COMMON.userInfo.name);
        }
        var records:Array<SFightRecord> = [];
        var sRecord:SFightRecord = null;
        for(var key in this._fightRecordMap){
            sRecord = this._fightRecordMap[key];
            if(sRecord.fightUid == uid || sRecord.befightUid == uid){
                records.push(sRecord);
            }
        }
        return records;
    }
    public static initPlayerFightRecord(uid,name){
        if(this._fightRecordInited[uid]== undefined){
            this._fightRecordInited[uid] = true;
            var record:SFightRecord = this.createFightRecord(new Date().getTime(),uid,name
            ,this._fightPlayerTest.uid,this._fightPlayerTest.uName,2,false);
            this._fightRecordMap[StringUtil.getUUidClient()] = record;
            var record1:SFightRecord = this.createFightRecord(new Date().getTime()
            ,this._fightPlayerTest.uid,this._fightPlayerTest.uName,uid,name,3,false);
            this._fightRecordMap[StringUtil.getUUidClient()] = record1;
            var record2:SFightRecord = this.createFightRecord(new Date().getTime(),uid,name
            ,this._fightPlayerTest.uid,this._fightPlayerTest.uName,2,true,"",1,1);
            this._fightRecordMap[StringUtil.getUUidClient()] = record2;
            var record3:SFightRecord = this.createFightRecord(new Date().getTime()
            ,this._fightPlayerTest.uid,this._fightPlayerTest.uName,uid,name,1,true,"",3,3);
            this._fightRecordMap[StringUtil.getUUidClient()] = record3;
        }
    }
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
}