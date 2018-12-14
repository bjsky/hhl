import UIBase from "../../component/UIBase";
import { COMMON } from "../../CommonData";
import StringUtil from "../../utils/StringUtil";
import TouchHandler from "../../component/TouchHandler";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import { UI } from "../../manager/UIManager";
import { AlertBtnType } from "../AlertPanel";

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
    @property(cc.Node)
    sideRNode: cc.Node = null;

    @property(cc.Node)
    nodeActivity: cc.Node = null;
    @property(cc.Node)
    nodeActivityDetail: cc.Node = null;
    @property(cc.Node)
    nodeTaskDetail: cc.Node = null;
    @property(cc.Button)
    btnAcitveArrow: cc.Button = null;
    @property(cc.Button)
    btnTaskArrow: cc.Button = null;
    @property(cc.Node)
    btnTaskArrowF: cc.Node = null;
    

    @property(cc.Label)
    lblName: cc.Label = null;
    @property(cc.Label)
    labelLv: cc.Label = null;
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

    @property(cc.Button)
    taskBtn: cc.Button = null;
    @property(cc.Button)
    chatBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        this.initTopView();
        this.nodeActivityDetail.active = true;
        this.nodeActivityDetail.setPosition(643,396);
    }

    start () {
        if(this._showAction){
            this.topNode.setPosition(cc.v2(0,200));
            this.topNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.bottomNode.setPosition(cc.v2(0,-200));
            this.bottomNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.sideNode.setPosition(cc.v2(-500,0));
            this.sideNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
            this.sideRNode.setPosition(cc.v2(200,0));
            this.sideRNode.runAction(cc.moveTo(0.15,COMMON.ZERO));
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
        this.labelLv.string = COMMON.userInfo.level.toString();
    }

    private resUpdateCost(e){
        var types:any[] = e.detail.types;
        types.forEach((obj)=>{
            switch(obj.type){
                case ResType.gold:
                this.lblGold.string = StringUtil.formatReadableNumber(COMMON.resInfo.gold);
                UI.showCostTip("-"+StringUtil.formatReadableNumber(obj.value),this.lblGold.node.parent.convertToWorldSpaceAR(this.lblGold.node.position));
                break;
                case ResType.lifeStone:
                this.lblLifeStone.string = StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
                if(obj.value>0){
                    UI.showCostTip("-"+StringUtil.formatReadableNumber(obj.value),this.lblLifeStone.node.parent.convertToWorldSpaceAR(this.lblLifeStone.node.position));
                }
                break;
            }
        })

    }

    onEnable(){
        this.lblExp.node.on(cc.Node.EventType.TOUCH_START,this.onLabelExpTouch,this);

        this.nodeActivity.on(TouchHandler.TOUCH_CLICK,this.onOpenActivity,this);
        this.btnAcitveArrow.node.on(TouchHandler.TOUCH_CLICK,this.onCloseActivity,this);
        this.btnTaskArrow.node.on(TouchHandler.TOUCH_CLICK,this.onTaskOpenClose,this)
        this.taskBtn.node.on(cc.Node.EventType.TOUCH_START,this.onTaskBtnTouch,this);

        EVENT.on(GameEvent.Res_update_Cost_Complete,this.resUpdateCost,this);
    }



    onDisable(){
        this.lblExp.node.off(cc.Node.EventType.TOUCH_START,this.onLabelExpTouch,this);

        this.nodeActivity.off(TouchHandler.TOUCH_CLICK,this.onOpenActivity,this);
        this.btnAcitveArrow.node.off(TouchHandler.TOUCH_CLICK,this.onCloseActivity,this)
        this.btnTaskArrow.node.off(TouchHandler.TOUCH_CLICK,this.onTaskOpenClose,this)
        this.taskBtn.node.off(cc.Node.EventType.TOUCH_START,this.onTaskBtnTouch,this)

        EVENT.off(GameEvent.Res_update_Cost_Complete,this.resUpdateCost,this);
    }


    private _showLabelExp:boolean = true;
    private onLabelExpTouch(e){
        this._showLabelExp = !this._showLabelExp;
        this.lblExp.node.runAction(this._showLabelExp?cc.fadeIn(0.15):cc.fadeOut(0.15));
    }
    // update (dt) {}

    private onOpenActivity(e){
        this.nodeActivity.runAction(cc.sequence(cc.fadeOut(0.1),cc.callFunc(()=>{ this.nodeActivity.active = false})));
        this.nodeActivityDetail.runAction(cc.moveBy(0.2,cc.v2(-400,0)));
    }
    private onCloseActivity(e){
        this.nodeActivity.active = true;
        this.nodeActivity.runAction(cc.fadeIn(0.1));
        this.nodeActivityDetail.runAction(cc.moveBy(0.2,cc.v2(400,0)));
    }

    private _taskOpen:boolean = true;
    private onTaskOpenClose(e){
        if(this._taskOpen){
            this.nodeTaskDetail.runAction(cc.sequence(cc.moveTo(0.2,cc.v2(-643,-274)),cc.callFunc(()=>{
                this._taskOpen = false;
                this.btnTaskArrowF.scaleX = -1;
            })));
        }else{
            this.nodeTaskDetail.runAction(cc.sequence(cc.moveTo(0.2,cc.v2(-350,-274)),cc.callFunc(()=>{
                this._taskOpen = true;
                this.btnTaskArrowF.scaleX = 1;
            })));
        }
    }

    private onTaskBtnTouch(e){
        UI.showAlert("功能暂未开放，敬请期待！",null,null,AlertBtnType.OKAndCancel);
    }
}
