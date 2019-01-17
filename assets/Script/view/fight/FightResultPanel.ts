import LoadSprite from "../../component/LoadSprite";
import PopUpBase from "../../component/PopUpBase";
import FlowGroup from "../../component/FlowGroup";
import TouchHandler from "../../component/TouchHandler";
import { Fight } from "../../module/fight/FightAssist";
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
export default class FightResultPanel extends PopUpBase {

    @property(cc.Node)
    victoryNode: cc.Node = null;
    @property(cc.Node)
    failNode: cc.Node = null;
    @property(cc.Node)
    headNode: cc.Node = null;
    @property(cc.Node)
    detailNode: cc.Node = null;
    @property(LoadSprite)
    sprLingqu: LoadSprite = null;
    @property(cc.Button)
    btnLingqu: cc.Button = null;
    @property(cc.Button)
    btnXiangxi: cc.Button = null;
    @property(LoadSprite)
    sprStar: LoadSprite = null;
    @property(FlowGroup)
    groupReward:FlowGroup = null;

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
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _result:FightResult;
    private _rewards:Array<any> =[];
    public setData(data:any){
        super.setData(data);
        this._result = data.result;
        this._rewards = data.rewards;
    }

    onEnable(){
        super.onEnable();
        this.btnLingqu.node.on(TouchHandler.TOUCH_CLICK,this.onReserveClick,this);
        this.initView();
    }
    onDisable(){
        super.onDisable();
        this.btnLingqu.node.off(TouchHandler.TOUCH_CLICK,this.onReserveClick,this);
    }

    private onReserveClick(e){
        this.onClose(e);
    }
    protected onCloseComplete(){
        super.onCloseComplete();
        
        Fight.endFight();
    }
    start () {

    }

    private initView(){
        
    }

    // update (dt) {}
}
