import { STaskInfo } from "../net/msg/MsgLogin";
import TaskInfo, { GrowRewardType, RewardInfo, RewardType } from "../model/TaskInfo";
import { NET } from "../net/core/NetController";
import MsgUpdateTask from "../net/msg/MsgUpdateTask";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "./loading/steps/LoadingStepConfig";
import MsgGetConfigReward from "../net/msg/MsgGetConfigReward";
import { COMMON } from "../CommonData";
import { ResConst } from "./loading/steps/LoadingStepRes";
import { UI } from "../manager/UIManager";
export class TaskType{
    public static SummonTask:number = 1;     //灵石抽卡
    public static UpLvTask:number = 2;       //升级
    public static UpGradeTask:number = 3;     //升星
    public static CollectRes:number = 4;        //挂机领取
    public static FightBoss:number = 5;     //挑战boss
    public static FightEnemy:number = 6;    //挑战玩家
    public static RevengeEnemy:number = 7;  //复仇玩家
    public static RefreshEnemy:number = 8;  //刷新玩家列表
    public static ShareFriend:number = 9;   //分享好友
    public static SeeVideoGetGold:number = 10;   //看视频的金币
    public static SeeVideoGetStone:number = 11 ;  //看视频得灵石
    public static ChangeLineup:number = 12;  //切换阵容
    public static DiamondBuy:number = 13;    //钻石购买

}

export default class TaskAssist{
    private static _instance: TaskAssist = null;
    public static getInstance(): TaskAssist {
        if (TaskAssist._instance == null) {
            TaskAssist._instance = new TaskAssist();
            
        }
        return TaskAssist._instance;
    }

    private _taskInfo:TaskInfo;
    public get taskInfo():TaskInfo{
        if(this._taskInfo==undefined){
            this._taskInfo = new TaskInfo();
        }
        return this._taskInfo;
    }
    public initTask(sTask:STaskInfo):void{
        this.taskInfo.initFormServer(sTask);
    }

    public updateTaskInfo(sTask:STaskInfo){
        this.initTask(sTask);
    }

    public updateGrowthReward(){
        this.taskInfo.updateGrowthReward();
        EVENT.emit(GameEvent.TaskGrowthUpdate);
    }

    public get isShowRed(){
        return this.canReceiveActive || this.canReceiveGrowth;
    }
    public get canReceiveActive():boolean{
        var reward:RewardInfo;
        for(var i:number= 0;i<this.taskInfo.taskRewardArr.length;i++){
            reward = this.taskInfo.taskRewardArr[i];
            if(this.taskInfo.activeScore >= reward.needScore && !reward.isReceived){
                return true;
            }else if(this.taskInfo.activeScore < reward.needScore){
                break;
            }
        }
        return false;
    }
    public get canReceiveGrowth():boolean{
        for(var i:number = GrowRewardType.LevelGrowth;i<=GrowRewardType.scoreGrowth;i++){
            var growthReward = this.taskInfo.getGrowthRewardWithType(i);
            if(growthReward && growthReward.reward){
                if(growthReward.canReceive){
                    return true;
                }
            }
        }
        return false;
    }

    //完成任务 
    public finishTask(taskid:number):void{
        var taskCount = this.taskInfo.getTaskFinishCount(taskid)+1;
        var taskTotalCount = Number(CFG.getCfgDataById(ConfigConst.Task,taskid).taskCount);
        if(taskCount>taskTotalCount){
            return;
        }
        NET.send(MsgUpdateTask.create(taskid,taskCount),(msg:MsgUpdateTask)=>{
            if(msg && msg.resp){
                this.updateTaskInfo(msg.resp.taskInfo);
                EVENT.emit(GameEvent.TaskUpdate);
            }
        },this)
    }

    //领取奖励
    public receiveTaskReward(reward:RewardInfo){
        NET.send(MsgGetConfigReward.create(Number(reward.rewardId),RewardType.TaskActive),(msg:MsgGetConfigReward)=>{
            if(msg && msg.resp){
                COMMON.updateResInfo(msg.resp.resInfo);
                UI.createPopUp(ResConst.singleAwardPanel,
                    {type:Number(reward.rewardResType),num:Number(reward.rewardResNum)})
                this.updateTaskInfo(msg.resp.taskInfo);
                EVENT.emit(GameEvent.TaskActiveReceived,{id:reward.rewardId});
            }
        },this)
    }
    //领取成长奖励
    public receiveGrowthReward(reward:RewardInfo){
        NET.send(MsgGetConfigReward.create(Number(reward.rewardId),RewardType.Growth),(msg:MsgGetConfigReward)=>{
            if(msg && msg.resp){
                COMMON.updateResInfo(msg.resp.resInfo);
                UI.createPopUp(ResConst.singleAwardPanel,
                    {type:Number(reward.rewardResType),num:Number(reward.rewardResNum)})
                this.updateTaskInfo(msg.resp.taskInfo);
                EVENT.emit(GameEvent.TaskGrowthReceived,{id:reward.rewardId});
            }
        },this)
    }
}

export var Task:TaskAssist = TaskAssist.getInstance();