import { WeiXin } from "../../wxInterface";
import PopUpBase from "../../component/PopUpBase";
import { Share } from "../../module/share/ShareAssist";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";

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
export default class SharePanel extends PopUpBase{

    @property(cc.Button)
    btnShare: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable(){
        super.onEnable();
        this.btnShare.node.on(cc.Node.EventType.TOUCH_START,this.onShare,this);
        EVENT.on(GameEvent.ShareGetReward_Complete,this.shareComplete,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnShare.node.off(cc.Node.EventType.TOUCH_START,this.onShare,this);
        EVENT.off(GameEvent.ShareGetReward_Complete,this.shareComplete,this);
    }

    private onShare(){
        Share.shareAppMessage();

        //假定时 
        this.scheduleOnce(()=>{
            Share.shareGetReward();
        },0.1)
    }

    private initView(){
        this.btnShare.node.active = Share.shareEnable;
    }

    private shareComplete(e){
        this.initView();
    }
    start () {

    }

    // update (dt) {}
}
