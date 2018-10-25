import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";

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
export default class TemplePanel extends UIBase {

    @property(cc.Button)
    closeBtn: cc.Button = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:
    onEnable(){
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_START,this.onClose,this);
    }

    onDisable(){
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_START,this.onClose,this);
    }

    private onClose(){
        UI.removeUI(this.node);
    }
    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
