import UIBase from "../../component/UIBase";
import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { UI } from "../../manager/UIManager";
import TouchHandler from "../../component/TouchHandler";

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
export default class EnmeyItemUI extends DListItem{

    @property(LoadSprite)
    sprHead: LoadSprite = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    onEnable(){
        this.sprHead.node.on(TouchHandler.TOUCH_CLICK,this.onHeadTouch,this);
    }
    onDisable(){
        this.sprHead.node.off(TouchHandler.TOUCH_CLICK,this.onHeadTouch,this);
    }

    private onHeadTouch(e){
        UI.createPopUp(ResConst.FighterDetailPanel,{});
    }

    start () {

    }

    // update (dt) {}
}
