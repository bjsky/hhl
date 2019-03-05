import { SPassageInfo, SResInfo } from "../../net/msg/MsgLogin";
import PassageInfo from "../../model/PassageInfo";
import BuildInfo from "../../model/BuildInfo";
import { BUILD } from "../build/BuildAssist";
import { BuildType } from "../../view/BuildPanel";
import { COMMON } from "../../CommonData";
import { NET } from "../../net/core/NetController";
import MsgCollectRes from "../../net/msg/MsgCollectRes";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { AwardTypeEnum } from "../../view/AwardPanel";
import { ResType } from "../../model/ResInfo";
import MsgFightBoss from "../../net/msg/MsgFightBoss";
import FightInfo, { FightPlayerType } from "../../model/FightInfo";
import LineupInfo from "../../model/LineupInfo";
import { CONSTANT } from "../../Constant";
import { GUIDE } from "../../manager/GuideManager";
import { Task, TaskType } from "../TaskAssist";

export default class PassageAssist{

    private static _instance: PassageAssist = null;
    public static getInstance(): PassageAssist {
        if (PassageAssist._instance == null) {
            PassageAssist._instance = new PassageAssist();
            
        }
        return PassageAssist._instance;
    }

    public passageInfo:PassageInfo = new PassageInfo();

    public initPassageInfo(info:SPassageInfo){
        this.passageInfo.initFromServer(info);
    }

    public updatePassageInfo(info:SPassageInfo){
        this.passageInfo.initFromServer(info);

        Task.updateGrowthReward();
        EVENT.emit(GameEvent.Passage_data_change,{});
    }
    //获取加成后的挂机资源
    public getPassageValueBuffed(value:number){
        var build:BuildInfo = BUILD.getBuildInfo(BuildType.Battle);
        if(build){
            var buffedValue = Number(build.buildLevelCfg.addValue);
            value *= (1 + buffedValue)
        }
        return value;
    }

    //当前未领取的金币
    public geUnCollectGold(){
        var addGoldPerMin = this.getPassageValueBuffed(this.passageInfo.passageCfg.passageGold);
        return this.passageInfo.getPassIncreaseTime() * addGoldPerMin/(1000*60);
    }
    //当前未领取的经验
    public getUnCollectExp(){
        var addExpPerMin = this.getPassageValueBuffed(this.passageInfo.passageCfg.passageExp);
        return this.passageInfo.getPassIncreaseTime() * addExpPerMin/(1000*60);
    }
    //当前未领取的灵石
    public getUnCollectStone(){
        var addStonePerMin = this.getPassageValueBuffed(this.passageInfo.passageCfg.passageStone);
        return this.passageInfo.getPassIncreaseTime() * addStonePerMin/(1000*60);
    }

    //是否可以领取挂机奖励
    public get isCanReceiveAward(){
        var needTime = CONSTANT.getPassCollectMinTime();
        var curTime = this.passageInfo.getPassIncreaseTime()/1000;
        console.log("挂机领取时间：",needTime,"，当前挂机时间：",curTime)
        return (GUIDE.isInGuide)?false:curTime >= needTime;
    }

    public collectRes(isGuide:boolean){
        NET.send(MsgCollectRes.create(isGuide),(msg:MsgCollectRes)=>{
            if(msg && msg.resp){
                COMMON.updateUserInfo(msg.resp.userInfo);
                Passage.updatePassageInfo(msg.resp.passageInfo);
                EVENT.emit(GameEvent.Passage_Collected);

                var cost:SResInfo = COMMON.updateResInfo(msg.resp.resInfo);
                EVENT.emit(GameEvent.Show_AwardPanel,{type:AwardTypeEnum.PassageCollect,
                    arr:[{type:ResType.gold,value:cost.gold},
                        {type:ResType.lifeStone,value:cost.lifeStone},
                        {type:ResType.exp,value:msg.resp.addExp},
                    ]})
                
                //完成任务
                Task.finishTask(TaskType.CollectRes);
            }
        },this)
    }


    public getBossFightInfo():FightInfo{
        var passCfg = this.passageInfo.passageCfg;
        var info:FightInfo = new FightInfo();
        info.playerType = FightPlayerType.Boss;
        info.playerUid ="";
        info.playerName ="关卡BOSS："  + passCfg.areaName;
        info.playerLevel = 1;
        info.playerSex = 1;
        info.playerIcon  = "";

        var lineupBoss:any  = {};
        var lineupPower:number = 0;
        var lineupIds:string = passCfg.amyHero;
        var lineupGradeLevel:string = passCfg.amyHeroGradeLv;
        if(lineupIds!=""){
            var ids:Array<string> = lineupIds.split(";");
            var lineup:LineupInfo;
            var gradeLvs:Array<string> = lineupGradeLevel.split("|");
            var gradelv:string;
            for(var i:number = 0;i<ids.length;i++){
                lineup = new LineupInfo();
                gradelv = gradeLvs[i];
                lineup.initBoss(i,Number(ids[i]),Number(gradelv.split(";")[0]),Number(gradelv.split(";")[1]));
                lineupBoss[i] = lineup;
                lineupPower += Number(lineup.power);
            }
        }
        info.lineup = lineupBoss;
        info.totalPower = lineupPower;
        return info;
    }

    //挑战boss成功
    public fightBossSuccess(cb:Function){
        NET.send(MsgFightBoss.create(this.passageInfo.passId),(msg:MsgFightBoss)=>{
            if(msg && msg.resp){
                COMMON.updateUserInfo(msg.resp.userInfo);
                Passage.updatePassageInfo(msg.resp.passageInfo);
                
                EVENT.emit(GameEvent.Passage_FightBossEnd);

                var cost:SResInfo = COMMON.updateResInfo(msg.resp.resInfo);
                cb && cb(cost,msg.resp.addExp);
                // EVENT.emit(GameEvent.Show_AwardPanel,{type:AwardTypeEnum.PassageCollect,
                //     arr:[{type:ResType.gold,value:cost.gold},
                //         {type:ResType.lifeStone,value:cost.lifeStone},
                //         {type:ResType.exp,value:msg.resp.addExp},
                //     ]})
                
                //完成任务
                Task.finishTask(TaskType.FightBoss);
            }
        },this)
    }
}

export var Passage = PassageAssist.getInstance();

