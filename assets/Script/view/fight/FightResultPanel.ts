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
import CardInfo from "../../model/CardInfo";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { CardBigShowType } from "../card/CardBig";
import { GAME } from "../../GameController";
import { Passage } from "../../module/battle/PassageAssist";
import ResInfo from "../../model/ResInfo";
import { Battle } from "../../module/battle/BattleAssist";
import EnemyInfo, { EnemyTypeEnum } from "../../model/EnemyInfo";

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
    @property(cc.Button)
    btnReceive: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    
    @property(LoadSprite)
    sprStar: LoadSprite = null;
    @property(FlowGroup)
    groupReward:FlowGroup = null;
    @property(cc.Node)
    fightReward:cc.Node = null;
    @property(cc.Node)
    fightFailed:cc.Node = null;


    @property(LoadSprite)
    headMine: LoadSprite = null;
    @property(LoadSprite)
    headEnemy: LoadSprite = null;
    @property(cc.Label)
    nameMine: cc.Label = null;
    @property(cc.Label)
    nameEnemy: cc.Label = null;

    // @property(cc.RichText)
    // detailText:cc.RichText = null;
    // @property(cc.ScrollView)
    // detailScroll:cc.ScrollView = null;

    @property(cc.Node)
    enemyNode: cc.Node = null;
    @property(cc.Label)
    addScore: cc.Label = null;
    @property(cc.Label)
    rabText: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Sprite)
    doubleIcon:cc.Sprite= null;
    @property(cc.Node)
    doubleNode:cc.Node= null;

    private _result:FightResult = null;
    private _fightMine:FightInfo = null;
    private _fightEnemy:FightInfo = null;
    private _rewards:Array<any> =[];
    private _addScore:number = 0;
    // private _addCard:CardInfo = null;
    private _enemy:EnemyInfo = null;
    public setData(data:any){
        super.setData(data);
        this._result = data.result;
        this._fightMine = data.fightMine;
        this._fightEnemy = data.fightEnemy;
        this._rewards = data.rewards;
        if(data.addScore!=undefined){
            this._addScore = data.addScore;
        }
        // if(data.addCard!= undefined){
        //     this._addCard = data.addCard;
        // }
        if(data.enemy!=undefined){
            this._enemy = data.enemy;
        }
    }

    private resetData(){
        this._addScore = 0;
        this._enemy = null;
        // this._addCard = null;
    }
    onLoad(){
    }

    onEnable(){
        super.onEnable();
        this.btnReceive.node.on(TouchHandler.TOUCH_CLICK,this.onReceiveClick,this);
        this.btnClose.node.on(TouchHandler.TOUCH_CLICK,this.onCloseClick,this);
        this.doubleNode.on(cc.Node.EventType.TOUCH_START,this.onDoubleTouch,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        this.initView();
    }
    onDisable(){
        super.onDisable();
        this.btnReceive.node.off(TouchHandler.TOUCH_CLICK,this.onReceiveClick,this);
        this.btnClose.node.off(TouchHandler.TOUCH_CLICK,this.onCloseClick,this);
        this.doubleNode.off(cc.Node.EventType.TOUCH_START,this.onDoubleTouch,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        this.resetData();
    }

    private onReceiveClick(e){
        if(this._doubleSelect && !GUIDE.isInGuide){
            Share.shareAppMessage(()=>{
                UI.showTip("分享成功，奖励翻倍！");
                this.onReceivedDouble(true);
            },()=>{
                UI.showTip("分享失败，正常领取");
                this.onReceivedDouble(false);
            });
        }else{
            this.onReceivedDouble(false);
        }
    }

    private onReceivedDouble(isDouble:boolean){
        if(this._fightEnemy.playerType == FightPlayerType.Boss){
            Passage.fightBossSuccess((restAdd:ResInfo,expadd:number)=>{
                this.showResClose();
            },isDouble);
        }else if(this._fightEnemy.playerType == FightPlayerType.Enemy){ 
            var isguide:boolean = (this._enemy.enemyType == EnemyTypeEnum.Guide);
            Battle.fightEnemeySuccess(this._enemy,this._result.victory,this._result.evaluate,isguide,isDouble,this._result.immediately,
                (addExp:number,addDiamond:number,addScore:number,cardInfo:CardInfo)=>{
                    if(cardInfo!=null){
                        EVENT.on(GameEvent.Card_RabGet_Close,this.onCardRabGetClose,this)
                        this.showGetCard(cardInfo.uuid);
                    }else{
                        this.showResClose();
                    }
                });
        }
    }
    private onCardRabGetClose(e){
        EVENT.off(GameEvent.Card_RabGet_Close,this.onCardRabGetClose,this)
        this.showResClose();
    }
    private showResClose(){
        EVENT.emit(GameEvent.Show_Res_Add,{types:this._rewards});
        this.onClose(null);
    }
    private onCloseClick(e){
        if(this._fightEnemy.playerType == FightPlayerType.Enemy){ 
            Battle.fightEnemeySuccess(this._enemy,this._result.victory,this._result.evaluate,false,false,this._result.immediately,
                (addExp:number,addDiamond:number,addScore:number,cardInfo:CardInfo)=>{
                    this.onClose(e);
                });
        }else{
            this.onClose(e);
        }
    }
    start () {

    }

    private showGetCard(uuid){
        UI.createPopUp(ResConst.cardBig,{type:CardBigShowType.RabGetCard, cardUUid:uuid,fPos:null,tPos:null});
    }

    private initView(){
        this.rabText.node.active = false;
        this.victoryNode.active = this._result.victory;
        this.failNode.active = !this._result.victory;

        this.nameMine.string = this._fightMine.playerName;
        this.headMine.load(this._fightMine.playerIcon);
        this.nameEnemy.string = this._fightEnemy.playerName;
        this.headEnemy.load(this._fightEnemy.playerIcon);

        // this.detailText.string = this._result.getHtmlDesc();
        if(this._fightEnemy.playerType == FightPlayerType.Enemy){
            this.enemyNode.active = true;
            if(this._result.evaluate>0){
                this.sprStar.load(PathUtil.getResultEvalUrl(this._result.evaluate));
            }else{
                this.sprStar.load("");
            }
            this.addScore.string = "+"+this._addScore.toString();
            // this.rabText.node.active = (this._addCard!=null);
        }else{
            this.enemyNode.active = false;
        }

        if(!this._result.victory){ //失败
            this.groupReward.setGroupData([]);
            this.fightReward.active = false;
            this.fightFailed.active = true;
            this.doubleNode.active = false;
        }else{
            this.fightReward.active = true;
            this.fightFailed.active = false;
            this.groupReward.setGroupData(this._rewards);
            if(!GUIDE.isInGuide){
                this.doubleNode.active = true;
                this.setDoubleSelect(this._doubleSelect);
            }else{
                this.doubleNode.active = false;
            }
        }
    }



    private _doubleSelect:boolean =true;
    private setDoubleSelect(select:boolean){
        this._doubleSelect = select;
        this.doubleIcon.node.active = select;
    }

    private onDoubleTouch(e){
        this.setDoubleSelect(!this._doubleSelect);
    }

    protected onShowComplete(){
        super.onShowComplete();
        this._enableGetGuideNode = true;
        SOUND.pauseMusic();
        if(this._result.victory){
            SOUND.playFightWinSound();
        }else{
            SOUND.playFightFailSound();
        }
    }

    protected onCloseComplete(){
        super.onCloseComplete();
        Fight.endFight();
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
        }else if(name == "popup_result"){
            return this.node;
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
