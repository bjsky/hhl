import { SRewardInfo, SSevendayInfo } from "../net/msg/MsgLogin";
import { RewardInfo, RewardType } from "../model/TaskInfo";
import { ConfigConst } from "./loading/steps/LoadingStepConfig";
import { CFG } from "../manager/ConfigManager";
import { CONSTANT } from "../Constant";
import { NET } from "../net/core/NetController";
import MsgGetConfigReward from "../net/msg/MsgGetConfigReward";
import { Card } from "./card/CardAssist";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import { UI } from "../manager/UIManager";
import { ResConst } from "./loading/steps/LoadingStepRes";
import { CardBigShowType } from "../view/card/CardBig";
import { COMMON } from "../CommonData";
import { GetRewardType } from "../net/msg/MsgGetReward";
import { ResType } from "../model/ResInfo";

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

            if(i== this.senvendayIndex){
                reward.isReceived = (sSenvenday.todayReward==0?false:true);
            }else{
                reward.isReceived = i<this.senvendayIndex;
            }
            this.senvendayRewardArr.push(reward);
        }
    }

    public updateSevenday(sSenvenday:SSevendayInfo){
        this.initSenvenday(sSenvenday);
    }

    public get senvendayTodayReward():RewardInfo{
        return this.senvendayRewardArr[this.senvendayIndex];
    }

    public receiveSevenday(index:number){
        var rewardId = CONSTANT.getSevendayRewardIds()[index];
        var rewardCfg = CFG.getCfgDataById(ConfigConst.Reward,rewardId);
        NET.send(MsgGetConfigReward.create(Number(rewardId),RewardType.SevenDay),(msg:MsgGetConfigReward)=>{
            if(msg && msg.resp){
                if(msg.resp.newCard!=null){ //新卡牌
                    Card.addNewCard(msg.resp.newCard);
                    this.showGetCard(msg.resp.newCard.uuid);
                }else{  //资源
                    COMMON.updateResInfo(msg.resp.resInfo);
                    UI.createPopUp(ResConst.singleAwardPanel,
                        {resType:Number(rewardCfg.resType),num:Number(rewardCfg.resNum)})
                }

                this.updateSevenday(msg.resp.senvenDayInfo);
                EVENT.emit(GameEvent.SevendayReceived,{index:index});
            }
        },this)
    }

    private showGetCard(uuid){
        UI.createPopUp(ResConst.cardBig,{type:CardBigShowType.ActivityGetCard, cardUUid:uuid,fPos:null,tPos:null});
    }

}

export var Activity:ActivityAssist = ActivityAssist .getInstance();
    