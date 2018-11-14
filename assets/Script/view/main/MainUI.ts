import UIBase from "../../component/UIBase";
import { COMMON } from "../../CommonData";
import StringUtil from "../../utils/StringUtil";

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
export default class MainUI extends UIBase {

    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    sideNode: cc.Node = null;

    @property(cc.Label)
    lblName: cc.Label = null;
    @property(cc.Label)
    lblExp: cc.Label = null;
    @property(cc.Label)
    lblGold: cc.Label = null;
    @property(cc.Label)
    lblDiamond: cc.Label = null;
    @property(cc.Label)
    lblLifeStone: cc.Label = null;
    @property(cc.Label)
    lblSoulStone: cc.Label = null;
    @property(cc.ProgressBar)
    progressExp: cc.ProgressBar = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.initTopView();

    }

    start () {
        if(this._showAction){
            this.topNode.setPosition(cc.v2(0,200));
            this.topNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.bottomNode.setPosition(cc.v2(0,-200));
            this.bottomNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.sideNode.setPosition(cc.v2(-500,0));
            this.sideNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
        }
    }

    private _showAction:boolean = false;
    public setData(data:any){
        this._showAction = data.showAction;
    }

    private initTopView(){
        this.lblName.string = COMMON.userInfo.nickName;
        this.lblExp.string = COMMON.userInfo.exp + " / "+COMMON.userInfo.totalExp;
        this.lblGold.string = StringUtil.formatReadableNumber(COMMON.resInfo.gold);
        this.lblDiamond.string = StringUtil.formatReadableNumber(COMMON.resInfo.diamond);
        this.lblLifeStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
        this.lblSoulStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.soulStone);
        this.progressExp.progress = COMMON.userInfo.exp / COMMON.userInfo.totalExp;
    }

    onEnable(){
        this.lblExp.node.on(cc.Node.EventType.TOUCH_START,this.onLabelExpTouch,this);
    }



    onDisable(){
        this.lblExp.node.off(cc.Node.EventType.TOUCH_START,this.onLabelExpTouch,this);
    }


    private _showLabelExp:boolean = true;
    private onLabelExpTouch(e){
        this._showLabelExp = !this._showLabelExp;
        this.lblExp.node.runAction(this._showLabelExp?cc.fadeIn(0.15):cc.fadeOut(0.15));
    }
    // update (dt) {}
}
