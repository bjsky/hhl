import UIBase from "./UIBase";
import ButtonEffect from "./ButtonEffect";
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

@ccclass
export default class PopUpBase extends UIBase {

    @property(cc.Button)
    closeBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    onEnable(){
        if(this.closeBtn!=null){
            this.closeBtn.node.on(ButtonEffect.CLICK_END,this.onClose,this);
        }
        this.onShow();
    }

    onDisable(){
        if(this.closeBtn!=null){
            this.closeBtn.node.off(ButtonEffect.CLICK_END,this.onClose,this);
        }
    }
    start () {

    }
    
    protected onShow(){
        this.node.opacity = 0;
        var seq = cc.sequence(
            cc.fadeIn(0.15).easing(cc.easeOut(1.5)),
            cc.callFunc(this.onShowComplete.bind(this))
        )
        this.node.runAction(seq);
    }
    protected onShowComplete(){

    }

    protected onClose(e){
        var seq = cc.sequence(
            cc.fadeOut(0.1).easing(cc.easeIn(1.5)),
            cc.callFunc(this.onCloseComplete.bind(this))
        )
        this.node.runAction(seq);
    }

    protected onCloseComplete(){
        UI.closePopUp(this.node);
    }

    // update (dt) {}
}
