import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SResInfo } from "./MsgLogin";
import { COMMON } from "../../CommonData";
import { Share } from "../../module/share/ShareAssist";
import { ResType } from "../../model/ResInfo";

//获得奖励参数
export class CSGetReward{
    //奖励的类型
    public type:ResType = 0;
    //奖励的数量(客户端取到了发给服务器)
    public rewardNum:number = 0;
    //是否分享
    public share:boolean = false;
}

//获得奖励返回
export class SCGetReward{
    //最新的资源
    public resInfo:SResInfo = null;
    //分享次数，统一都返回
    public todayShareCount:number  = 0;

    public static parse(obj:any):SCGetReward{
        var data:SCGetReward = new SCGetReward();
        data.resInfo = SResInfo.parse(obj.resInfo);
        data.todayShareCount = Number(obj.todayShareCount);
        return data;
    }
}
export default class MsgGetReward extends MessageBase{
    public param:CSGetReward;
    public resp:SCGetReward;

    constructor(){
        super(NetConst.GetReward);
        // this.isLocal = true;
    }

    public static create(type:ResType,rewardNum:number,isShare:boolean){
        var msg = new MsgGetReward();
        msg.param = new CSGetReward();
        msg.param.type = type;
        msg.param.rewardNum = rewardNum;
        msg.param.share = isShare;
        return msg;
    }

    public respFromLocal(){
        var json:any;
        var resInfo:SResInfo = COMMON.resInfo.cloneServerInfo();
        var shareCount:number = Share.todayShareCount;
        if(this.param.type == ResType.gold){
            resInfo.gold += this.param.rewardNum;
        }else if(this.param.type == ResType.lifeStone){
            resInfo.lifeStone += this.param.rewardNum;
        }else if(this.param.type == ResType.diamond){
            resInfo.diamond += this.param.rewardNum;
        }
        if(this.param.share){
            shareCount +=1;
        }
        json = {resInfo:resInfo,
            todayShareCount:shareCount
            };
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCGetReward.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}