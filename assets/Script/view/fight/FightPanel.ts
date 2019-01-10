import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import { Fight } from "../../module/fight/FightAssist";

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
export default class FightPanel extends UIBase {

    @property(cc.Node)
    center: cc.Node = null;
    @property(cc.Node)
    top: cc.Node = null;
    @property(cc.Node)
    bottom: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Button)
    btnEnd: cc.Button = null;

    onLoad () {
        this.reset();
    }

    start () {

    }

    private reset(){
        this.node.opacity = 0;
        this.top.opacity = 0;
        this.top.position = cc.v2(0,0);
        this.bottom.opacity = 0;
        this.bottom.position = cc.v2(0,0);
    }

    private show(){
        var seq =cc.sequence(
            cc.fadeIn(0.5),
            cc.callFunc(()=>{

            })
        );
        this.node.runAction(seq);
        this.top.position = cc.v2(0,(this.top.height +10));  //cc.v2((this.top.width +10),0)//
        this.top.opacity = 255;
        this.bottom.position = cc.v2(0,(-this.bottom.height-10));//cc.v2((-this.bottom.width-10),0);//
        this.bottom.opacity = 255;
        this.scheduleOnce(()=>{
            this.top.runAction(cc.moveTo(0.3,cc.v2(0,0)));
            this.bottom.runAction(cc.moveTo(0.3,cc.v2(0,0)));
        },0.2)
    }

    public hide(){
        var seq =cc.sequence(
            cc.fadeOut(0.4),
            cc.callFunc(()=>{
                UI.closePopUp(this.node);
            })
        );
        this.node.runAction(seq);
    }

    onEnable(){
        this.btnEnd.node.on(cc.Node.EventType.TOUCH_START,this.onEndTouch,this);
        this.show();
    }

    onDisable(){
        this.btnEnd.node.on(cc.Node.EventType.TOUCH_START,this.onEndTouch,this);
    }

    private onEndTouch(e){
        Fight.endFight();
    }


    // update (dt) {}
}
