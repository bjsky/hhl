import { SBattleInfo } from "../net/msg/MsgLogin";
import { SRabRecord } from "../net/msg/MsgGetEnemyList";

export class RabRecord{
    //时间;毫秒
    public time:number = 0;
    //被抢夺对象
    public beRabName:string ="";
    //获得卡牌品级
    public cardGrade:number = 0;
    //获得卡牌id
    public cardId:number =0;
}
export default class BattleInfo{

    //行动点
    public actionPoint:number = 0;
    //行动点恢复开始时间
    public apStartTime:number = 0;
    //复仇开始时间
    public revengeStartTime:number = 0;
    //红名点
    public redPoint:number = 0;
    //自己的抢卡历史
    public records:Array<RabRecord> = [];

    public initFromServer(info:SBattleInfo){
        this.actionPoint = info.actionPoint;
        this.apStartTime = info.apStartTime;
        this.redPoint = info.redPoint;
        this.revengeStartTime = info.revengeStartTime;
        this.records = [];
        info.rabRecord.forEach((sRecord:SRabRecord) => {
            var record:RabRecord = new RabRecord();
            record.time = sRecord.time;
            record.beRabName = sRecord.beRabName;
            record.cardGrade = sRecord.cardGrade;
            record.cardId = sRecord.cardId;
            this.records.push(record);
        });
    }

    public cloneServerInfo():SBattleInfo{
        var info:SBattleInfo = new SBattleInfo();
        info.actionPoint = this.actionPoint;
        info.apStartTime = this.apStartTime;
        info.redPoint = this.redPoint;
        info.rabRecord = [];
        this.records.forEach((record:RabRecord) => {
            var sRecord:SRabRecord = new SRabRecord();
            sRecord.time = record.time;
            sRecord.beRabName = record.beRabName;
            sRecord.cardGrade = record.cardGrade;
            sRecord.cardId = record.cardId;
            info.rabRecord.push(sRecord);
        });
        return info;
    }
}