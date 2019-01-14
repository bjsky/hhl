import UIBase from "../../component/UIBase";
import LineupInfo from "../../model/LineupInfo";
import LineUpUI from "../battle/LineUpUI";
import LoadSprite from "../../component/LoadSprite";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import PathUtil from "../../utils/PathUtil";
import FightAction, { BuffAction } from "../../module/fight/FightAction";
import { SkillInfo } from "../../module/fight/FightObject";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { BuffType, BuffProperty } from "../../module/fight/SkillLogic";
import { Fight } from "../../module/fight/FightAssist";
import { CardAcitonObject } from "./FightPanel";
import BuffNode from "./BuffNode";

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
    skillSpr:LoadSprite = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _lineupData:LineupInfo = null;
    private _cardInfoCfg:any = null;

    private _curPower:number = 0;
    private _curLife:number = 0;
    private _totalLife:number = 0;

    public setData(data:any){
        super.setData(data);
        this._lineupData = data.data as LineupInfo;
        if(this._lineupData){
            this._cardInfoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this._lineupData.cardId);
            this._curPower = this._curLife = this._totalLife = this._lineupData.power;
        }else{
            this._cardInfoCfg = null;
        }
    }

    start () {

    }

    onEnable(){
        this.initView();
    }
    onDisable(){
        this.clear();
    }

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
        this.skillSpr.node.stopAllActions();
        this._isActionPlaying = false;
        
    }

    private initView(){
        this.skillSpr.node.opacity = 0;
        if(this._cardInfoCfg==null){
            this.noCardNode.active = true;
            this.cardNode.active = this.lifeNode.active = this.buffNode.active = this.debuffNode.active = false;
        }else{
            this.noCardNode.active = false;
            this.cardNode.active = this.lifeNode.active = this.buffNode.active = this.debuffNode.active = true;

            this.cardName.string = this._cardInfoCfg.name;
            this.cardLevel.string = this._lineupData.level.toString();
            this.gradeSpr.load(PathUtil.getCardGradeImgPath(this._lineupData.grade));
            this.cardPower.string = this._curPower.toString();
            this.cardLife.string = this._curLife.toString();
            this.cardLiftProgress.progress = this.getLiftPro();
            var headUrl = this._cardInfoCfg.simgPath;
            this.cardSpr.load(PathUtil.getCardImgPath(headUrl));
        }
    }

    private getLiftPro(){
        var pro = this._curLife/this._totalLife;
        if(pro>1)
            pro = 1;
        if(pro<0)
            pro = 0;
        return pro;
    }

    private _buffs:Array<BuffAction> = [];
    private _debuffs:Array<BuffAction> = [];
    private _buffIconHeight:number = 32;

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
        var toWPos:cc.Vec2 = pNode.convertToWorldSpaceAR(toPos);
        Fight.panel.showBuffFly(addIndex,buff,fromPos,toWPos,()=>{
            UI.loadUI(ResConst.BuffNode,{type:buff.buffType,sign:buff.skill.skillCfg.skillSign},pNode,(ui:UIBase)=>{
                ui.node.setPosition(toPos);
            })
            cb && cb();
        })
    }

    /////////////////////// 
    //    ACTIONS 
    //////////////////////
    private _isActionPlaying:boolean = false;
    private _action:FightAction = null;
    private _completeFunc:Function = null;

    public playAction(action:FightAction,complete:Function){
        if(this._isActionPlaying){
            return;
        }
        this._action = action;
        this._isActionPlaying = true;
        this._completeFunc = complete;

        if(action instanceof BuffAction){
            this.playBuffAction(action as BuffAction);
        }
    }

    public endAction(){
        this._action = null;
        this._isActionPlaying = false;
        this._completeFunc && this._completeFunc();
    }

    private playBuffAction(buffAction:BuffAction){
        var skill:SkillInfo = buffAction.skill;
        this.skillSpr.load(PathUtil.getSkillNameUrl(skill.skillCfg.skillIcon),null,()=>{
            this.skillSpr.node.scale = 0.6;
            var skillSeq = cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.3).easing(cc.easeOut(2)),
                    cc.scaleTo(0.3,1).easing(cc.easeOut(2)),
                ),
                cc.delayTime(0.6),
                cc.callFunc(()=>{
                    this.showBuffFly();
                })
            )
            this.skillSpr.node.runAction(skillSeq);
        });
    }

    private _buffActions:Array<CardAcitonObject> = [];
    private showBuffFly(){
        this.skillSpr.node.opacity = 0;
        var buff:BuffAction = this._action as BuffAction;
        this._buffActions = [];
        var fromPos:cc.Vec2 = this.skillSpr.node.parent.convertToWorldSpaceAR(cc.v2(this.skillSpr.node.position));
        buff.buffPos.forEach((pos:number)=>{
            var card:CardFight = Fight.panel.getCardFightWithPos(pos,buff.isMyTeam);
            this._buffActions.push(new CardAcitonObject(card,buff));
        })
        var addIndex:number = 0;
        this._buffActions.forEach((cardAction:CardAcitonObject)=>{
            cardAction.card.addBuff(addIndex,fromPos,cardAction.action as BuffAction,()=>{
                cardAction.complete = true;
                if(this.checkAllActionsComplete(this._buffActions)){
                    this._buffActions =[];
                    this.endAction();
                }
            });
            addIndex ++;
        })
    }

    private checkAllActionsComplete(actions:CardAcitonObject[]):boolean{
        var complete:boolean = true;
        actions.forEach((action:CardAcitonObject)=>{
            complete = action.complete && complete;
        })
        return complete;
    }
    // update (dt) {}
}
