import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import { Fight } from "../../module/fight/FightAssist";
import FightInfo from "../../model/FightInfo";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { FightResult } from "../../module/fight/FightLogic";

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
    bg: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Label)
    myPower: cc.Label = null;
    @property(cc.Label)
    myName: cc.Label = null;
    @property(cc.Label)
    myLevel: cc.Label = null;
    @property(cc.Label)
    mySex: cc.Label = null;

    @property(cc.Node)
    playerNode: cc.Node = null;
    @property(cc.Label)
    playerPower: cc.Label = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    playerLevel: cc.Label = null;
    @property(cc.Label)
    playerSex: cc.Label = null;

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

    public hide(){
        var seq =cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(()=>{
                UI.closePopUp(this.node);
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
        this.mySex.string = this._fihgtMine.playerSex ==1?"男":"女";
        this.myPower.string = this._fihgtMine.totalPower.toString();

        var nodeCard:cc.Node;
        for(var i:number = 0;i<this.nodeMyCards.length;i++){
            nodeCard = this.nodeMyCards[i];
            nodeCard.removeAllChildren();
            UI.loadUI(ResConst.CardFight,{data:this._fihgtMine.lineup[i]},nodeCard);
        }
    }

    private initEnemyView(){
        if(this._fightEnemy.isPlayer){
            this.playerNode.active = true;
            this.bossNode.active = false;

            this.playerLevel.string = "Lv."+this._fightEnemy.playerLevel;
            this.playerName.string = this._fightEnemy.playerName;
            this.playerSex.string = this._fightEnemy.playerSex ==1?"男":"女";
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
            nodeCard.removeAllChildren();
            UI.loadUI(ResConst.CardFight,{data:this._fightEnemy.lineup[i]},nodeCard);
        }
    }

    public playAction(result:FightResult){
        
    }

    // update (dt) {}
}
