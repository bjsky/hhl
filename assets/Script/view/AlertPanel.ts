import UIBase from "../component/UIBase";
import { UI } from "../manager/UIManager";

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

export enum AlertBtnType {
    OKButton = 0,
    OKAndCancel = 1,
}

@ccclass
export default class AlertPanel extends UIBase {

    @property(cc.Label)
    content: cc.Label = null;
    @property(cc.Button)
    btnOk: cc.Button = null;
    @property(cc.Button)
    btnCancel: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _btnType:AlertBtnType;
    private _content:string;
    private _okCb:Function;
    private _cancelCb:Function;

    /**
     * setData
     */
    public setData(data:any) {
        this._content = data.content;
        this._btnType = data.btnType;
        this._okCb = data.okCb;
        this._cancelCb = data.cancelCb;
        if(this._btnType == AlertBtnType.OKButton){
            this.btnCancel.node.active = false;
            this.btnOk.node.setPosition(cc.v2(0,-55))
        }else if(this._btnType == AlertBtnType.OKAndCancel){
            this.btnCancel.node.active = true;
            this.btnOk.node.setPosition(cc.v2(-80,-55))
        }
        this.content.string = this._content;
    }

    onEnable(){
        this.btnOk.node.on(cc.Node.EventType.TOUCH_START,this.onOKTouch,this);
        this.btnCancel.node.on(cc.Node.EventType.TOUCH_START,this.onCancelTouch,this);
        this.showPanel();
    }

    onDisable(){
        this.btnOk.node.off(cc.Node.EventType.TOUCH_START,this.onOKTouch,this);
        this.btnCancel.node.off(cc.Node.EventType.TOUCH_START,this.onCancelTouch,this);
    }

    private onOKTouch(e){
        this.closePanel(true);
    }
    private onCancelTouch(e){
        this.closePanel(false);
    }

    private showPanel(){
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.15))
    }
    private closePanel(clickOk:boolean){
        this.node.runAction(cc.sequence(cc.fadeOut(0.1),cc.callFunc(()=>{
            UI.closePopUp(this.node);
            if(clickOk) this._okCb && this._okCb(this);
            else this._cancelCb && this._cancelCb(this);
        })))
    }
    start () {
        
    }

    // update (dt) {}
}
