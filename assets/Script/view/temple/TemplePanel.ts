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
import { CardSummonType } from "../../net/msg/MsgCardSummon";
import { Card, CardRaceType } from "../../module/card/CardAssist";
import { BuildType } from "../BuildPanel";
import ButtonGroup from "../../component/ButtonGroup";
import DList, { DListDirection } from "../../component/DList";
import { CardSimpleShowType } from "../card/CardSmall";
import { GUIDE } from "../../manager/GuideManager";
import { CardBigShowType } from "../card/CardBig";
import ResPanel, { ResPanelType, SeeVideoResult } from "../ResPanel";
import { WeiXin, SeeVideoType } from "../../wxInterface";
import ButtonEffect from "../../component/ButtonEffect";

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
    // @property(cc.Button)
    // helpBtn: cc.Button = null;
    @property(cc.Button)
    buildHeroBtn: cc.Button = null;

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

    @property(ButtonGroup)
    btnGroup:ButtonGroup = null;
    @property(DList)
    cardsList:DList = null;

    private _buildType:number = 0;
    private _buildInfo:BuildInfo = null;

    private _stoneSummonCost:number = 0;
    // LIFE-CYCLE CALLBACKS:
    onEnable(){
        this.lifeStoneBtn.node.on(ButtonEffect.CLICK_END,this.onLifeStoneClick,this);
        this.videoBtn.node.on(ButtonEffect.CLICK_END,this.onVideoClick,this);
        // this.helpBtn.node.on(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        this.buildHeroBtn.node.on(cc.Node.EventType.TOUCH_START,this.onGotoHeroFast,this);
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.on(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.Card_summon_Complete,this.onCardSummoned,this);
        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);
    }

    onDisable(){
        this.lifeStoneBtn.node.off(ButtonEffect.CLICK_END,this.onLifeStoneClick,this);
        this.videoBtn.node.off(ButtonEffect.CLICK_END,this.onVideoClick,this);
        // this.helpBtn.node.off(cc.Node.EventType.TOUCH_START,this.onHelpClick,this);
        this.buildHeroBtn.node.off(cc.Node.EventType.TOUCH_START,this.onGotoHeroFast,this);
        this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.Card_summon_Complete,this.onCardSummoned,this);
        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);

        this.cardsList.setListData([]);
    }

    public setData(param:any){
        this._buildType = param.buildType;
        this._buildInfo = BUILD.getBuildInfo(this._buildType);
    }

    private onLifeStoneClick(e){
        if(COMMON.resInfo.lifeStone <=this._stoneSummonCost){
            ResPanel.show(ResPanelType.StoneNotEnough);
            return;
        }
        this.playStoneSummonEffect(()=>{
            if(GUIDE.isInGuide){ //引导
                Card.summonCardGuide(this._stoneSummonCost);
            }else{
                Card.summonCard(CardSummonType.LifeStone,this._stoneSummonCost);
            }
        });
        
    }

    

    private onVideoClick(e){
        // if(COMMON.videoSummonNum>=CONSTANT.getVideoFreeSummonNum()){
        //     UI.showTip("超过每日视频抽卡上限!")
        //     return;
        // }
        WeiXin.showVideoAd((result:SeeVideoResult)=>{
            if(result == SeeVideoResult.Complete){
                UI.showTip("开启五倍概率抽卡！");
                this.playStoneSummonEffect(()=>{
                    Card.summonCard(CardSummonType.Viedo);
                });
            }else if(result == SeeVideoResult.LoadError){
                UI.showTip("视频加载失败！请稍候再来");
            }else if(result == SeeVideoResult.NotComplete){
                UI.showTip("视频观看未完成");
            }
            
        },SeeVideoType.SeeVideoGetCard)
    }
    onLoad () {
        this.initView();
        this.initListGroup();
    }

    private onPanelShowComplete(e){
        this.initListWithType(this.btnGroup.selectIndex);
    }
    private onHelpClick(e){
    }

    private onGotoHeroFast(e){
        EVENT.emit(GameEvent.Goto_build_panel,{type:BuildType.Hero});
    }
    private initView(){
        // var freeNum:number = CONSTANT.getStoneFreeSummonNum();
        // if(COMMON.stoneSummonNum < freeNum){
        //     this.stoneSummonFree.node.active = true;
        //     this.stoneSummonFree.string = "第"+(COMMON.stoneSummonNum +1)+"次免费";
        //     this.stoneCost.active = false;
        //     this._stoneSummonCost = 0;
        // }else{
            this.stoneCost.active = true;
            this.stoneSummonFree.node.active = false;
            this._stoneSummonCost = BUILD.getSummonStoneCostBuffed();  //COMMON.stoneSummonNum-freeNum
            this.summonNeedLifeStone.string = StringUtil.formatReadableNumber(this._stoneSummonCost);
        
        // }
        this.videoLeftTime.string = "剩余："+ (CONSTANT.getVideoFreeSummonNum() - COMMON.videoSummonNum);
    }

    private initListGroup(){
        this.btnGroup.labels = CONSTANT.getRaceNameWithId(CardRaceType.WuZu)+";"
        + CONSTANT.getRaceNameWithId(CardRaceType.YaoZu)+";"
        + CONSTANT.getRaceNameWithId(CardRaceType.XianJie)+";"
        + CONSTANT.getRaceNameWithId(CardRaceType.RenJie);
        this.btnGroup.selectIndex = 0;
    }

    private groupSelectChange(e){
        var idx = e.index;
        this.initListWithType(idx);
    }

    private initListWithType(index:number){
        console.log("____idx:"+index);
        var cardsArr = Card.getCardCfgList(index+1);
        var cardsDataArr = [];
        cardsArr.forEach(item =>{
            cardsDataArr.push({type:CardSimpleShowType.Hero,cfg:item});
        })
        this.cardsList.direction = DListDirection.Vertical;
        this.cardsList.setListData(cardsDataArr);
    }

    start () {

    }

    private onCardClick(e){
        var data = e.data;
        UI.createPopUp(ResConst.cardDescrip,{cardId:data.cfg.id});
    }
    private onBuildUpdate(e){
        //重置界面
        this.initView();
    }

    private onCardSummoned(e){
        this.initView();
        this.showCardGetEffect(e.uuid);
    }


    private _summonEffectPlaying:boolean = false;
    private _summonMoveEnd:Function = null;
    private _during:number =0;
    private _speedDir:number = 0; //0加速1匀速2减速3结束 
    private _speedNum:number = 0;

    private Sspeed:number = 0.25;
    private Aspeed:number = 0.05;
    private MaxSpeed:number =0.2;
    private MaxSpeedNum:number = 4;
    private Dspeed:number = 0.05;
    private MinSpeed:number = 0.3;
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
        var centerCard:CardEffect = null;
        for(var i=0;i< this.cardEffects.length;i++){
            var card = this.cardEffects[i];
            if(card.curIndex == 2){
                centerCard = card;
                break;
            }
        }
        centerCard.playShowEffect(uuid,()=>{
            var wPos:cc.Vec2 = centerCard.node.parent.convertToWorldSpaceAR(centerCard.node.position);
            var toPos:cc.Vec2 = this.buildHeroBtn.node.parent.convertToWorldSpaceAR(this.buildHeroBtn.node.position);
            UI.createPopUp(ResConst.cardBig,{type:CardBigShowType.GetCard, cardUUid:uuid,fPos:wPos,tPos:toPos})
            this._summonEffectPlaying = false;
        });
    }
    

    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_getCard"){
            return this.lifeStoneBtn.node;
        }else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_getCard"){
            this.onLifeStoneClick(null);
            GUIDE.nextGuide(guideId);
        }

    }

    private onGuideWeakTouch(e){

        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_getCard"){
            this.onLifeStoneClick(null);
            GUIDE.nextWeakGuide(guideId);
        }
    }

}
