import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import { Fight } from "../../module/fight/FightAssist";
import FightInfo, { FightPlayerType } from "../../model/FightInfo";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { FightResult } from "../../module/fight/FightLogic";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import CardFight from "./CardFight";
import FightAction, { BuffAction } from "../../module/fight/FightAction";
import BuffNode from "./BuffNode";
import FightOnce from "../../module/fight/FightOnce";
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
export default class FightPanel extends UIBase {

    @property(cc.Node)
    center: cc.Node = null;
    @property(cc.Node)
    top: cc.Node = null;
    @property(cc.Node)
    bottom: cc.Node = null;
    @property(cc.Node)
    buffNode:cc.Node = null;
    @property(cc.Node)
    fightNode:cc.Node = null;

    @property(cc.Node)
    skillNode:cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Label)
    myPower: cc.Label = null;
    @property(cc.Label)
    myName: cc.Label = null;
    @property(cc.Label)
    myLevel: cc.Label = null;
    @property(LoadSprite)
    mySex: LoadSprite = null;
    @property(LoadSprite)
    myIcon: LoadSprite = null;

    @property(cc.Node)
    playerNode: cc.Node = null;
    @property(cc.Label)
    playerPower: cc.Label = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    playerLevel: cc.Label = null;
    @property(LoadSprite)
    playerSex: LoadSprite = null;
    @property(LoadSprite)
    playerIcon: LoadSprite = null;

    @property(cc.Node)
    bossNode: cc.Node = null;
    @property(cc.Label)
    bossPower: cc.Label = null;
    @property(cc.Label)
    bossName: cc.Label = null;

    @property(cc.Button)
    btnEnd: cc.Button = null;
    @property(cc.Label)
    lblEnd: cc.Label = null;
    @property(LoadSprite)
    sprEnd: LoadSprite = null;

    @property(cc.Node)
    nodeEnemy: cc.Node = null;
    @property(cc.Node)
    nodeMine: cc.Node = null;
    @property([cc.Node])
    nodeEnemyCards:Array<cc.Node> = [];
    @property([cc.Node])
    nodeMyCards:Array<cc.Node> = [];

    onLoad () {
        this.reset();
    }

    start () {

    }

    private _fihgtMine:FightInfo = null;
    private _fightEnemy:FightInfo = null;

    public setData(data:any){
        super.setData(data);
        this._fightEnemy = data.enemy;
        this._fihgtMine = data.mine;
    }

    private reset(){
        this.btnEnd.node.active = true;
        this.top.position = cc.v2(0,(this.top.height +10));  //cc.v2((this.top.width +10),0)//
        this.bottom.position = cc.v2(0,(-this.bottom.height-10));//cc.v2((-this.bottom.width-10),0);//
        this.center.position = cc.v2(0,0);
        this.nodeEnemy.position = cc.v2(15+cc.winSize.width,this.nodeEnemy.position.y);
        this.nodeMine.position = cc.v2(15-cc.winSize.width,this.nodeMine.position.y);
    }

    private show(){
        this.reset();
        var seq =cc.sequence(
            cc.fadeIn(0.6),
            cc.callFunc(()=>{
                SOUND.playBgSound(SoundConst.Fight_sound);
                Fight.startFight();
                this.startDelayEndEnable();
            })
        );
        this.node.runAction(seq);
        this.scheduleOnce(()=>{
            this.top.runAction(cc.moveTo(0.2,cc.v2(0,0)));
            this.bottom.runAction(cc.moveTo(0.2,cc.v2(0,0)));
            this.nodeEnemy.runAction(cc.moveTo(0.3,cc.v2(15,this.nodeEnemy.position.y)).easing(cc.easeInOut(2)));
            this.nodeMine.runAction(cc.moveTo(0.3,cc.v2(15,this.nodeMine.position.y)).easing(cc.easeInOut(2)));
        },0.3)
    }
    private _endEnableDelay:number = 5;
    private _curTime:number = 0;
    private startDelayEndEnable(){
        this._curTime = 0;
        this.schedule(this.delayEndEnable,1);
    }
    private resetEndEnable(){
        this.lblEnd.node.active = true;
        this.lblEnd.string = this._endEnableDelay.toString();
        this.sprEnd.load(PathUtil.getSprFightEnd(false));
    }
    private delayEndEnable(){
        this._curTime++;
        if(this._curTime>=this._endEnableDelay){
            this.unschedule(this.delayEndEnable);
            this.lblEnd.node.active = false;
            this.sprEnd.load(PathUtil.getSprFightEnd(true));
            this.btnEnd.node.on(cc.Node.EventType.TOUCH_START,this.onEndTouch,this);
        }else{
            this.lblEnd.string = Math.round(this._endEnableDelay - this._curTime).toString();
        }
    }

    public hide(cb:Function){
        var seq =cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(()=>{
                UI.closePopUp(this.node);
                cb && cb();
            })
        );
        this.node.runAction(seq);
    }

    onEnable(){
        this.initView();
        this.show();
    }

    onDisable(){
        this.btnEnd.node.on(cc.Node.EventType.TOUCH_START,this.onEndTouch,this);
        this.clear();
    }
    
    private clear(){
        while(this.buffNode.childrenCount>0){
            UI.removeUI(this.buffNode.children[0]);
        }
        while(this.skillNode.childrenCount>0){
            var skillNode = this.skillNode.children[0];
            skillNode.stopAllActions();
            this._skillPool.put(skillNode);
        }
        while(this.fightNode.childrenCount>0){
            UI.removeUI(this.fightNode.children[0]);
        }
        var nodeCard:cc.Node;
        for(var i:number = 0;i<this.nodeMyCards.length;i++){
            nodeCard = this.nodeMyCards[i];
            if(nodeCard.childrenCount>0){
                var card:CardFight = nodeCard.children[0].getComponent(CardFight);
                if(card){
                    card.clear();
                }
            }
        }
        for(var i:number = 0;i<this.nodeEnemyCards.length;i++){
            nodeCard = this.nodeEnemyCards[i];
            if(nodeCard.childrenCount>0){
                var card:CardFight = nodeCard.children[0].getComponent(CardFight);
                if(card){
                    card.clear();
                }
            }
        }
        this.unscheduleAllCallbacks();
        this.center.stopAllActions();
    }

    private onEndTouch(e){
        this.btnEnd.node.active = false;
        this.stopSequence();
        this.endResult();
    }

    private initView(){
        this.initMyView();
        this.initEnemyView();
        this.resetEndEnable();
    }

    private initMyView(){
        this.myLevel.string = "Lv."+this._fihgtMine.playerLevel;
        this.myName.string = this._fihgtMine.playerName;
        this.mySex.load(PathUtil.getSexIconUrl(this._fihgtMine.playerSex));
        this.myIcon.load(this._fihgtMine.playerIcon);
        this.myPower.string = this._fihgtMine.totalPower.toString();

        var nodeCard:cc.Node;
        for(var i:number = 0;i<this.nodeMyCards.length;i++){
            nodeCard = this.nodeMyCards[i];
            if(nodeCard.childrenCount>0){
                UI.removeUI(nodeCard.children[0]);
            }
            UI.loadUI(ResConst.CardFight,{data:this._fihgtMine.lineup[i]},nodeCard);
        }
    }

    private initEnemyView(){
        if(this._fightEnemy.playerType == FightPlayerType.Boss){
            this.playerNode.active = false;
            this.bossNode.active = true;

            this.bossName.string = this._fightEnemy.playerName;
            this.bossPower.string = this._fightEnemy.totalPower.toString();
        }else{
            this.playerNode.active = true;
            this.bossNode.active = false;

            this.playerLevel.string = "Lv."+this._fightEnemy.playerLevel;
            this.playerName.string = this._fightEnemy.playerName;
            this.playerSex.load(PathUtil.getSexIconUrl(this._fightEnemy.playerSex));
            this.playerIcon.load(this._fightEnemy.playerIcon);
            this.playerPower.string = this._fightEnemy.totalPower.toString();
        }
        var nodeCard:cc.Node;
        for(var i:number = 0;i<this.nodeEnemyCards.length;i++){
            nodeCard = this.nodeEnemyCards[i];
            if(nodeCard.childrenCount>0){
                UI.removeUI(nodeCard.children[0]);
            }
            UI.loadUI(ResConst.CardFight,{data:this._fightEnemy.lineup[i]},nodeCard);
        }
    }
    
    public getCardFightWithPos(pos:number,isMyTeam:boolean):CardFight{
        var teamNodes:cc.Node[] = isMyTeam?this.nodeMyCards:this.nodeEnemyCards;
        var node :cc.Node = teamNodes[pos].children[0];
        if(node){
            return node.getComponent(CardFight);
        }else{
            return null;
        }
    }

    public endResult(){
        this._reslutEndCb && this._reslutEndCb();
    }
    /////////////////////// 
    //    ACTIONS 
    //////////////////////
    private _result:FightResult;
    private _delayAction = 0.6;
    private _myReadyActions:Array<CardAcitonObject> = [];
    private _enemyReadyActions:Array<CardAcitonObject> =[];
    private _fightOnceActions:Array<FightOnce> = [];
    private _endFight:boolean = false;
    private _reslutEndCb:Function = null;

    public initResult(result:FightResult,cb:Function){
        this._endFight = false;
        this._result = result;
        this._reslutEndCb = cb;
        var card:CardFight;
        var i:number = 0;
        var buff:BuffAction;
        if(result.myReadyBuffs.length>0){
            this._myReadyActions = [];
            for(i = 0;i<this._result.myReadyBuffs.length;i++){
                buff = this._result.myReadyBuffs[i];
                card = this.getCardFightWithPos(buff.fromPos,buff.attackObj.isMyTeam);
                this._myReadyActions.push(new CardAcitonObject(card,buff));
            }
        }
        if(result.enemyReadyBuffs.length>0){
            this._enemyReadyActions =[];
            for(i = 0;i<this._result.enemyReadyBuffs.length;i++){
                buff = this._result.enemyReadyBuffs[i];
                card = this.getCardFightWithPos(buff.fromPos,buff.attackObj.isMyTeam);
                this._enemyReadyActions.push(new CardAcitonObject(card,buff));
            }
        }
        this._fightOnceActions = this._result.fights.slice();
        this.playDelaySequence();
    }
    private stopSequence(){
        this.unschedule(this.playSequence);
        this._endFight = true;
    }
    private playDelaySequence(){
        if(!this._endFight){
            this.scheduleOnce(this.playSequence,this._delayAction);
        }
    }

    private playSequence(){
        if(this._myReadyActions.length > 0){
            this._myReadyActions.forEach((cardAction:CardAcitonObject)=>{
                cardAction.card.playAction(cardAction.action,()=>{
                    cardAction.complete = true;
                    if(CardAcitonObject.checkAllActionsComplete(this._myReadyActions)){
                        this._myReadyActions =[];
                        this.playDelaySequence();
                    }
                });
            })
        }else if(this._enemyReadyActions.length > 0){
            this._enemyReadyActions.forEach((cardAction:CardAcitonObject)=>{
                cardAction.card.playAction(cardAction.action,()=>{
                    cardAction.complete = true;
                    if(CardAcitonObject.checkAllActionsComplete(this._enemyReadyActions)){
                        this._enemyReadyActions =[];
                        this.playDelaySequence();
                    }
                });
            })
        }else if(this._fightOnceActions.length>0){
            this._fightOnce = this._fightOnceActions.shift();
            this._fightPlayState = 0;
            this._attackCard = this.getCardFightWithPos(this._fightOnce.attackObj.lineup.pos,this._fightOnce.attackObj.isMyTeam);
            this._beAttackCard = this.getCardFightWithPos(this._fightOnce.beAttackObj.lineup.pos,this._fightOnce.beAttackObj.isMyTeam);
            this.playFightOnce();
        }else{
            this.endResult();
        }
    }

    
    private _fightOnce:FightOnce = null;
    private _fightPlayState:FightOncePlayState = 0;
    private _attackCard:CardFight = null;
    private _beAttackCard:CardFight = null;
    private playFightOnce(){
        this._fightPlayState++;
        switch(this._fightPlayState){
            case FightOncePlayState.AttackSkill:{
                if(this._fightOnce.attackSkill!=null){
                    var pos:cc.Vec2 = this._attackCard.node.parent.convertToWorldSpaceAR(this._attackCard.node.position);
                    this.playSkill(pos,this._fightOnce.attackSkill.attackObj.skill.skillCfg.skillIcon,()=>{
                        this.playFightOnce();
                    });
                }else{
                    this.playFightOnce();
                }
            }break;
            case FightOncePlayState.Fight:{
                var hasShake:boolean = false;
                if(this._fightOnce.attackSkill!=null && this._fightOnce.beAttackSkill==null){
                    hasShake = true;
                }
                this._attackCard.showFight(this._beAttackCard,hasShake,this._fightOnce.attackObj.isMyTeam,()=>{
                    this.playFightOnce();
                });
            }break;
            case FightOncePlayState.BeAttackSkill:{
                SOUND.playFighthitSound();
                if(this._fightOnce.beAttackSkill!=null){
                    var pos:cc.Vec2 = this._beAttackCard.node.parent.convertToWorldSpaceAR(this._beAttackCard.node.position);
                    Fight.panel.playSkill(pos,this._fightOnce.beAttackSkill.attackObj.skill.skillCfg.skillIcon,()=>{
                        this._beAttackCard.beAttack(this._fightOnce.attack.attackPower);
                        this.playFightOnce();
                    });
                }else{
                    this._beAttackCard.beAttack(this._fightOnce.attack.attackPower);
                    this.playFightOnce();
                }
            }break;
            case FightOncePlayState.FightBack:{
                this._attackCard.showFightBack(()=>{
                    this.playFightOnce();
                })
            }break;
            case FightOncePlayState.AfterAttack:{
                if(this._fightOnce.attack.returnBlood>0){
                    this._attackCard.onReturnBlood(this._fightOnce.attack.returnBlood,()=>{
                        this.playFightOnce();
                    })
                }else{
                    this.playFightOnce();
                }
            }break;
            default:{
                this.playDelaySequence();
            }break;
        }
    }
    // update (dt) {}

    public showBuffFly(index:number,buff:BuffAction,fromPos:cc.Vec2,toPos:cc.Vec2,cb:Function){
        fromPos = this.buffNode.convertToNodeSpace(fromPos);
        toPos = this.buffNode.convertToNodeSpaceAR(toPos);
        UI.loadUI(ResConst.BuffNode,{type:buff.buffType,sign:buff.attackObj.skill.skillCfg.skillSign},this.buffNode,(ui:UIBase)=>{
            (ui as BuffNode).showFly(index,fromPos,toPos,()=>{
                cb();
            });
        })
    }
    
    private _skillPool:cc.NodePool = new cc.NodePool();
    public playSkill(pos:cc.Vec2,skillIcon:string,cb:Function){
        SOUND.playFightSkillSound();
        var skillSpr:LoadSprite;
        var skill:cc.Node = this._skillPool.get();
        if(!skill){
            skill = new cc.Node();
            skillSpr = skill.addComponent(LoadSprite);
        }else{
            skillSpr = skill.getComponent(LoadSprite);
        }
        skill.parent = this.skillNode;
        skill.setPosition(this.skillNode.convertToNodeSpaceAR(pos));
        skillSpr.load(PathUtil.getSkillNameUrl(skillIcon),null,()=>{
            skillSpr.node.scale = 0.6;
            var skillSeq = cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.3).easing(cc.easeOut(2)),
                    cc.scaleTo(0.3,1).easing(cc.easeBackOut()),
                ),
                cc.delayTime(0.5),
                cc.callFunc(()=>{
                    skillSpr.load("");
                    skillSpr.node.stopAllActions();
                    this._skillPool.put(skillSpr.node);
                    cb && cb();
                })
            )
            skillSpr.node.runAction(skillSeq);
        });
    }

    public showCardFight(cardNode:cc.Node,fromPos:cc.Vec2,toPos:cc.Vec2,forward:boolean,shake:boolean,cb:Function){
        var fromPos = this.fightNode.parent.convertToNodeSpaceAR(fromPos);
        var toPos = this.fightNode.parent.convertToNodeSpaceAR(toPos);
        cardNode.parent = this.fightNode;
        cardNode.setPosition(fromPos)
        var move;
        if(forward){
            move = cc.moveTo(0.7,toPos).easing(cc.easeBackIn());
        }else{
            move = cc.moveTo(0.5,toPos).easing(cc.easeOut(2))
        }
        var seq = cc.sequence(
            move,
            cc.callFunc(()=>{
                if(shake){
                    var pos:cc.Vec2 = toPos.sub(fromPos).div(20);
                    this.center.setPosition(pos);
                    var shakeAni = cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeBounceOut());
                    this.center.runAction(shakeAni);
                }
                cb && cb();
            })
        )
        cardNode.runAction(seq);
    }
}

export class CardAcitonObject{
    constructor(card:CardFight,action:FightAction,complete:boolean = false){
        this.card = card;
        this.action = action;
        this.complete = complete;
    }
    public card:CardFight = null;
    public action:FightAction = null;
    public complete:boolean =false;


    public static checkAllActionsComplete(actions:CardAcitonObject[]):boolean{
        var complete:boolean = true;
        actions.forEach((action:CardAcitonObject)=>{
            complete = action.complete && complete;
        })
        return complete;
    }
}

export enum FightOncePlayState{
    AttackSkill = 1,
    Fight,
    BeAttackSkill,
    FightBack,
    AfterAttack,
}