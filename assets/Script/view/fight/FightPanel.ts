import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import { Fight } from "../../module/fight/FightAssist";
import FightInfo from "../../model/FightInfo";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { FightResult } from "../../module/fight/FightLogic";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import CardFight from "./CardFight";
import FightAction, { BuffAction } from "../../module/fight/FightAction";
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

    @property(cc.Node)
    bossNode: cc.Node = null;
    @property(cc.Label)
    bossPower: cc.Label = null;
    @property(cc.Label)
    bossName: cc.Label = null;

    @property(cc.Button)
    btnEnd: cc.Button = null;

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
        this.nodeEnemy.position = cc.v2(15+cc.winSize.width,this.nodeEnemy.position.y);
        this.nodeMine.position = cc.v2(15-cc.winSize.width,this.nodeMine.position.y);
    }

    private show(){
        this.reset();
        var seq =cc.sequence(
            cc.fadeIn(0.6),
            cc.callFunc(()=>{
                Fight.startFight();
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
        this.btnEnd.node.on(cc.Node.EventType.TOUCH_START,this.onEndTouch,this);
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
    }

    private onEndTouch(e){
        this.btnEnd.node.active = false;
        Fight.endFight();
    }

    private initView(){
        this.initMyView();
        this.initEnemyView();
    }

    private initMyView(){
        this.myLevel.string = "Lv."+this._fihgtMine.playerLevel;
        this.myName.string = this._fihgtMine.playerName;
        this.mySex.load(PathUtil.getSexIconUrl(this._fihgtMine.playerSex));
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
        if(this._fightEnemy.isPlayer){
            this.playerNode.active = true;
            this.bossNode.active = false;

            this.playerLevel.string = "Lv."+this._fightEnemy.playerLevel;
            this.playerName.string = this._fightEnemy.playerName;
            this.playerSex.load(PathUtil.getSexIconUrl(this._fightEnemy.playerSex));
            this.playerPower.string = this._fightEnemy.totalPower.toString();
        }else{
            this.playerNode.active = false;
            this.bossNode.active = true;

            this.bossName.string = this._fightEnemy.playerName;
            this.bossPower.string = this._fightEnemy.totalPower.toString();
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
    /////////////////////// 
    //    ACTIONS 
    //////////////////////
    private _result:FightResult;
    private _delayAction = 0.6;
    private _myReadyActions:Array<CardAcitonObject> = [];
    private _enemyReadyActions:Array<CardAcitonObject> =[];

    public initResult(result:FightResult){
        this._result = result;
        var card:CardFight;
        var i:number = 0;
        var buff:BuffAction;
        if(result.fightReady.myBuffs.length>0){
            this._myReadyActions = [];
            for(i = 0;i<this._result.fightReady.myBuffs.length;i++){
                buff = this._result.fightReady.myBuffs[i];
                card = this.getCardFightWithPos(buff.fromPos,buff.isMyTeam);
                this._myReadyActions.push(new CardAcitonObject(card,buff));
            }
        }
        if(result.fightReady.enemyBuffs.length>0){
            this._enemyReadyActions =[];
            for(i = 0;i<this._result.fightReady.enemyBuffs.length;i++){
                buff = this._result.fightReady.enemyBuffs[i];
                card = this.getCardFightWithPos(buff.fromPos,buff.isMyTeam);
                this._enemyReadyActions.push(new CardAcitonObject(card,buff));
            }
        }
        this.scheduleOnce(this.playActions,this._delayAction);
    }

    private playActions(){
        if(this._myReadyActions.length > 0){
            this._myReadyActions.forEach((cardAction:CardAcitonObject)=>{
                cardAction.card.playAction(cardAction.action,()=>{
                    cardAction.complete = true;
                    if(this.checkAllActionsComplete(this._myReadyActions)){
                        this._myReadyActions =[];
                        this.scheduleOnce(this.playActions,this._delayAction);
                    }
                });
            })
        }else if(this._enemyReadyActions.length > 0){
            this._enemyReadyActions.forEach((cardAction:CardAcitonObject)=>{
                cardAction.card.playAction(cardAction.action,()=>{
                    cardAction.complete = true;
                    if(this.checkAllActionsComplete(this._enemyReadyActions)){
                        this._enemyReadyActions =[];
                        this.scheduleOnce(this.playActions,this._delayAction);
                    }
                });
            })
        }
    }

    private checkAllActionsComplete(actions:CardAcitonObject[]):boolean{
        var complete:boolean = true;
        actions.forEach((action:CardAcitonObject)=>{
            complete = action.complete && complete;
        })
        return complete;
    }
    // update (dt) {}

    public showBuffFly(index:number,buff:BuffAction,fromPos:cc.Vec2,toPos:cc.Vec2,cb:Function){
        fromPos = this.buffNode.convertToNodeSpace(fromPos);
        toPos = this.buffNode.convertToNodeSpaceAR(toPos);
        UI.loadUI(ResConst.BuffNode,{type:buff.buffType,sign:buff.skill.skillCfg.skillSign},this.buffNode,(ui:UIBase)=>{
            (ui as BuffNode).showFly(index,fromPos,toPos,()=>{
                cb();
            });
        })
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
}
