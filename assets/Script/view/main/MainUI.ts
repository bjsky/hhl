import UIBase from "../../component/UIBase";
import { COMMON } from "../../CommonData";
import StringUtil from "../../utils/StringUtil";
import TouchHandler from "../../component/TouchHandler";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import ResBounceEffect from "../../component/ResBounceEffect";
import ExpLevelEffect from "../../component/ExpLevelEffect";
import LoadSprite from "../../component/LoadSprite";
import { WeiXin } from "../../wxInterface";
import { SOUND } from "../../manager/SoundManager";
import PathUtil from "../../utils/PathUtil";
import ResPanel, { ResPanelType } from "../ResPanel";
import { CONSTANT } from "../../Constant";
import { Share } from "../../module/share/ShareAssist";
import { Card } from "../../module/card/CardAssist";
import { GLOBAL } from "../../GlobalData";
import { TaskViewSelect } from "../task/TaskPanel";
import { Task } from "../../module/TaskAssist";
import { GUIDE } from "../../manager/GuideManager";
import { Activity } from "../../module/ActivityAssist";

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
export default class MainUI extends UIBase {

    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    sideNode: cc.Node = null;
    @property(cc.Node)
    sideRNode: cc.Node = null;

    @property(cc.Label)
    lblName: cc.Label = null;
    @property(cc.Label)
    labelLv: cc.Label = null;
    @property(cc.Label)
    lblExp: cc.Label = null;
    @property(cc.Label)
    lblGold: cc.Label = null;
    @property(cc.Label)
    lblDiamond: cc.Label = null;
    @property(cc.Label)
    lblLifeStone: cc.Label = null;
    @property(cc.Button)
    btnAddGold: cc.Button = null;
    @property(cc.Button)
    btnAddStone: cc.Button = null;
    @property(cc.Button)
    btnDiamondStore: cc.Button = null;
    @property(cc.ProgressBar)
    progressExp: cc.ProgressBar = null;

    @property(cc.Button)
    taskBtn: cc.Button = null;
    @property(cc.Node)
    nodeTaskRed:cc.Node = null;
    @property(cc.Node)
    nodeTaskHand:cc.Node = null;
    @property(cc.Button)
    rankBtn: cc.Button = null;
    @property(cc.Button)
    soundBtn: cc.Button = null;
    @property(LoadSprite)
    soundIcon: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:
    @property(ResBounceEffect)
    goldEffect: ResBounceEffect = null;
    @property(ResBounceEffect)
    diamondEffect: ResBounceEffect = null;
    @property(ResBounceEffect)
    stoneEffect: ResBounceEffect = null;

    @property(ExpLevelEffect)
    explevelEffect:ExpLevelEffect = null;

    @property(LoadSprite)
    headIcon:LoadSprite = null;
    @property(cc.Button)
    btnShare:cc.Button = null;
    @property(cc.Node)
    nodeShareRed:cc.Node = null;
    @property(cc.Button)
    btnSevenDay:cc.Button = null;
    @property(cc.Node)
    nodeSevendayRed:cc.Node = null;
    @property(cc.Button)
    btnStore:cc.Button = null;
    @property(cc.Node)
    nodeStoreRed:cc.Node = null;
    @property(cc.Button)
    btnIntro:cc.Button = null;

    @property(cc.Node)
    nodeGrowth:cc.Node = null;
    @property(cc.Label)
    labelGrowth:cc.Label = null;

    private _topPos:cc.Vec2 =cc.v2(0,0);
    onLoad () {

        if(GLOBAL.isIPhoneX){
            this._topPos = cc.v2(0,-GLOBAL.statusBarHeight);
        }
        this.initTopView();

        this.nodeTaskHand.active =false;
        this.nodeGrowth.active =false;
        this.nodeSevendayRed.active = false;
        this.nodeShareRed.active = false;
        this.nodeStoreRed.active =false;
        this.nodeTaskRed.active = false;
        WeiXin.createGameClubButton();
        UI.main = this;
    }

    start () {
        if(this._showAction){
            this.topNode.setPosition(cc.v2(0,250));
            this.topNode.runAction(cc.moveTo(0.15,this._topPos));
            this.bottomNode.setPosition(cc.v2(0,-200));
            this.bottomNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.sideNode.setPosition(cc.v2(-500,0));
            this.sideNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.sideRNode.setPosition(cc.v2(200,0));
            this.sideRNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
        }
    }

    private _showAction:boolean = false;
    public setData(data:any){
        this._showAction = data.showAction;
    }

    private initTopView(){
        this.lblName.string = COMMON.userInfo.name;
        this.headIcon.load(COMMON.userInfo.icon);
        // this.lblExp.string = COMMON.userInfo.exp + " / "+COMMON.userInfo.totalExp;
        this.lblGold.string = StringUtil.formatReadableNumber(COMMON.resInfo.gold);
        this.lblDiamond.string = StringUtil.formatReadableNumber(COMMON.resInfo.diamond);
        this.lblLifeStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
        this.soundIcon.load(PathUtil.getSoundIcon(SOUND.getBgMusicSwitch()));
        // this.lblSoulStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.soulStone);
        // this.progressExp.progress = COMMON.userInfo.exp / COMMON.userInfo.totalExp;
        
        // this.labelLv.string = COMMON.userInfo.level.toString();

        this.explevelEffect.initProgress(COMMON.userInfo.exp,COMMON.userInfo.totalExp,COMMON.userInfo.level);
    }
    
    private _growthLabelIndex:number = 0;
    private playGrowth(){
        this.nodeGrowth.active = true;
        this.nodeGrowth.scaleY = 0;
        if(Task.taskInfo.growthNameArr.length>0){
            var seq = cc.sequence(
                cc.callFunc(()=>{
                    this.labelGrowth.string = Task.taskInfo.growthNameArr[this._growthLabelIndex];
                    this.labelGrowth.node.parent.width = this.labelGrowth.node.width+100;
                }),
                cc.scaleTo(0.3,1,1.2),
                cc.scaleTo(0.1,1,1),
                cc.delayTime(15),
                cc.scaleTo(0.1,1,1.2),
                cc.scaleTo(0.3,1,0),
                cc.delayTime(60),
                cc.callFunc(()=>{
                    if(Task.taskInfo.growthNameArr.length>0){
                        if(this._growthLabelIndex>=Task.taskInfo.growthNameArr.length-1){
                            this._growthLabelIndex = 0;
                        }else{
                            this._growthLabelIndex ++;
                        }
                    }else{
                        this.nodeGrowth.stopAllActions();
                    }
                })
            )
            this.nodeGrowth.runAction(seq.repeatForever());
        }
    }

    // private _taskFreeTime:number =15;
    // private onTaskFreeSchedule(){
    //     if(GUIDE.isInGuide || GUIDE.isInWeakGuide){
    //         return;
    //     }
    //     this.nodeTaskHand.active = true;
    //     this.nodeTaskHand.runAction(cc.sequence(
    //         cc.moveBy(0.5,cc.v2(0,30))
    //         ,cc.moveBy(0.5,cc.v2(0,-30))
    //         ).repeatForever());
    // }
    // public resetTaskGuide(){
    //     this.nodeTaskHand.active =false;
    //     this.nodeTaskHand.stopAllActions();
    //     this.unschedule(this.onTaskFreeSchedule);
    //     this.scheduleOnce(this.onTaskFreeSchedule,this._taskFreeTime);
    // }

    private resUpdateCost(e){
        var types:any[] = e.detail.types;
        var absVal:number = 0;
        types.forEach((obj)=>{
            switch(obj.type){
                case ResType.gold:{
                    this.lblGold.string = StringUtil.formatReadableNumber(COMMON.resInfo.gold);
                    absVal = Math.abs(obj.value);
                    if(absVal>0){
                        UI.showTipCustom(ResConst.CostTipPanel,"-"+StringUtil.formatReadableNumber(absVal),this.lblGold.node.parent.convertToWorldSpaceAR(this.lblGold.node.position));
                    }
                }break;
                case ResType.lifeStone:{
                    this.lblLifeStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
                    absVal = Math.abs(obj.value);
                    if(absVal>0){
                        UI.showTipCustom(ResConst.CostTipPanel,"-"+StringUtil.formatReadableNumber(absVal),this.lblLifeStone.node.parent.convertToWorldSpaceAR(this.lblLifeStone.node.position));
                    }
                }break;
                case ResType.diamond:{
                    this.lblDiamond.string = StringUtil.formatReadableNumber(COMMON.resInfo.diamond);
                    absVal = Math.abs(obj.value);
                    if(absVal>0){
                        UI.showTipCustom(ResConst.CostTipPanel,"-"+StringUtil.formatReadableNumber(absVal),this.lblDiamond.node.parent.convertToWorldSpaceAR(this.lblDiamond.node.position));
                    }
                }break;
            }
        })

    }

    private showResAddAni(e) {
        var types:any[] = e.detail.types;
        types.forEach(obj => {
            if(obj.type == ResType.gold){
                this.lblGold.string = StringUtil.formatReadableNumber(COMMON.resInfo.gold);
                this.goldEffect.play();
            }else if(obj.type == ResType.diamond){
                this.lblDiamond.string = StringUtil.formatReadableNumber(COMMON.resInfo.diamond);
                this.diamondEffect.play();
            }else if(obj.type == ResType.lifeStone){
                this.lblLifeStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
                this.stoneEffect.play();
            }else if(obj.type == ResType.exp){
                this.explevelEffect.playProgressAnim(COMMON.userInfo.exp,COMMON.userInfo.totalExp,COMMON.userInfo.level);
            }
        });
    }

    private showAwardPop(e){
        var data = e.detail;
        UI.createPopUp(ResConst.AwardPanel,data);
    }

    onEnable(){
        this.lblExp.node.on(cc.Node.EventType.TOUCH_START,this.onLabelExpTouch,this);
        this.btnShare.node.on(cc.Node.EventType.TOUCH_START,this.onShare,this);
        this.btnStore.node.on(cc.Node.EventType.TOUCH_START,this.onStoreBtnTouch,this);
        this.taskBtn.node.on(cc.Node.EventType.TOUCH_START,this.onTaskBtnTouch,this);
        this.rankBtn.node.on(cc.Node.EventType.TOUCH_START,this.onRankBtnTouch,this);
        this.soundBtn.node.on(TouchHandler.TOUCH_CLICK,this.onSoundClick,this);
        this.btnAddGold.node.on(cc.Node.EventType.TOUCH_START,this.onAddGold,this);
        this.btnAddStone.node.on(cc.Node.EventType.TOUCH_START,this.onAddStone,this);
        this.btnDiamondStore.node.on(cc.Node.EventType.TOUCH_START,this.onDiamondStore,this);
        this.headIcon.node.on(cc.Node.EventType.TOUCH_START,this.onHeadTouch,this);
        this.btnIntro.node.on(cc.Node.EventType.TOUCH_START,this.onIntroClick,this);
        this.btnSevenDay.node.on(cc.Node.EventType.TOUCH_START,this.onSevendayClick,this);
        this.nodeGrowth.on(cc.Node.EventType.TOUCH_START,this.onGrowthNodeTouch,this);

        EVENT.on(GameEvent.Res_update_Cost_Complete,this.resUpdateCost,this);
        EVENT.on(GameEvent.Show_AwardPanel,this.showAwardPop,this);
        EVENT.on(GameEvent.Show_Res_Add,this.showResAddAni,this);
        EVENT.on(GameEvent.Res_Data_Change,this.onResDataChange,this);
        EVENT.on(GameEvent.ShareGetReward_Complete,this.onShareComplete,this);
        EVENT.on(GameEvent.Guide_End,this.onGuideEnd,this);
        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onWeakGuideTouch,this);
        EVENT.on(GameEvent.SevendayReceived,this.onSevendayReceived,this);
        EVENT.on(GameEvent.TaskUpdate,this.onTaskUpdate,this);
        EVENT.on(GameEvent.TaskActiveReceived,this.onTaskReceived,this);
        EVENT.on(GameEvent.TaskGrowthReceived,this.onTaskReceived,this);
        EVENT.on(GameEvent.TaskGrowthUpdate,this.onTaskUpdate,this);


        if(!GUIDE.isInGuide){
            this.initView();
        }
    }
    private initView(){
        this.initRedPoint();
        this.playGrowth();
        // this.resetTaskGuide();
    }

    onDisable(){
        this.lblExp.node.off(cc.Node.EventType.TOUCH_START,this.onLabelExpTouch,this);
        this.btnShare.node.off(cc.Node.EventType.TOUCH_START,this.onShare,this);
        this.btnStore.node.off(cc.Node.EventType.TOUCH_START,this.onStoreBtnTouch,this);
        this.taskBtn.node.off(cc.Node.EventType.TOUCH_START,this.onTaskBtnTouch,this)
        this.rankBtn.node.off(cc.Node.EventType.TOUCH_START,this.onRankBtnTouch,this);
        this.soundBtn.node.off(TouchHandler.TOUCH_CLICK,this.onSoundClick,this);
        this.btnAddGold.node.off(cc.Node.EventType.TOUCH_START,this.onAddGold,this);
        this.btnAddStone.node.off(cc.Node.EventType.TOUCH_START,this.onAddStone,this);
        this.btnDiamondStore.node.off(cc.Node.EventType.TOUCH_START,this.onDiamondStore,this);
        this.headIcon.node.off(cc.Node.EventType.TOUCH_START,this.onHeadTouch,this);
        this.btnIntro.node.off(cc.Node.EventType.TOUCH_START,this.onIntroClick,this);
        this.btnSevenDay.node.off(cc.Node.EventType.TOUCH_START,this.onSevendayClick,this);
        this.nodeGrowth.off(cc.Node.EventType.TOUCH_START,this.onGrowthNodeTouch,this);

        EVENT.off(GameEvent.Res_update_Cost_Complete,this.resUpdateCost,this);
        EVENT.off(GameEvent.Show_AwardPanel,this.showAwardPop,this);
        EVENT.off(GameEvent.Show_Res_Add,this.showResAddAni,this);
        EVENT.off(GameEvent.Res_Data_Change,this.onResDataChange,this);
        EVENT.off(GameEvent.ShareGetReward_Complete,this.onShareComplete,this);
        EVENT.off(GameEvent.Guide_End,this.onGuideEnd,this);
        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onWeakGuideTouch,this);
        EVENT.off(GameEvent.SevendayReceived,this.onSevendayReceived,this);
        EVENT.off(GameEvent.TaskUpdate,this.onTaskUpdate,this);
        EVENT.off(GameEvent.TaskActiveReceived,this.onTaskReceived,this);
        EVENT.off(GameEvent.TaskGrowthReceived,this.onTaskReceived,this);
        EVENT.off(GameEvent.TaskGrowthUpdate,this.onTaskUpdate,this);
    }

    private initRedPoint(){
        this.nodeShareRed.active = !GUIDE.isInGuide && Share.canShareGetReward;
        this.nodeStoreRed.active = !GUIDE.isInGuide && Card.isCanBuyCard;
        this.nodeSevendayRed.active = !GUIDE.isInGuide && Activity.isSevendayShowRed;
        this.nodeTaskRed.active = !GUIDE.isInGuide && Task.isShowRed;
    }

    private onTaskUpdate(e){
        this.initRedPoint();
    }

    private onTaskReceived(e){
        this.initRedPoint();
    }

    private onSevendayReceived(e){
        this.initRedPoint();
    }

    private onResDataChange(e){
        this.initRedPoint();
    }

    private onShareComplete(e){
        this.initRedPoint();
    }

    private onGuideEnd(e){
        this.initView();
    }
    private _showLabelExp:boolean = true;
    private onLabelExpTouch(e){
        this._showLabelExp = !this._showLabelExp;
        this.lblExp.node.runAction(this._showLabelExp?cc.fadeIn(0.15):cc.fadeOut(0.15));
    }
    // update (dt) {}
    private onHeadTouch(e){
        var accountStr:string = "用户ID:";
        accountStr += COMMON.accountId;
        UI.showAlert(accountStr);
    }
    private onIntroClick(e){
        UI.createPopUp(ResConst.IntroPanel,{});
    }

    private onTaskBtnTouch(e){
        // this.resetTaskGuide();
        // UI.showAlert("功能暂未开放，敬请期待！",null,null,AlertBtnType.OKAndCancel);
        UI.createPopUp(ResConst.TaskPanel,{view:TaskViewSelect.EvenyDayActive});
    }

    private onSevendayClick(e){
        UI.createPopUp(ResConst.SevenDayPanel,{});
    }

    private onGrowthNodeTouch(e){
        UI.createPopUp(ResConst.TaskPanel,{view:TaskViewSelect.GrowthReward});
    }

    private onStoreBtnTouch(e){
        // UI.createPopUp(ResConst.SevenDayPanel,{});
        UI.createPopUp(ResConst.StorePanel,{});
    }

    private onRankBtnTouch(e){
        var openLevel:number = CONSTANT.getRankShowLevel();
        if(COMMON.userInfo.level<openLevel){
            UI.showTip("排行榜"+openLevel+"级开启");
            return;
        }
        UI.createPopUp(ResConst.RankPanel,{});
        // UI.createPopUp(ResConst.LevelupPanel,{});
    }

    private onShare(e){
        UI.createPopUp(ResConst.sharePanel,{});
    }

    private onSoundClick(e){
        SOUND.SetBgMuiscOpenClose();
        this.soundIcon.load(PathUtil.getSoundIcon(SOUND.getBgMusicSwitch()));
    }

    private onAddGold(e){
        ResPanel.show(ResPanelType.GoldRes);
    }
    private onAddStone(e){
        ResPanel.show(ResPanelType.StoneRes);
    }
    private onDiamondStore(e){
        UI.createPopUp(ResConst.StorePanel,{});
    }


    ////////////////Guide//////////////////
    public getGuideNode(name:string):cc.Node{
        if(name == "ui_share"){
            return this.btnShare.node;
        }else if(name == "ui_getGold"){
            return this.btnAddGold.node;
        }else if(name == "ui_getStone"){
            return this.btnAddStone.node;
        }else if(name == "ui_diamondStore"){
            return this.btnStore.node;
        }else if(name == "ui_task"){
            return this.taskBtn.node;
        }else{
            return null;
        }
    }

    public onWeakGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "ui_share"){
            this.onShare(null);
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName =="ui_getGold"){
            this.onAddGold(null);
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName =="ui_getStone"){
            this.onAddStone(null);
            GUIDE.nextWeakGuide(guideId);
        }else if(nodeName =="ui_diamondStore"){
            this.onStoreBtnTouch(null);
            GUIDE.nextWeakGuide(guideId);
        }
        else if(nodeName =="ui_task"){
            this.onTaskBtnTouch(null);
            GUIDE.nextWeakGuide(guideId);
        }
    }
}
