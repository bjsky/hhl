import { CONSTANT } from "../../Constant";
import { WeiXin } from "../../wxInterface";
import { GLOBAL, ServerType } from "../../GlobalData";
import { NET } from "../../net/core/NetController";
import MsgGetReward from "../../net/msg/MsgGetReward";
import { COMMON } from "../../CommonData";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { GUIDE } from "../../manager/GuideManager";
import { Task, TaskType } from "../TaskAssist";
import { ResType } from "../../model/ResInfo";

export default class ShareAssist{
    private static _instance: ShareAssist = null;
    public static getInstance(): ShareAssist {
        if (ShareAssist._instance == null) {
            ShareAssist._instance = new ShareAssist();
            
        }
        return ShareAssist._instance;
    }

    public todayShareCount:number = 0;
    public maxShareCount:number = 0;
    public shareGetDiamond:number = 0;
    public initShare(count:number){
        this.todayShareCount = count;

        this.maxShareCount = CONSTANT.getMaxShareCount();
        this.shareGetDiamond = CONSTANT.getShareGetDiamond();
    }
    
    public get shareEnable(){
        return !GUIDE.isInGuide;
    }

    public get shareGetReward(){
        return this.todayShareCount <this.maxShareCount;
    }

    public get canShareGetReward(){
        return this.shareGetReward;
    }

    private _shareSuccessCB:Function = null;
    private _shareFailCb:Function = null;
    private _shareOnHideTime:number = 0;
    public get isShareOnHide(){
        return this._shareOnHideTime>0;
    }
    //分享链接
    public shareAppMessage(success:Function,fail:Function){
        this._shareSuccessCB = success;
        this._shareFailCb =fail;
        if(GLOBAL.serverType == ServerType.Publish){
            var title:string ="快来玩大家都在玩的洪荒故事小游戏！";
            var imgUrl:string ="https://www.xh52.top/resShare/share_1.jpg";
            var query:string ="";
            
            this._shareOnHideTime = COMMON.getServerTime();
            console.log("share on hide:",this._shareOnHideTime);
            WeiXin.shareAppMessage(title,imgUrl,query);
            //完成任务 
            Task.finishTask(TaskType.ShareFriend);
        }else if(GLOBAL.serverType == ServerType.Debug){
            this._shareSuccessCB();

            this._shareSuccessCB = null;
            this._shareFailCb = null;
        }
    }

    public shareOnShow(){
        var time :number = COMMON.getServerTime();
        console.log("share on show:",time);
        if(time - this._shareOnHideTime>3000){
            this._shareOnHideTime = 0;
            this._shareSuccessCB();
        }else{
            this._shareFailCb && this._shareFailCb();
        }

        this._shareSuccessCB = null;
        this._shareFailCb = null;
    }
    //分享获得奖励
    public getShareReward(){
        NET.send(MsgGetReward.create(ResType.diamond,this.shareGetDiamond,true),(msg:MsgGetReward)=>{
            if(msg && msg.resp){
                COMMON.updateResInfo(msg.resp.resInfo);
                this.todayShareCount = msg.resp.todayShareCount;

                //分享获得钻石成功，刷新节目
                EVENT.emit(GameEvent.ShareGetReward_Complete);
                UI.createPopUp(ResConst.singleAwardPanel,
                    {type:ResType.diamond,num:this.shareGetDiamond})
            }
        },this)
    }
}
export var Share :ShareAssist = ShareAssist.getInstance();