import UIBase from "../../component/UIBase";
import { Passage } from "../../module/battle/PassageAssist";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import PassageFly from "./PassageFly";
import StringUtil from "../../utils/StringUtil";
import TouchHandler from "../../component/TouchHandler";
import Constant, { CONSTANT } from "../../Constant";
import { UI } from "../../manager/UIManager";
import LineUpUI from "./LineUpUI";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { Lineup } from "../../module/battle/LineupAssist";
import { Fight } from "../../module/fight/FightAssist";
import FightInfo from "../../model/FightInfo";
import { GUIDE } from "../../manager/GuideManager";
import { AwardTypeEnum } from "../AwardPanel";
import { ResType } from "../../model/ResInfo";
import { Task, TaskType } from "../../module/TaskAssist";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattlePanel extends UIBase {

    @property(cc.Label)
    lblPassageGold:cc.Label = null;
    @property(cc.Label)
    lblPassageExp:cc.Label = null;
    @property(cc.Label)
    lblPassageStone:cc.Label = null;

    @property(cc.Label)
    lblCurGold:cc.Label = null;
    @property(cc.Label)
    lblCurExp:cc.Label = null;
    @property(cc.Label)
    lblCurStone:cc.Label = null;
    
    @property(cc.Label)
    lblPassName:cc.Label = null;

    @property(cc.Button)
    btnCollect:cc.Button = null;

    @property(PassageFly)
    goldFly:PassageFly = null;
    @property(PassageFly)
    stoneFly:PassageFly = null;
    @property(PassageFly)
    expFly:PassageFly = null;
    // LIFE-CYCLE CALLBACKS:


    @property(LineUpUI)
    lineUpMine:LineUpUI = null;
    @property(LineUpUI)
    lineUpBoss:LineUpUI = null;
    @property(cc.Button)
    changeLineUp:cc.Button = null;
    @property(cc.Button)
    btnFight:cc.Button = null;
    @property(cc.Label)
    bossGold:cc.Label = null;
    @property(cc.Label)
    bossStone:cc.Label = null;
    @property(cc.Label)
    bossExp:cc.Label = null;

    @property(cc.Label)
    bossFinished:cc.Label = null;
    @property(cc.Node)
    bossNode:cc.Node = null;
    
    // onLoad () {}

    start () {

    }

    onEnable(){
        this.initView();
        this.btnCollect.node.on(TouchHandler.TOUCH_CLICK,this.collectRes,this);
        this.changeLineUp.node.on(TouchHandler.TOUCH_CLICK,this.showLineup,this);
        this.btnFight.node.on(TouchHandler.TOUCH_CLICK,this.onFightBoss,this);

        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.Passage_Collected,this.onPassageCollectd,this);
        EVENT.on(GameEvent.Passage_FightBossEnd,this.onPassageFightBossEnd,this);
        EVENT.on(GameEvent.Lineup_Changed,this.onLineupChange,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);

        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);
    }

    onDisable(){
        this.btnCollect.node.off(TouchHandler.TOUCH_CLICK,this.collectRes,this);
        this.changeLineUp.node.off(TouchHandler.TOUCH_CLICK,this.showLineup,this);
        this.btnFight.node.off(TouchHandler.TOUCH_CLICK,this.onFightBoss,this);

        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.Passage_Collected,this.onPassageCollectd,this);
        EVENT.off(GameEvent.Passage_FightBossEnd,this.onPassageFightBossEnd,this);
        EVENT.off(GameEvent.Lineup_Changed,this.onLineupChange,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);

        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);

        this.unscheduleAllCallbacks();
        this.goldFly.reset();
        this.expFly.reset();
        this.stoneFly.reset();
    }

    private onBuildUpdate(e){
        this.initPassageleftView();
    }

    private onPassageCollectd(e){
        this.initPassageTopView();
    }
    private onPassageFightBossEnd(e){
        this.initPassageleftView();
        this.initLineupBoss();
    }

    private onLineupChange(e){
        this.initLineupMine();
    }

    private showLineup(e){
        UI.createPopUp(ResConst.LineUpPopup,{});
    }

    private onFightBoss(e){
        var infoMine:FightInfo = Lineup.getOwnerFightInfo();
        if(infoMine.totalPower == 0){
            UI.showAlert("请先上阵英雄");
            return;
        }
        Fight.showFight(infoMine,this._bossFightInfo);
    }

    private collectRes(e){
        if(!GUIDE.isInGuide){
            var needTime = CONSTANT.getPassCollectMinTime();
            var curTime = Passage.passageInfo.getPassIncreaseTime()/1000;
            if(curTime < needTime){
                UI.showTip(""+Math.floor(needTime-curTime)+"秒后可领取");
                return;
            }
        }
        // Passage.collectRes(GUIDE.isInGuide);
        EVENT.emit(GameEvent.Show_AwardPanel,{type:AwardTypeEnum.PassageCollect,
            arr:[{type:ResType.gold,value:this._curGold},
                {type:ResType.lifeStone,value:this._curStone},
                {type:ResType.exp,value:this._curExp},
            ]})
    }


    private _curGold:number = 0;
    private _curExp:number = 0;
    private _curStone:number = 0;
    private initView(){
        this.initPassageleftView();
        this.initPassageTopView();
        this.initLineupMine();
        this.initLineupBoss();
    }


    private _passGoldPM:number = 0;
    private _passExpPM:number = 0;
    private _passStonePM:number = 0;

    private _passGoldPS:number = 0;
    private _passExpPS:number = 0;
    private _passStonePS:number = 0;
    private initPassageleftView(){
        if(Passage.passageInfo.passageCfg){
            this._passExpPM = Passage.getPassageValueBuffed(Passage.passageInfo.passageCfg.passageExp);
            this._passGoldPM = Passage.getPassageValueBuffed(Passage.passageInfo.passageCfg.passageGold);
            this._passStonePM = Passage.getPassageValueBuffed(Passage.passageInfo.passageCfg.passageStone);
            this._passGoldPS =(this._passGoldPM * this._interval)/60;
            this._passExpPS =(this._passExpPM * this._interval)/60;
            this._passStonePS =(this._passStonePM * this._interval)/60;

            this.lblPassageExp.string = StringUtil.formatReadableNumber(this._passExpPM)+"/分";
            this.lblPassageGold.string = StringUtil.formatReadableNumber(this._passGoldPM)+"/分";
            this.lblPassageStone.string = StringUtil.formatReadableNumber(this._passStonePM)+"/分";

            this.lblPassName.string = Passage.passageInfo.passageCfg.areaName;
        }
    }

    private _interval:number = 3;
    private initPassageTopView(){
        this._curGold = Number(Math.floor(Passage.geUnCollectGold()).toFixed(0));
        this._curExp = Number(Math.floor(Passage.getUnCollectExp()).toFixed(0));
        this._curStone = Number(Math.floor(Passage.getUnCollectStone()).toFixed(0));
        this.setPassageTopLabels();
        this.schedule(this.showPassageAddEffect,this._interval);
    }

    private setPassageTopLabels(){
        // console.log("collect:",this._curGold,this._curStone,this._curExp);
        this.lblCurGold.string = StringUtil.formatReadableNumber(this._curGold.toString());
        this.lblCurExp.string = StringUtil.formatReadableNumber(this._curExp.toString());
        this.lblCurStone.string = StringUtil.formatReadableNumber(this._curStone.toString());
    }

    private showPassageAddEffect(){
        var max = CONSTANT.getPassIncreaseMaxTime()*1000;
        if(Passage.passageInfo.getPassIncreaseTime()>=max){
            this.unschedule(this.showPassageAddEffect);
            return;
        }
        var addGold = this.goldFly.playEffect(this._passGoldPS);
        this._curGold += addGold;
        var addExp = this.expFly.playEffect(this._passExpPS);
        this._curExp += addExp;
        var addStone = this.stoneFly.playEffect(this._passStonePS);
        this._curStone += addStone;
        this.setPassageTopLabels();
        
    }

    private initLineupMine(){
        this.lineUpMine.initLineup(Lineup.ownerLineupMap);
    }

    private _bossFightInfo:FightInfo = null;;
    private initLineupBoss(){
        if(Passage.passageInfo.isMaxPassage){
            this.bossNode.active = false;
            this.bossFinished.node.active = true;
        }else{
            this.bossFinished.node.active = false;
            this.bossNode.active = true;
            this._bossFightInfo = Passage.getBossFightInfo();
            this.lineUpBoss.initLineup(this._bossFightInfo.lineup);
            this.bossGold.string = StringUtil.formatReadableNumber(Passage.passageInfo.passageCfg.firstGold);
            this.bossStone.string = StringUtil.formatReadableNumber(Passage.passageInfo.passageCfg.firstStone);
            this.bossExp.string = StringUtil.formatReadableNumber(Passage.passageInfo.passageCfg.firstExp);
        }
    }

    ///////////////////
    // 引导
    ///////////////////

    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_lineup"){
            return this.changeLineUp.node;
        }else if(name == "buildPanel_fight"){
            return this.btnFight.node;
        }else if(name == "buildPanel_getRes"){
            return this.btnCollect.node;
        }
        else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "buildPanel_lineup"){
            this.showLineup(null);
            GUIDE.nextGuide(guideId);
        }else if(nodeName == "buildPanel_fight"){
            this.onFightBoss(null);
            GUIDE.nextGuide(guideId);
        }else if(nodeName == "buildPanel_getRes"){
            this.collectRes(null);
            GUIDE.nextGuide(guideId);
        }

    }

    private onGuideWeakTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "buildPanel_lineup"){
            this.showLineup(null);
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName == "buildPanel_fight"){
            this.onFightBoss(null);
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName == "buildPanel_getRes"){
            this.collectRes(null);
            GUIDE.nextWeakGuide(guideId);
        }
    }
    // update (dt) {}
}
