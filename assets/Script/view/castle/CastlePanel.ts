import UIBase from "../../component/UIBase";
import DList, { DListDirection } from "../../component/DList";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import LineUpUI from "../battle/LineUpUI";
import TouchHandler from "../../component/TouchHandler";
import { Lineup } from "../../module/battle/LineupAssist";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { Battle } from "../../module/battle/BattleAssist";
import StringUtil from "../../utils/StringUtil";
import { CONSTANT } from "../../Constant";
import { COMMON } from "../../CommonData";
import ResPanel, { ResPanelType } from "../ResPanel";
import { NET } from "../../net/core/NetController";
import MsgGetFightRecordList from "../../net/msg/MsgGetFightRecordList";
import { FightRecord } from "../../model/BattleInfo";
import EnemyInfo from "../../model/EnemyInfo";
import { GUIDE } from "../../manager/GuideManager";
import DListItem from "../../component/DListItem";
import FightItemUI from "./FightItemUI";
import EnmeyItemUI from "./EnemyItemUI";

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
export default class CastlePanel extends UIBase {

    @property(cc.Label)
    lblScore:cc.Label =null;
    @property(cc.RichText)
    lblActionPoint:cc.RichText =null;
    @property(cc.Node)
    revengeTimeNode:cc.Node =null;
    @property(cc.Node)
    revengeTipNode:cc.Node =null;
    @property(cc.Label)
    revengeTimeStr:cc.Label =null;
    @property(cc.ProgressBar)
    revengeTimeBar:cc.ProgressBar =null;
    @property(cc.Button)
    helpButton:cc.Button = null;

    @property(cc.Label)
    lblAddExp:cc.Label =null;
    @property(cc.Label)
    lblAddDiamond:cc.Label =null;

    @property(cc.Label)
    lblRefreshCost:cc.Label =null;
    @property(cc.Button)
    btnRefresh:cc.Button =null;
    @property(cc.Button)
    btnRecords:cc.Button =null;

    @property(DList)
    enemyList: DList= null;
    @property(DList)
    personalEnemyList: DList= null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Button)
    btnChangeLineup:cc.Button = null;

    private _enemyListData:Array<any> = [];
    private _personalEnemyListData:Array<any> = [];
    
    onLoad () {
        this.enemyList.direction = DListDirection.Horizontal;
        this.personalEnemyList.direction = DListDirection.Horizontal;
    }

    onEnable(){
        this.helpButton.node.on(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        this.btnRefresh.node.on(TouchHandler.TOUCH_CLICK,this.onRefreshClick,this);
        this.btnRecords.node.on(cc.Node.EventType.TOUCH_START,this.onRecordsClick,this);
        this.btnChangeLineup.node.on(cc.Node.EventType.TOUCH_START,this.changeLineup,this);

        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Battle_scout_Complete,this.battleScoutComplete,this);
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.FightEnemey_Success,this.onFightEnemySuccess,this);
        EVENT.on(GameEvent.Battle_data_Change,this.onBattleDataChange,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.on(GameEvent.Battle_refresh_personalEnemey,this.onRefreshPersonalEnemey,this);
        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);

        this.initView();
    }

    onDisable(){
        this.helpButton.node.off(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        this.btnRefresh.node.off(TouchHandler.TOUCH_CLICK,this.onRefreshClick,this);
        this.btnRecords.node.off(cc.Node.EventType.TOUCH_START,this.onRecordsClick,this);
        this.btnChangeLineup.node.off(cc.Node.EventType.TOUCH_START,this.changeLineup,this);

        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Battle_scout_Complete,this.battleScoutComplete,this);
        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.FightEnemey_Success,this.onFightEnemySuccess,this);
        EVENT.off(GameEvent.Battle_data_Change,this.onBattleDataChange,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.off(GameEvent.Battle_refresh_personalEnemey,this.onRefreshPersonalEnemey,this);
        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);

        if(!UI.showFighting){
            this.enemyList.setListData([]);
            this.personalEnemyList.setListData([]);
        }
    }
    private changeLineup(){
        UI.createPopUp(ResConst.LineUpPopup,{});
    }

    private onRefreshPersonalEnemey(e){
        this.initBattleData();
        this.initPersonalEnemyList();
    }
    private onRecordsClick(e){
        NET.send(MsgGetFightRecordList.create(COMMON.accountId),(msg:MsgGetFightRecordList)=>{
            if(msg && msg.resp){
                var records:Array<FightRecord> = Battle.updateFightRecords(COMMON.accountId,msg.resp.records);
                UI.createPopUp(ResConst.FightRecordPanel,{records:records});
            }
        },this)
    }

    private onHelpClick(e){
        UI.createPopUp(ResConst.BattleHelp,{});
    }
    private onPanelShowComplete(e){
        this.initEnemyList();
        this.initPersonalEnemyList();
    }

    private battleScoutComplete(e){
        this.initEnemyList();
    }
    private onBattleDataChange(e){
        this.initBattleData();
    }
    private onFightEnemySuccess(e){
        var enemyInfo:EnemyInfo = e.info as EnemyInfo;

    }
    private onBuildUpdate(e){
        this.initBattleData();
    }

    private _scoutCost:number = 0;
    private onRefreshClick(e){
        if(COMMON.resInfo.gold<this._scoutCost){
            ResPanel.show(ResPanelType.GoldNotEnough);
            return;
        }
        Battle.scoutEnemyList(this._scoutCost);
    }
    private showLineup(e){
        UI.createPopUp(ResConst.LineUpPopup,{});
    }

    private initView(){
        this.initBattleData();
        this._scoutCost = CONSTANT.getScoutCost();
        this.lblRefreshCost.string = StringUtil.formatReadableNumber(this._scoutCost);
    }

    private initBattleData(){
        this.lblScore.string = Battle.battleInfo.score.toString();
        this.lblActionPoint.string = "<color=#D73A3A><color=#29b92f>"+Battle.battleInfo.actionPoint+"</color>/"+Battle.battleInfo.totalAP+"</c>";
        var revengeTime:number = Battle.battleInfo.revengeTime;
        if(revengeTime>0){
            this.revengeTipNode.active = false;
            this.revengeTimeNode.active = true;
            this.updateRevengeTime();
            this.schedule(this.updateRevengeTime.bind(this),1);
        }else{
            this.revengeTipNode.active = true;
            this.revengeTimeNode.active = false;
        }
        this.lblAddExp.string = StringUtil.formatReadableNumber(Battle.getAddExpBuffed());
        this.lblAddDiamond.string = StringUtil.formatReadableNumber(Battle.getAddDiamondBuffed());
    }

    private updateRevengeTime(){
        var revengeTime:number = Battle.battleInfo.revengeTime;
        if(revengeTime<=0){
            this.unschedule(this.updateRevengeTime.bind(this));
            this.revengeTipNode.active = true;
            this.revengeTimeNode.active = false;
            return;
        }
        this.revengeTimeStr.string = StringUtil.formatTimeHMS(Math.floor(revengeTime/1000));
        this.revengeTimeBar.progress = Battle.battleInfo.revengeTimePro;
    }
    

    private initEnemyList(){
        var enemyList:EnemyInfo[] = Battle.enemyList.slice();
        if(GUIDE.isInGuide){
            var guideEnemy:EnemyInfo = new EnemyInfo();
            guideEnemy.initGuide();
            enemyList.shift();
            enemyList.unshift(guideEnemy);
        }
        this.enemyList.setListData(enemyList);
        this.scheduleOnce(()=>{
            this._enableGetGuideNode = true;
        },0.3)
    }
    
    private initPersonalEnemyList(){
        this.personalEnemyList.setListData(Battle.personalEnemyList);
    }
    start () {

    }

    ///////////////////
    // 引导
    ///////////////////
    private _enableGetGuideNode:boolean =false;
    private _guideItem:FightItemUI = null;
    private _enemyItem:EnmeyItemUI = null;
    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_fightEnemy"){
            if(this._enableGetGuideNode){
                this._guideItem = this.enemyList.getItemAt(0) as FightItemUI;
                if(this._guideItem){
                    return this._guideItem.getGuideNode(name);
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }else if(name == "buildPanel_refresh"){
            return this.btnRefresh.node;
        }else if(name == "buildPanel_fightRevenge"){
            if(Battle.personalEnemyList.length>0){
                this._enemyItem = this.personalEnemyList.getItemAt(0) as EnmeyItemUI;
                if(this._enemyItem){
                    return this._enemyItem.getGuideNode(name);
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }
        else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_fightEnemy"){
            if(this._guideItem){
                this._guideItem.onAttackGuide();
            }
            GUIDE.nextGuide(guideId);
        }
    }

    private onGuideWeakTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_fightEnemy"){
            if(this._guideItem){
                this._guideItem.onAttack();
            }
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName == "buildPanel_fightRevenge"){
            if(this._enemyItem){
                this._enemyItem.onShowDetail();
            }
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName =="buildPanel_refresh"){
            this.onRefreshClick(e);
            GUIDE.nextWeakGuide(guideId);
        }
    }
    // update (dt) {}
}
