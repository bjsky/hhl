import { STaskInfo, SRewardInfo, STaskProgressInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { ResType } from "./ResInfo";
import { CONSTANT } from "../Constant";

export default class TaskInfo{

    public activeScore:number = 0;
    //活跃度奖励信息
    public taskRewardArr:RewardInfo[] = [];
    //任务进度
    public taskProgressArr:TaskProgressInfo[] = [];

    public initFormServer(sInfo:STaskInfo){

        this.activeScore = sInfo.activeScore;

        this.taskRewardArr = [];
        var reward:RewardInfo;
        var rewardIds = CONSTANT.getTaskRewardIds();
        for(var i:number = 0;i<rewardIds.length;i++){
            reward = new RewardInfo();
            reward.rewardId = Number(rewardIds[i]);
            var rewardCfg:any = CFG.getCfgDataById(ConfigConst.Reward,reward.rewardId)
            reward.rewardName = rewardCfg.rewardName;
            reward.rewardResType = Number(rewardCfg.resType);
            reward.rewardResNum = Number(rewardCfg.resNum);
            reward.rewardCardId = Number(rewardCfg.cardId);
            reward.rewardCardGrade = Number(rewardCfg.cardGrade);
            reward.rewardNeedScore = Number(rewardCfg.needScore);

            var sReward:SRewardInfo = null;
            sInfo.taskRewards.forEach((sr:SRewardInfo)=>{
                if(sr.rewardId == reward.rewardId){
                    sReward = sr;
                }
            });
            reward.isReceived =(sReward!= null)?sReward.isReceived:false;
            this.taskRewardArr.push(reward);
        }

        this.taskProgressArr = [];
        var taskCfgMap = CFG.getCfgGroup(ConfigConst.Task);
        var taskProgress:TaskProgressInfo;
        var taskCfg:any;
        for(var key in taskCfgMap){
            taskCfg = taskCfgMap[key];
            taskProgress = new TaskProgressInfo();
            taskProgress.taskId = Number(taskCfg.id);
            taskProgress.taskScore = Number(taskCfg.taskScore);
            taskProgress.taskCount = Number(taskCfg.taskCount);

            var sTaskPro:STaskProgressInfo = null;
            sInfo.taskProgresses.forEach((st:STaskProgressInfo)=>{
                if(st.taskId == taskProgress.taskId){
                    sTaskPro = st;
                }
            })

            taskProgress.finishNum = (sTaskPro!=null)?sTaskPro.finishNum:0;
            this.taskProgressArr.push(taskProgress);
        }
    }
}

export class RewardInfo{
    //奖励id
    public rewardId:number = 0;
    //是否已经领奖
    public isReceived:boolean = false;
    //奖励名
    public rewardName:string ="";
    //奖励资源
    public rewardResType:ResType =0;
    //奖励资源数量
    public rewardResNum:number = 0;
    //奖励卡牌id
    public rewardCardId:number = 0;
    //奖励卡牌星级
    public rewardCardGrade:number = 0;
    //领奖需要积分
    public rewardNeedScore:number = 0;
}

export class TaskProgressInfo{
    //任务id
    public taskId:number = 0;
    //完成次数
    public finishNum:number = 0;
    //任务积分
    public taskScore:number =0;
    //任务总量 
    public taskCount:number = 0;

}