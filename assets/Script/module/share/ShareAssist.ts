import { CONSTANT } from "../../Constant";
import { WeiXin } from "../../wxInterface";
import { GLOBAL, ServerType } from "../../GlobalData";
import { NET } from "../../net/core/NetController";
import MsgGetReward, { GetRewardType } from "../../net/msg/MsgGetReward";
import { COMMON } from "../../CommonData";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { GUIDE } from "../../manager/GuideManager";

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

    //分享链接
    public shareAppMessage(){
        if(GLOBAL.serverType == ServerType.Publish){
            var title:string ="快来玩大家都在玩的洪荒题材小游戏！";
            var imgUrl:string ="https://www.xh52.top/resShare/share_1.jpg";
            var query:string ="";

            WeiXin.shareAppMessage(title,imgUrl,query);
        }
    }

    //分享获得奖励
    public getShareReward(){
        NET.send(MsgGetReward.create(GetRewardType.ShareGetDiamond,this.shareGetDiamond),(msg:MsgGetReward)=>{
            if(msg && msg.resp){
                COMMON.updateResInfo(msg.resp.resInfo);
                this.todayShareCount = msg.resp.todayShareCount;

                //分享获得钻石成功，刷新节目
                EVENT.emit(GameEvent.ShareGetReward_Complete);
                UI.createPopUp(ResConst.singleAwardPanel,
                    {type:GetRewardType.ShareGetDiamond,num:this.shareGetDiamond})
            }
        },this)
    }
}
export var Share :ShareAssist = ShareAssist.getInstance();