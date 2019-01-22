import LoadSprite from "../../component/LoadSprite";
import PopUpBase from "../../component/PopUpBase";
import FlowGroup from "../../component/FlowGroup";
import TouchHandler from "../../component/TouchHandler";
import { Fight } from "../../module/fight/FightAssist";
import { FightResult } from "../../module/fight/FightLogic";
import PathUtil from "../../utils/PathUtil";
import FightInfo, { FightPlayerType } from "../../model/FightInfo";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { GUIDE } from "../../manager/GuideManager";
import { WeiXin } from "../../wxInterface";
import { Share } from "../../module/share/ShareAssist";
import { SOUND, SoundConst } from "../../manager/SoundManager";

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
export default class FightResultPanel extends PopUpBase {

    @property(cc.Node)
    victoryNode: cc.Node = null;
    @property(cc.Node)
    failNode: cc.Node = null;
    @property(cc.Node)
    rewardNode: cc.Node = null;
    @property(cc.Node)
    detailNode: cc.Node = null;
    @property(LoadSprite)
    sprReceive: LoadSprite = null;
    @property(cc.Button)
    btnReceive: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    
    @property(cc.Button)
    btnDetail: cc.Button = null;
    @property(cc.Button)
    btnBack: cc.Button = null;
    @property(LoadSprite)
    sprStar: LoadSprite = null;
    @property(FlowGroup)
    groupReward:FlowGroup = null;
    @property(cc.Node)
    fightReward:cc.Node = null;
    @property(cc.Node)
    bossFailed:cc.Node = null;


    @property(LoadSprite)
    headMine: LoadSprite = null;
    @property(LoadSprite)
    headEnemy: LoadSprite = null;
    @property(cc.Label)
    nameMine: cc.Label = null;
    @property(cc.Label)
    nameEnemy: cc.Label = null;

    @property(cc.RichText)
    detailText:cc.RichText = null;
    @property(cc.ScrollView)
    detailScroll:cc.ScrollView = null;

    @property(cc.Button)
    btnShare: cc.Button = null;
    // LIFE-CYCLE CALLBACKS:

    private _result:FightResult = null;
    private _fightMine:FightInfo = null;
    private _fightEnemy:FightInfo = null;
    private _rewards:Array<any> =[];
    public setData(data:any){
        super.setData(data);
        this._result = data.result;
        this._fightMine = data.fightMine;
        this._fightEnemy = data.fightEnemy;
        this._rewards = data.rewards;
    }
    onLoad(){
        this.btnBack.node.active = false;
        this.detailNode.active = false;
        this._showDetail = false;
    }

    onEnable(){
        super.onEnable();
        this.btnReceive.node.on(TouchHandler.TOUCH_CLICK,this.onReceiveClick,this);
        this.btnClose.node.on(TouchHandler.TOUCH_CLICK,this.onCloseClick,this);
        this.btnDetail.node.on(cc.Node.EventType.TOUCH_START,this.onShowDetail,this);
        this.btnBack.node.on(cc.Node.EventType.TOUCH_START,this.onBackReward,this);
        this.btnShare.node.on(TouchHandler.TOUCH_CLICK,this.onShare,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        this.initView();
    }
    onDisable(){
        super.onDisable();
        this.btnReceive.node.off(TouchHandler.TOUCH_CLICK,this.onReceiveClick,this);
        this.btnClose.node.off(TouchHandler.TOUCH_CLICK,this.onCloseClick,this);
        this.btnDetail.node.off(cc.Node.EventType.TOUCH_START,this.onShowDetail,this);
        this.btnBack.node.off(cc.Node.EventType.TOUCH_START,this.onBackReward,this);
        this.btnShare.node.off(TouchHandler.TOUCH_CLICK,this.onShare,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
    }

    private _showDetail:boolean =false;
    private onShowDetail(e){
        this.showDetail(true);
    }
    private onBackReward(e){
        this.showDetail(false);
    }
    private onReceiveClick(e){
        EVENT.emit(GameEvent.Show_Res_Add,{types:this._rewards});
        this.closeEndFight(e);
    }
    private onCloseClick(e){
        this.closeEndFight(e);
    }

    private onShare(e){
        Share.shareAppMessage();
    }
    
    private closeEndFight(e){
        this.onClose(e);

        SOUND.playBgSound(SoundConst.Bg_sound);
        Fight.endFight();
    }
    start () {

    }

    private initView(){
        this.victoryNode.active = this._result.victory;
        this.failNode.active = !this._result.victory;

        if(this._result.evaluate>0){
            this.sprStar.load(PathUtil.getResultEvalUrl(this._result.evaluate));
        }else{
            this.sprStar.load("");
        }
        this.nameMine.string = this._fightMine.playerName;
        this.headMine.load(this._fightMine.playerIcon);
        this.nameEnemy.string = this._fightEnemy.playerName;
        this.headEnemy.load(this._fightEnemy.playerIcon);

        this.detailText.string = this._result.getHtmlDesc();

        this.sprReceive.load(PathUtil.getResultRewardTitleUrl(this._result.victory));
        if(!this._result.victory && this._fightEnemy.playerType == FightPlayerType.Boss){ //挑战boss失败
            this.groupReward.setGroupData([]);
            this.fightReward.active = false;
            this.bossFailed.active = true;
        }else{
            this.fightReward.active = true;
            this.bossFailed.active = false;
            this.groupReward.setGroupData(this._rewards);
            this.btnShare.node.active = Share.shareEnable;
        }
    }

    private showDetail(show:boolean){
        this._showDetail = show;
        if(this._showDetail){
            this.btnDetail.node.active = false;
            this.btnBack.node.active = true;
            this.detailNode.active = true;
            this.detailNode.runAction(cc.fadeIn(0.3));
            this.rewardNode.runAction(cc.fadeOut(0.3));
            this.detailScroll.setContentPosition(cc.v2(0,0))
        }else{
            this.btnDetail.node.active = true;
            this.btnBack.node.active = false;
            this.detailNode.runAction(cc.sequence(cc.fadeOut(0.3),cc.callFunc(()=>{
                this.detailNode.active = false;
            })));
            this.rewardNode.runAction(cc.fadeIn(0.3));
        }
    }


    protected onShowComplete(){
        super.onShowComplete();
        this._enableGetGuideNode = true;
        SOUND.stopBgSound();
        if(this._result.victory){
            SOUND.playFightWinSound();
        }else{
            SOUND.playFightFailSound();
        }
    }
    ///////////////////
    // 引导
    ///////////////////
    private _enableGetGuideNode:boolean =false;
    public getGuideNode(name:string):cc.Node{
        if(name == "popup_resultGetreward" && this._enableGetGuideNode){
            if(this._result.victory){
                return this.btnReceive.node;
            }else{
                return this.btnClose.node;
            }
        }
        else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "popup_resultGetreward"){
            if(this._result.victory){
                this.onReceiveClick(null);
            }else{
                this.onCloseClick(null);
            }
            GUIDE.nextGuide(guideId);
        }

    }
    // update (dt) {}
}
