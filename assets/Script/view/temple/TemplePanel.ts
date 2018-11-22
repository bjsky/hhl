import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";

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
    lifeStoneBtn: cc.Button = null;
    @property(cc.Button)
    videoBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:
    onEnable(){
        this.lifeStoneBtn.node.on(cc.Node.EventType.TOUCH_START,this.onLifeStoneClick,this);
        this.videoBtn.node.on(cc.Node.EventType.TOUCH_START,this.onVideoClick,this);
    }

    onDisable(){
        this.lifeStoneBtn.node.off(cc.Node.EventType.TOUCH_START,this.onLifeStoneClick,this);
        this.videoBtn.node.off(cc.Node.EventType.TOUCH_START,this.onVideoClick,this);
    }


    private onLifeStoneClick(e){
        UI.createPopUp(ResConst.CardDetail,{});
    }

    private onVideoClick(e){
        UI.createPopUp(ResConst.CardGet,{});
    }
    // onLoad () {}

    start () {

    }

    // update (dt) {}
}