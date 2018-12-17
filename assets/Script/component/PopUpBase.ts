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
        this.closeBtn.node.on(ButtonEffect.CLICK_END,this.onClose,this);
        this.onShow();
    }

    onDisable(){
        this.closeBtn.node.off(ButtonEffect.CLICK_END,this.onClose,this);
    }
    start () {

    }
    protected onShow(){
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.15))
    }

    protected onClose(e){
        this.node.runAction(cc.sequence(cc.fadeOut(0.1),cc.callFunc(()=>{
            UI.closePopUp(this.node);
        })))
    }

    // update (dt) {}
}
