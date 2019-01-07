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
        return this.passageInfo.getCurPassIncreaseTime() * addGoldPerMin/(1000*60) +this.passageInfo.passUncollectGold;
    }
    //当前未领取的经验
    public getUnCollectExp(){
        var addExpPerMin = this.getPassageValueBuffed(this.passageInfo.passageCfg.passageExp);
        return this.passageInfo.getCurPassIncreaseTime() * addExpPerMin/(1000*60) +this.passageInfo.passUncollectExp;
    }
    //当前未领取的灵石
    public getUnCollectStone(){
        var addStonePerMin = this.getPassageValueBuffed(this.passageInfo.passageCfg.passageStone);
        return this.passageInfo.getCurPassIncreaseTime() * addStonePerMin/(1000*60) +this.passageInfo.passUncollectStone;
    }


    public collectRes(){
        NET.send(MsgCollectRes.create(),(msg:MsgCollectRes)=>{
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
            }
        },this)
    }
}

export var Passage = PassageAssist.getInstance();

