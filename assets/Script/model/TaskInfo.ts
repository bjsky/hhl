import { STaskInfo, SRewardInfo, STaskProgressInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { ResType } from "./ResInfo";
import { CONSTANT } from "../Constant";
import { COMMON } from "../CommonData";
import { Passage } from "../module/battle/PassageAssist";
import { Card } from "../module/card/CardAssist";
import { Battle } from "../module/battle/BattleAssist";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";

export enum RewardType{
    SevenDay = 1,   //7日奖励
    TaskActive,     //活跃度奖励
    Growth,    //成长奖励
}
export enum GrowRewardType{
    LevelGrowth = 1,    //等级奖励
    PassGrowth,     //通关奖励
    cardUpGrowth,    //卡牌升级奖励
    cardGrowth,    //卡牌奖励
    scoreGrowth     //积分奖励
}
export default class TaskInfo{

    public activeScore:number = 0;
    //活跃度奖励
    public taskRewardArr:RewardInfo[] = [];
    public totalScore:number = 0;
    //任务进度
    public taskProgressArr:TaskProgressInfo[] = [];
    //成长奖励信息
    private _sGrowthRewards:SRewardInfo[] = [];
    public growthRewardMap:any = {};
    public growthNameArr:string[] = [];

    public initFormServer(sInfo:STaskInfo){

        this.activeScore = sInfo.activeScore;

        this.taskRewardArr = [];
        var reward:RewardInfo;
        var rewardIds = CONSTANT.getTaskRewardIds();
        for(var i:number = 0;i<rewardIds.length;i++){
            var needScore = Number(rewardIds[i].split(";")[0]);
            var rewardId = Number(rewardIds[i].split(";")[1]);
            reward = new RewardInfo();
            reward.rewardId = rewardId;
            var rewardCfg:any = CFG.getCfgDataById(ConfigConst.Reward,reward.rewardId)
            reward.rewardName = rewardCfg.rewardName;
            reward.rewardResType = Number(rewardCfg.resType);
            reward.rewardResNum = Number(rewardCfg.resNum);
            reward.rewardCardId = Number(rewardCfg.cardId);
            reward.rewardCardGrade = Number(rewardCfg.cardGrade);
            reward.needScore = needScore;

            var sReward:SRewardInfo = null;
            sInfo.taskRewards.forEach((sr:SRewardInfo)=>{
                if(sr.rewardId == reward.rewardId){
                    sReward = sr;
                }
            });
            reward.isReceived =(sReward!= null)?sReward.isReceived:false;
            this.taskRewardArr.push(reward);
        }
        this.totalScore = this.taskRewardArr[this.taskRewardArr.length-1].needScore;

        this.taskProgressArr = [];
        var taskCfgMap = CFG.getCfgGroup(ConfigConst.Task);
        var taskProgress:TaskProgressInfo;
        var taskCfg:any;
        for(var key in taskCfgMap){
            taskCfg = taskCfgMap[key];
            taskProgress = new TaskProgressInfo();
            taskProgress.taskId = Number(taskCfg.id);
            taskProgress.taskDesc = taskCfg.taskDesc;
            taskProgress.taskScore = Number(taskCfg.taskScore);
            taskProgress.taskCount = Number(taskCfg.taskCount);
            taskProgress.guideId = Number(taskCfg.guideId);

            var sTaskPro:STaskProgressInfo = null;
            sInfo.taskProgresses.forEach((st:STaskProgressInfo)=>{
                if(st.taskId == taskProgress.taskId){
                    sTaskPro = st;
                }
            })

            taskProgress.finishNum = (sTaskPro!=null)?sTaskPro.finishNum:0;
            this.taskProgressArr.push(taskProgress);
        }

        this._sGrowthRewards = sInfo.growthRewards;
        this.updateGrowthReward();
    }

    public updateGrowthReward(){
        this.initGrowthReward(GrowRewardType.LevelGrowth,this._sGrowthRewards);
        this.initGrowthReward(GrowRewardType.PassGrowth,this._sGrowthRewards);
        this.initGrowthReward(GrowRewardType.cardUpGrowth,this._sGrowthRewards);
        this.initGrowthReward(GrowRewardType.cardGrowth,this._sGrowthRewards);
        this.initGrowthReward(GrowRewardType.scoreGrowth,this._sGrowthRewards);

        this.growthNameArr = [];
        for(var i:number = GrowRewardType.LevelGrowth;i<=GrowRewardType.scoreGrowth;i++){
            var growthReward = this.getGrowthRewardWithType(i);
            if(growthReward && growthReward.reward){
                this.growthNameArr.push(growthReward.reward.rewardName);
            }
        }
    }

    //获取任务的完成数量
    public getTaskFinishCount(taskid:number){
        for(var i:number = 0;i<this.taskProgressArr.length;i++){
            if(this.taskProgressArr[i].taskId == taskid){
                return this.taskProgressArr[i].finishNum;
            }
        }
        return 0;
    }

    //获取任务奖励
    public getTaskReward(rewardid:number):RewardInfo{
        for(var i:number = 0;i<this.taskRewardArr.length;i++){
            if(this.taskRewardArr[i].rewardId == rewardid){
                return this.taskRewardArr[i];
            }
        }
        return null;
    }

    private initGrowthReward(type:GrowRewardType,sRewards:SRewardInfo[]){
        var growthRewardIds:string[] = CONSTANT.getGrowthRewardIds(type);
        var growthReward:GrowthRewardInfo = new GrowthRewardInfo();
        growthReward.growthType = type;
        growthReward.reward = null;

        var reward:RewardInfo;
        for(var i:number = 0;i<growthRewardIds.length;i++){
            var needNum:number = Number(growthRewardIds[i].split(";")[0]);
            var rewardId:number = Number(growthRewardIds[i].split(";")[1])
            reward = new RewardInfo();
            reward.rewardId = rewardId;

            var sReward:SRewardInfo = null;
            sRewards.forEach((sr:SRewardInfo)=>{
                if(sr.rewardId == reward.rewardId){
                    sReward = sr;
                }
            });
            reward.isReceived =(sReward!= null)?sReward.isReceived:false;
            if(!reward.isReceived){
                var rewardCfg:any = CFG.getCfgDataById(ConfigConst.Reward,reward.rewardId)
                reward.rewardName = rewardCfg.rewardName;
                reward.rewardResType = Number(rewardCfg.resType);
                reward.rewardResNum = Number(rewardCfg.resNum);
                reward.rewardCardId = Number(rewardCfg.cardId);
                reward.rewardCardGrade = Number(rewardCfg.cardGrade);
                reward.needScore = needNum;
                growthReward.reward = reward;
                break;
            }
        }
        if(growthReward.reward){
            growthReward.curNum = this.getGrowthRewardCurNum(type);
            growthReward.canReceive = (growthReward.curNum >= growthReward.reward.needScore);
        }
        this.growthRewardMap[type] = growthReward;
    }

    public getGrowthRewardWithType(type:GrowRewardType):GrowthRewardInfo{
        return this.growthRewardMap[type];
    }

    public getGrowthRewardCurNum(type:GrowRewardType):number{
        var cur:number = 0;
        if(type== GrowRewardType.LevelGrowth){
            cur = COMMON.userInfo.level;
        }else if(type == GrowRewardType.PassGrowth){
            cur = Passage.passageInfo.passId;
        }else if(type == GrowRewardType.cardUpGrowth){
            cur = Card.getMaxCardLevel();
        }else if(type == GrowRewardType.cardGrowth){
            cur = Card.getGradeCardCount(5);
        }else if(type == GrowRewardType.scoreGrowth){
            cur = Battle.battleInfo.score;
        }
        return cur;
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
    //达成条件
    public needScore:number = 0;
}

export class TaskProgressInfo{
    //任务id
    public taskId:number = 0;
    //任务描述
    public taskDesc:string = "";
    //完成次数
    public finishNum:number = 0;
    //任务积分
    public taskScore:number =0;
    //任务总量 
    public taskCount:number = 0;
    //引导id
    public guideId:number = 0;
}

export class GrowthRewardInfo{
    //成长类型
    public growthType:GrowRewardType = 0;
    //奖励
    public reward:RewardInfo = null;
    //当前值
    public curNum:number = 0;
    //是否可领取
    public canReceive:boolean = false;
}