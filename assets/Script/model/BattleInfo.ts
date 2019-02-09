import { SBattleInfo } from "../net/msg/MsgLogin";
import { SRabRecord } from "../net/msg/MsgGetEnemyList";
import { CONSTANT } from "../Constant";
import { COMMON } from "../CommonData";

export class RabRecord{
    //时间;毫秒
    public time:number = 0;
    //被抢夺对象
    public beRabName:string ="";
    //获得卡牌品级
    public cardGrade:number = 0;
    //获得卡牌id
    public cardId:number =0;

    public initFormServer(sRecord:SRabRecord){
        this.time = sRecord.time;
        this.beRabName = sRecord.beRabName;
        this.cardGrade = sRecord.cardGrade;
        this.cardId = sRecord.cardId;
    }
}
export default class BattleInfo{

    //行动点
    public actionPoint:number = 0;
    //行动点恢复开始时间
    public apStartTime:number = 0;
    //复仇开始时间
    public revengeStartTime:number = 0;
    //积分
    public score:number = 0;
    //自己的抢卡历史
    public records:Array<RabRecord> = [];
    
    //总行动力
    public totalAP:number = 0;
    //行动力恢复时间
    public apReturnTime:number = 0;
    //复仇恢复时间
    public revengeReturnTime:number = 0;

    //行动力百分比
    public get apPro(){
        var pro = this.actionPoint/this.totalAP;
        return (pro>1)?1:(pro<0?0:pro);
    }
    //复仇时间
    public get revengeTime():number{
        if(this.revengeStartTime<=0){
            return 0;
        }else{
            var time = COMMON.getServerTime() - (this.revengeStartTime+this.revengeReturnTime);
            if(time>0){
                return time;
            }else{
                return 0;
            }
        }
    }
    public get revengeTimePro(){
        var pro = this.revengeTime/this.revengeReturnTime;
        return (pro>1)?1:(pro<0?0:pro);
    }

    public initFromServer(info:SBattleInfo){
        this.actionPoint = info.actionPoint;
        this.apStartTime = info.apStartTime;
        this.score = info.score;
        this.revengeStartTime = info.revengeStartTime;
        this.records = [];
        info.rabRecord.forEach((sRecord:SRabRecord) => {
            var record:RabRecord = new RabRecord();
            record.initFormServer(sRecord);
            this.records.push(record);
        });

        this.totalAP = CONSTANT.getActionPointMax();
        this.apReturnTime = CONSTANT.getActionPointPerTime();
        this.revengeReturnTime = CONSTANT.getRevengeTime();
    }

    public cloneServerInfo():SBattleInfo{
        var info:SBattleInfo = new SBattleInfo();
        info.actionPoint = this.actionPoint;
        info.apStartTime = this.apStartTime;
        info.score = this.score;
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