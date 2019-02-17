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
    @property(LineUpUI)
    lineUpMine:LineUpUI = null;
    @property(cc.Button)
    changeLineUp:cc.Button = null;

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

    private _enemyListData:Array<any> = [];
    private _personalEnemyListData:Array<any> = [];
    
    onLoad () {
        this.enemyList.direction = DListDirection.Horizontal;
        this.personalEnemyList.direction = DListDirection.Horizontal;
    }

    onEnable(){
        this.changeLineUp.node.on(TouchHandler.TOUCH_CLICK,this.showLineup,this);
        this.helpButton.node.on(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        this.btnRefresh.node.on(TouchHandler.TOUCH_CLICK,this.onRefreshClick,this);
        this.btnRecords.node.on(cc.Node.EventType.TOUCH_START,this.onRecordsClick,this);

        EVENT.on(GameEvent.Lineup_Changed,this.onLineupChange,this);
        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Battle_scout_Complete,this.battleScoutComplete,this);
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.FightEnemey_Success,this.onFightEnemySuccess,this);
        EVENT.on(GameEvent.Battle_Info_Change,this.onBattleInfoChange,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        

        this.initView();
    }

    onDisable(){
        this.changeLineUp.node.off(TouchHandler.TOUCH_CLICK,this.showLineup,this);
        this.helpButton.node.off(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        this.btnRefresh.node.off(TouchHandler.TOUCH_CLICK,this.onRefreshClick,this);
        this.btnRecords.node.off(cc.Node.EventType.TOUCH_START,this.onRecordsClick,this);

        EVENT.off(GameEvent.Lineup_Changed,this.onLineupChange,this);
        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Battle_scout_Complete,this.battleScoutComplete,this);
        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.FightEnemey_Success,this.onFightEnemySuccess,this);
        EVENT.off(GameEvent.Battle_Info_Change,this.onBattleInfoChange,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);

        this.enemyList.setListData([]);
        this.personalEnemyList.setListData([]);
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
    private onLineupChange(e){
        this.initLineupMine();
    }

    private battleScoutComplete(e){
        this.initEnemyList();
    }
    private onBattleInfoChange(e){
        this.initBattleData();
    }
    private onFightEnemySuccess(e){
        var enemyInfo:EnemyInfo = e.detail.info as EnemyInfo;

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

    private initLineupMine(){
        this.lineUpMine.initLineup(Lineup.ownerLineupMap);
    }
    private initView(){
        this.initLineupMine();
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
        }
        else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "buildPanel_fightEnemy"){
            if(this._guideItem){
                this._guideItem.onAttackGuide();
            }
            GUIDE.nextGuide(guideId);
        }
    }
    // update (dt) {}
}
