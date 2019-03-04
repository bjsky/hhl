import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { RewardType } from "../../model/TaskInfo";
import { STaskInfo, SResInfo, SSevendayInfo } from "./MsgLogin";
import { SCardInfo } from "./MsgCardSummon";

export class CSGetConfigReward{
    //奖励表中id
    public rewardId:number = 0;
    //奖励表中type(1、七日奖励，2、活跃度奖励，3、成长奖励)
    public rewardType:RewardType = 0;
}

export class SCGetConfigReward{
    //任务数据(领取活跃度奖励、成长奖励时变更)
    public taskInfo:STaskInfo = null;
    //七日数据(领取七日奖励时修改已领奖);
    public senvenDayInfo:SSevendayInfo = null;
    //最新的资源数据，获得资源奖励后增加
    public resInfo:SResInfo = null;
    //获得的卡牌，获得卡牌奖励时增加，不获得时为空或者不给
    public newCard:SCardInfo = null;

    public static parse(obj:any):SCGetConfigReward{
        var info:SCGetConfigReward = new SCGetConfigReward();
        if(obj.taskInfo!=undefined && obj.taskInfo!=null){
            info.taskInfo = STaskInfo.parse(obj.taskInfo);
        }
        if(obj.senvenDayInfo!=undefined && obj.senvenDayInfo!=null){
            info.senvenDayInfo = SSevendayInfo.parse(obj.senvenDayInfo);
        }
        if(obj.resInfo!=undefined && obj.resInfo!=null){
            info.resInfo = SResInfo.parse(obj.resInfo);
        }
        if(obj.newCard!=undefined && obj.newCard!=null){
            info.newCard = SCardInfo.parse(obj.newCard);
        }
        return info;
    }
}
//获取配置奖励（任务、成长、七日等）
export default class MsgGetConfigReward extends MessageBase{
    public param:CSGetConfigReward;
    public resp:SCGetConfigReward;

    constructor(){
        super(NetConst.GetConfigReward);
        // this.isLocal = true;
    }

    public static create(rewardId:number,rewardType:RewardType){
        var msg = new MsgGetConfigReward();
        msg.param = new CSGetConfigReward();
        msg.param.rewardId = rewardId;
        msg.param.rewardType = rewardType;
        return msg;
    }

    public respFromLocal(){
        var json:any ={};
        return this.parse(json);
    }
    private parse(obj:any):MessageBase{
        this.resp = SCGetConfigReward.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}