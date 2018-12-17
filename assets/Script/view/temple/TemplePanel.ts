import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import BuildInfo from "../../model/BuildInfo";
import { BUILD } from "../../module/build/BuildAssist";
import { CONSTANT } from "../../Constant";
import { COMMON } from "../../CommonData";
import StringUtil from "../../utils/StringUtil";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import CardEffect from "../../component/CardEffect";
import { NET } from "../../net/core/NetController";
import MsgCardSummon, { CardSummonType } from "../../net/msg/MsgCardSummon";
import { Card } from "../../module/card/CardAssist";

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
export default class TemplePanel extends UIBase {

    @property(cc.Button)
    lifeStoneBtn: cc.Button = null;
    @property(cc.Button)
    videoBtn: cc.Button = null;
    @property(cc.Button)
    helpBtn: cc.Button = null;

    @property(cc.Label)
    summonNeedLifeStone: cc.Label = null;
    @property(cc.Label)
    videoLeftTime: cc.Label = null;
    @property(cc.Label)
    stoneSummonFree: cc.Label = null;
    @property(cc.Node)
    stoneCost: cc.Node = null;
    
    @property([CardEffect])
    cardEffects: Array<CardEffect> = [];

    private _buildType:number = 0;
    private _buildInfo:BuildInfo = null;

    private _stoneSummonCost:number = 0;
    // LIFE-CYCLE CALLBACKS:
    onEnable(){
        this.lifeStoneBtn.node.on(cc.Node.EventType.TOUCH_START,this.onLifeStoneClick,this);
        this.videoBtn.node.on(cc.Node.EventType.TOUCH_START,this.onVideoClick,this);
        this.helpBtn.node.on(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.Card_summon_Complete,this.onCardSummoned,this);
    }

    onDisable(){
        this.lifeStoneBtn.node.off(cc.Node.EventType.TOUCH_START,this.onLifeStoneClick,this);
        this.videoBtn.node.off(cc.Node.EventType.TOUCH_START,this.onVideoClick,this);
        this.helpBtn.node.off(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);

        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.Card_summon_Complete,this.onCardSummoned,this);
    }

    public setData(param:any){
        this._buildType = param.buildType;
        this._buildInfo = BUILD.getBuildInfo(this._buildType);
    }

    private onLifeStoneClick(e){
        if(COMMON.resInfo.lifeStone <=this._stoneSummonCost){
            UI.showTip("灵石不足!");
            return;
        }
        this.playStoneSummonEffect(()=>{
            Card.summonCard(CardSummonType.LifeStone,this._stoneSummonCost);
        });
        
    }

    

    private onVideoClick(e){
        UI.createPopUp(ResConst.cardDescrip,{});
        // UI.createPopUp(ResConst.CardGet,{});
    }
    onLoad () {
        this.initView();
    }
    private onHelpClick(e){
        UI.createPopUp(ResConst.CardRaceHelp,{});
    }

    private initView(){
        var freeNum:number = CONSTANT.getStoneFreeSummonNum();
        if(COMMON.stoneSummonNum < freeNum){
            this.stoneSummonFree.node.active = true;
            this.stoneSummonFree.string = "第"+(COMMON.stoneSummonNum +1)+"次免费";
            this.stoneCost.active = false;
            this._stoneSummonCost = 0;
        }else{
            this.stoneCost.active = true;
            this.stoneSummonFree.node.active = false;
            this._stoneSummonCost = BUILD.getSummonStoneCostBuffed(COMMON.stoneSummonNum-freeNum);
            this.summonNeedLifeStone.string = StringUtil.formatReadableNumber(this._stoneSummonCost);
        
        }
        this.videoLeftTime.string = "剩余："+ (CONSTANT.getVideoFreeSummonNum() - COMMON.videoSummonNum);
    }

    start () {

    }

    private onBuildUpdate(e){
        //重置界面
        this.initView();
    }

    private onCardSummoned(e){
        this.initView();
        this.showCardGetEffect(e.detail.uuid);
    }


    private _summonEffectPlaying:boolean = false;
    private _summonMoveEnd:Function = null;
    private _during:number =0;
    private _speedDir:number = 0; //0加速1匀速2减速3结束 
    private _speedNum:number = 0;

    private Sspeed:number = 0.4;
    private Aspeed:number = 0.1;
    private MaxSpeed:number =0.2;
    private MaxSpeedNum:number = 7;
    private Dspeed:number = 0.05;
    private MinSpeed:number = 0.4;
    private playStoneSummonEffect(cb:Function){
        if(this._summonEffectPlaying)
            return;
        this._summonMoveEnd = cb;
        this._summonEffectPlaying = true;
        this._during = this.Sspeed;
        this._speedDir = 0;
        this._speedNum = 0;
        this.doSummonEffect();
        
    }

    private doSummonEffect(){
        if(this._speedDir == 0){ // 加速
            this._during -= this.Aspeed;
            if(this._during<this.MaxSpeed){
                this._speedDir = 1;
                this._during = this.MaxSpeed;
            }
        }else if(this._speedDir == 1){
            this._speedNum++;
            if(this._speedNum>=this.MaxSpeedNum){
                this._speedDir = 2;
            }
        }else if(this._speedDir == 2){
            this._during += this.Dspeed;
            if(this._during>this.MinSpeed){
                this._speedDir = 3;
                this._during = this.MinSpeed;
            }
        }else if(this._speedDir == 3){
            this.node.stopAllActions();
            this._summonMoveEnd && this._summonMoveEnd();
            return;
        }
        var summon = cc.sequence(
            cc.callFunc(()=>{
                this.cardEffects.forEach((effect:CardEffect)=>{
                    effect.play(this._during);
                })
            }),
            cc.delayTime(this._during),
            cc.callFunc(()=>{
                this.doSummonEffect();
            })
        )
        // console.log(this._during)
        this.node.runAction(summon);
    }

    public showCardGetEffect(uuid:string){
        for(var i=0;i< this.cardEffects.length;i++){
            var card = this.cardEffects[i];
            if(card.curIndex == 2){
                card.playShowEffect(uuid,()=>{
                    this._summonEffectPlaying = false;
                });
            }
        }
    }
    
}
