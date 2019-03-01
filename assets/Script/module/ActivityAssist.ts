import { SRewardInfo, SSevendayInfo } from "../net/msg/MsgLogin";
import { RewardInfo } from "../model/TaskInfo";
import { ConfigConst } from "./loading/steps/LoadingStepConfig";
import { CFG } from "../manager/ConfigManager";
import { CONSTANT } from "../Constant";

export default class ActivityAssist{
    private static _instance: ActivityAssist = null;
    public static getInstance(): ActivityAssist {
        if (ActivityAssist._instance == null) {
            ActivityAssist._instance = new ActivityAssist();
            
        }
        return ActivityAssist._instance;
    }

    public senvendayRewardArr:RewardInfo[] = null;
    public senvendayIndex:number = 0;

    public initSenvenday(sSenvenday:SSevendayInfo){

        this.senvendayIndex = sSenvenday.dayIndex;
        this.senvendayRewardArr = [];
        var reward:RewardInfo;
        var rewardIds = CONSTANT.getSevendayRewardIds();
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

            if(i== this.senvendayIndex){
                reward.isReceived = sSenvenday.todayReward.isReceived;
            }else{
                reward.isReceived = i<this.senvendayIndex;
            }
            this.senvendayRewardArr.push(reward);
        }
    }

    public get senvendayTodayReward():RewardInfo{
        return this.senvendayRewardArr[this.senvendayIndex];
    }
}

export var Activity:ActivityAssist = ActivityAssist .getInstance();
    