import UIBase from "../component/UIBase";
import { UI } from "../manager/UIManager";
import PopUpBase from "../component/PopUpBase";

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
export default class AlertPanel extends PopUpBase {

    @property(cc.Label)
    content: cc.Label = null;
    @property(cc.Button)
    btnOk: cc.Button = null;
    @property(cc.Button)
    btnCancel: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _btnType:AlertBtnType = AlertBtnType.OKButton;
    private _content:string;
    private _okCb:Function;
    private _cancelCb:Function;

    /**
     * setData
     */
    public setData(data:any) {
        this._content = data.content;
        if(data.btnType !=undefined){
            this._btnType = data.btnType;
        }
        this._okCb = data.okCb;
        this._cancelCb = data.cancelCb;
        if(this._btnType == AlertBtnType.OKButton){
            this.btnCancel.node.active = false;
            this.btnOk.node.setPosition(cc.v2(0,-79))
        }else if(this._btnType == AlertBtnType.OKAndCancel){
            this.btnCancel.node.active = true;
            this.btnOk.node.setPosition(cc.v2(-80,-79))
        }
        this.content.string = this._content;
    }

    onEnable(){
        super.onEnable();
        this.btnOk.node.on(cc.Node.EventType.TOUCH_START,this.onOKTouch,this);
        this.btnCancel.node.on(cc.Node.EventType.TOUCH_START,this.onCancelTouch,this);
    }

    onDisable(){
        super.onDisable();
        this.btnOk.node.off(cc.Node.EventType.TOUCH_START,this.onOKTouch,this);
        this.btnCancel.node.off(cc.Node.EventType.TOUCH_START,this.onCancelTouch,this);
    }

    private _clickOk:boolean =false;
    private onOKTouch(e){
        this._clickOk = true;
        this.onClose(e);
    }
    private onCancelTouch(e){
        this._clickOk = false;
        this.onClose(e);
    }

    protected onCloseComplete(){
        UI.closePopUp(this.node);
        if(this._clickOk) this._okCb && this._okCb(this);
        else this._cancelCb && this._cancelCb(this);
    }
    start () {
        
    }

    // update (dt) {}
}
