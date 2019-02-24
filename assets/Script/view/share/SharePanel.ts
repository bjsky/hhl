import PopUpBase from "../../component/PopUpBase";
import { Share } from "../../module/share/ShareAssist";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import DList, { DListDirection } from "../../component/DList";
import { ResType } from "../../model/ResInfo";
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
export default class SharePanel extends PopUpBase{

    @property(cc.Button)
    btnShare: cc.Button = null;

    // @property(cc.Button)
    // btnStore: cc.Button = null;
    @property(DList)
    listShared: DList = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable(){
        super.onEnable();
        this.btnShare.node.on(cc.Node.EventType.TOUCH_START,this.onShare,this);
        // this.btnStore.node.on(cc.Node.EventType.TOUCH_START,this.onStoreClick,this);
        EVENT.on(GameEvent.ShareGetReward_Complete,this.shareComplete,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnShare.node.off(cc.Node.EventType.TOUCH_START,this.onShare,this);
        // this.btnStore.node.off(cc.Node.EventType.TOUCH_START,this.onStoreClick,this);
        EVENT.off(GameEvent.ShareGetReward_Complete,this.shareComplete,this);
    }

    private onShare(){
        Share.shareAppMessage();

        //假定时 
        if(Share.shareGetReward){
            this.scheduleOnce(()=>{
                Share.getShareReward();
            },0.1)
        }
    }

    private initView(){
        this.btnShare.node.active = Share.shareEnable;
        var shareRewardType:ResType = ResType.diamond;
        var shareRewardNum:number = Share.shareGetDiamond;
        var listData:Array<any> = [];
        for(var i:number = 0;i<Share.maxShareCount;i++){
            var receive = i<Share.todayShareCount;
            listData.push({type:shareRewardType,num:shareRewardNum,receive:receive,index:(i+1)});
        }
        this.listShared.direction = DListDirection.Vertical;
        this.listShared.setListData(listData);
    }

    private shareComplete(e){
        this.initView();
    }
    start () {

    }

    private onStoreClick(e){
        UI.createPopUp(ResConst.StorePanel,{});
    }
    // update (dt) {}
}
