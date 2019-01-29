import UIBase from "../../component/UIBase";
import LineupInfo from "../../model/LineupInfo";
import LoadSprite from "../../component/LoadSprite";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import PathUtil from "../../utils/PathUtil";
import FightAction, { BuffAction} from "../../module/fight/FightAction";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { BuffType, BuffProperty } from "../../module/fight/SkillLogic";
import { Fight } from "../../module/fight/FightAssist";
import { CardAcitonObject } from "./FightPanel";
import NumberEffect from "../../component/NumberEffect";
import { FightTipType } from "./FightTip";

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
export default class CardFight extends  UIBase {

    @property(cc.Node)
    cardNode: cc.Node = null;
    @property(cc.Node)
    noCardNode: cc.Node = null;
    @property(cc.Node)
    lifeNode: cc.Node = null;
    @property(cc.Node)
    buffNode: cc.Node = null;
    @property(cc.Node)
    debuffNode: cc.Node = null;

    @property(LoadSprite)
    gradeSpr: LoadSprite = null;
    @property(cc.Label)
    cardName: cc.Label = null;
    @property(cc.Label)
    cardLevel: cc.Label = null;
    @property(cc.Label)
    cardPower: cc.Label = null;
    @property(cc.Label)
    cardLife: cc.Label = null;
    @property(cc.ProgressBar)
    cardLiftProgress:cc.ProgressBar = null;
    @property(LoadSprite)
    cardSpr: LoadSprite = null;
    @property(LoadSprite)
    cardFront: LoadSprite = null;
    @property(LoadSprite)
    cardRace: LoadSprite = null;

    @property(NumberEffect)
    numEffPower:NumberEffect = null;
    @property(NumberEffect)
    numEffLife:NumberEffect = null;


    // LIFE-CYCLE CALLBACKS:

    
    onLoad () {
        // this._oldPos = this.node.position;
        this.node.opacity = 0;
    }
    private _lineupData:LineupInfo = null;
    private _cardInfoCfg:any = null;

    private _curPower:number = 0;
    // private _curLife:number = 0;
    private _loseLife:number = 0;
    private _totalLife:number = 0;
    public get curLife(){
        var cur = this._totalLife - this._loseLife;
        if(cur<0){cur = 0;}   
        return cur;
    }

    public setData(data:any){
        super.setData(data);
        this._lineupData = data.data as LineupInfo;
        if(this._lineupData){
            this._cardInfoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this._lineupData.cardId);
            this._curPower = Number(this._lineupData.power);
            this._totalLife = Number(this._lineupData.life);
            this._loseLife = 0;
        }else{
            this._cardInfoCfg = null;
        }
    }

    start () {

    }

    onEnable(){
        this.showSomeView();
        this.initView();
        // this.node.on(cc.Node.EventType.TOUCH_START,this.testLaebel,this);
    }
    onDisable(){
        this.clear();
    }

    // private testLaebel(){
    //     var num:number = Number((Math.random() *10000).toFixed(0))-5000;
    //     this._curPower += num;
    //     console.log("power:"+this._curPower)
    //     this.numEffPower.setValue(this._curPower);

    // }
    public clear(){
        this._buffs = [];
        this._debuffs = [];
        while(this.buffNode.childrenCount>0){
            UI.removeUI(this.buffNode.children[0]);
        }
        while(this.debuffNode.childrenCount>0){
            UI.removeUI(this.debuffNode.children[0]);
        }
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
        this.numEffLife.stop();
        this.numEffPower.stop();
    }

    private initView(){
        this.node.opacity = 0;
        this.node.scale = 1.2;
        this.node.position = cc.v2(0,0);
        if(this._cardInfoCfg==null){
            // this.noCardNode.active = true;
            // this.cardNode.active = this.lifeNode.active = this.buffNode.active = this.debuffNode.active = false;
            this.node.opacity = 0;
        }else{
            this.noCardNode.active = false;
            this.cardNode.active = this.lifeNode.active = this.buffNode.active = this.debuffNode.active = true;

            this.cardName.string = this._cardInfoCfg.name;
            this.cardLevel.string = this._lineupData.level.toString();
            this.gradeSpr.load(PathUtil.getCardGradeImgPath(this._lineupData.grade));
            this.cardPower.string = this._curPower.toString();
            this.numEffPower.setValue(this._curPower,false);
            this.cardLife.string = this.curLife.toString();
            this.numEffLife.setValue(this.curLife,false);
            this.cardLiftProgress.progress = this.getLiftPro();
            var headUrl = this._cardInfoCfg.simgPath;
            this.cardSpr.load(PathUtil.getCardImgPath(headUrl),null,this.loadComplete.bind(this));
            this.cardFront.load(PathUtil.getCardFrontImgPath(this._lineupData.grade));
            this.cardRace.load(PathUtil.getCardRaceImgPath(this._lineupData.raceId));
        }
    }

    private loadComplete(){
        var seq = cc.spawn(
            cc.scaleTo(0.15,1).easing(cc.easeOut(2)),
            cc.fadeIn(0.15)
        )
        this.node.runAction(seq);
    }

    private hideSomeView(){
        this.lifeNode.opacity = 0;
        this.buffNode.opacity = 0;
        this.debuffNode.opacity = 0;
    }
    private showSomeView(){
        this.lifeNode.opacity = 255;
        this.buffNode.opacity = 255;
        this.debuffNode.opacity = 255;
    }

    private getLiftPro(){
        var pro = this.curLife/this._totalLife;
        if(pro>1)
            pro = 1;
        if(pro<0)
            pro = 0;
        return pro;
    }

    private _buffs:Array<BuffAction> = [];
    private _debuffs:Array<BuffAction> = [];
    private _buffIconHeight:number = 35;

    public addBuff(addIndex:number,fromPos:cc.Vec2,buff:BuffAction,cb:Function){
        if(this._buffs.indexOf(buff)>-1 || this._debuffs.indexOf(buff)>-1){
            cb && cb();
        }
        var buffType:BuffType = buff.buffType;
        var pNode:cc.Node = null;
        var buffIndex:number = 0;
        var toPos:cc.Vec2;
        if(buffType== BuffType.Debuff){
            pNode = this.debuffNode;
            this._debuffs.push(buff);
            buffIndex = this._debuffs.length-1;
            toPos = cc.v2(0,- this._buffIconHeight/2 - this._buffIconHeight*buffIndex);
        }else if(buffType == BuffType.Mine || buffType == BuffType.Team){
            pNode = this.buffNode;
            this._buffs.push(buff);
            buffIndex = this._buffs.length-1;
            toPos = cc.v2(0,this._buffIconHeight/2 + this._buffIconHeight* buffIndex);
        }
        var buffAnim:BuffAnimObject = new BuffAnimObject();
        var addValue:number = 0;
        if(buff.buffProperty == BuffProperty.Life){
            addValue = this._totalLife * buff.buffValue;
            buffAnim.str = "生命：+"+addValue.toFixed(0);
            buffAnim.pos = this.cardLife.node.parent.convertToWorldSpaceAR(this.cardLife.node.position);
        }else if(buff.buffProperty == BuffProperty.Power){
            addValue = this._curPower * buff.buffValue;
            buffAnim.str = "攻击：+"+addValue.toFixed(0);
            buffAnim.pos = this.cardPower.node.parent.convertToWorldSpaceAR(this.cardPower.node.position);
        }
        buffAnim.addValue =  addValue;
        buffAnim.prop = buff.buffProperty;
        
        var toWPos:cc.Vec2 = pNode.convertToWorldSpaceAR(toPos);
        Fight.panel.showBuffFly(addIndex,buff,fromPos,toWPos,()=>{
            UI.loadUI(ResConst.BuffNode,{type:buff.buffType,sign:buff.attackObj.skill.skillCfg.skillSign},pNode,(ui:UIBase)=>{
                ui.node.setPosition(toPos);
            })
            if(buffAnim.prop == BuffProperty.Power){
                this._curPower += buffAnim.addValue;
                this.numEffPower.setValue(this._curPower);
            }else if(buffAnim.prop == BuffProperty.Life){
                this._totalLife += buffAnim.addValue;
                this.numEffLife.setValue(this.curLife);
                this.cardLiftProgress.progress = this.getLiftPro();
            }
            cb && cb();
        })
    }

    public beAttack(attackPower:number,hasSkill:boolean,cb:Function){
        var tipStr:string = ""
        if(this._loseLife+attackPower>this._totalLife){
            attackPower = this._totalLife - this._loseLife;
            // tipStr = "阵亡";
        }
        tipStr = "-"+attackPower.toFixed(0);
        this._loseLife += attackPower;
        this.numEffLife.setValue(this.curLife);
        this.cardLiftProgress.progress = this.getLiftPro();
        var pos = this.cardLife.node.parent.convertToWorldSpaceAR(this.cardLife.node.position);
        if(hasSkill){
            this.showBeAttackTip(tipStr,pos);
        }else{
            this.cardNode.scale = 1;
            var beAttackAct = cc.sequence(
                cc.scaleTo(0.09,0.9),
                cc.scaleTo(0.06,1),
                cc.callFunc(()=>{
                    this.showBeAttackTip(tipStr,pos);
                })
            )
            this.cardNode.runAction(beAttackAct);
        }

        cb && cb();
    }
    private showBeAttackTip(tipStr:string,pos:cc.Vec2){
        UI.showTipCustom(ResConst.FightTip,{type:FightTipType.BeAttack,str:tipStr},pos,()=>{
            if(this.curLife<=0){
                if(this.isValid){
                    this.node.runAction(cc.fadeOut(0.15));
                }
            }
        });
    }

    public onReturnBlood(returnblood:number,cb:Function){
        var tipStr:string = ""
        if(this._loseLife-returnblood<0){
            returnblood = this._loseLife;
        }
        tipStr = "+"+returnblood;
        this._loseLife -= returnblood;
        this.numEffLife.setValue(this.curLife);
        this.cardLiftProgress.progress = this.getLiftPro();
        var pos = this.cardLife.node.parent.convertToWorldSpaceAR(this.cardLife.node.position);
        UI.showTipCustom(ResConst.FightTip,{type:FightTipType.ReturnBlood,str:tipStr},pos,()=>{
            if(this.isValid){
                cb && cb();
            }
        })
    }
    /////////////////////// 
    //    ACTIONS 
    //////////////////////
    private _action:FightAction = null;
    private _completeFunc:Function = null;

    public playAction(action:FightAction,complete:Function){
        this._action = action;
        this._completeFunc = complete;

        if(action instanceof BuffAction){
            var pos:cc.Vec2 = this.node.parent.convertToWorldSpaceAR(this.node.position);
            Fight.panel.playSkill(pos,(action as BuffAction).attackObj.skill.skillCfg.skillIcon,()=>{
                this.showBuffFly();
            });
        }
    }

    public endAction(){
        this._action = null;
        this._completeFunc && this._completeFunc();
    }

    private _buffActions:Array<CardAcitonObject> = [];
    private showBuffFly(){
        var buff:BuffAction = this._action as BuffAction;
        this._buffActions = [];
        var fromPos:cc.Vec2 = this.node.parent.convertToWorldSpaceAR(cc.v2(this.node.position));
        buff.buffPos.forEach((pos:number)=>{
            var card:CardFight = Fight.panel.getCardFightWithPos(pos,buff.attackObj.isMyTeam);
            this._buffActions.push(new CardAcitonObject(card,buff));
        })
        var addIndex:number = 0;
        this._buffActions.forEach((cardAction:CardAcitonObject)=>{
            cardAction.card.addBuff(addIndex,fromPos,cardAction.action as BuffAction,()=>{
                cardAction.complete = true;
                if(CardAcitonObject.checkAllActionsComplete(this._buffActions)){
                    this._buffActions =[];
                    this.endAction();
                }
            });
            addIndex ++;
        })
    }
    // update (dt) {}

    private _oldParent:cc.Node = null;
    private _oldPos:cc.Vec2 = null;
    private _fromPos:cc.Vec2 = null;
    private _toPos:cc.Vec2 = null;
    public showFight(beAttack:CardFight,hasAllShake:boolean,isMyTeam:boolean,cb:Function){
        this._oldParent = this.node.parent;
        this._oldPos = this.node.position;
        this._fromPos = this.node.parent.convertToWorldSpaceAR(this._oldPos);
        this._toPos = beAttack.node.parent.convertToWorldSpaceAR(beAttack.node.position);
        if(isMyTeam){
            this._toPos.y -= this.node.height*2/3;
        }else {
            this._toPos.y += this.node.height*2/3;
        }
        this.hideSomeView();
        Fight.panel.showCardFight(this.node,this._fromPos,this._toPos,true,hasAllShake,()=>{
            cb && cb();
        })
    }
    public showFightBack(cb:Function){
        Fight.panel.showCardFight(this.node,this._toPos,this._fromPos,false,false,()=>{
            this.node.parent = this._oldParent;
            this.node.position = this._oldPos;
            this.showSomeView();
            cb && cb();
        })
    }
}

export class BuffAnimObject{
    constructor(){

    }
    public prop:BuffProperty = 0;
    public addValue:number = 0;
    public str:string ="";
    public pos:cc.Vec2 = null;
}