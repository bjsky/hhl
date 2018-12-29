
import NetConst from "../NetConst";
import MessageBase from "./MessageBase";
import MsgCardSummon, { SCardInfo, CardSummonType } from "./MsgCardSummon";
import { GLOBAL, ServerType } from "../../GlobalData";

/**
 * 登录客户端数据
 */
export class CSLoginData {
    public accountId:string;  
    public adId:string;
    public shareId:string;
}

/**
 * 登录服务器数据
 */
export class SCLoginData {
    //每天首次登录
    public firstLogin:boolean  = false;
    //用户信息
    public userInfo:SUserInfo = null;
    //资源信息
    public resInfo:SResInfo = null;
    //引导数据
    public guideInfo:SGuideInfo = null;
    // 建筑数据
    public buildInfos:Array<SBuildInfo> = [];
    //祭坛灵石召唤次数
    public stoneSummonNum:number = 0;
    //祭坛视频召唤次数
    public videoSummonNum:number = 0;
    //拥有的卡牌
    public ownerCards:Array<SCardInfo> = [];
    //所有卡牌
    public lineUpCardsUuid:Array<string> = [];

    public static parse(obj:any):SCLoginData{
        var data:SCLoginData = new SCLoginData();
        data.firstLogin = obj.firstLogin;
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.resInfo = SResInfo.parse(obj.resInfo);
        data.guideInfo = SGuideInfo.parse(obj.guideInfo);
        //解析building
        data.buildInfos = [];
        if(obj.buildInfos!=undefined){
            obj.buildInfos.forEach(info => {
                var buildInfo:SBuildInfo = SBuildInfo.parse(info);
                data.buildInfos.push(buildInfo);
            });
        }
        data.stoneSummonNum = obj.stoneSummonNum;
        data.videoSummonNum = obj.videoSummonNum;
        obj.ownerCards.forEach(cardObj => {
            data.ownerCards.push(SCardInfo.parse(cardObj));
        });
        obj.lineUpCardsUuid.forEach(lineUpCardUUid => {
            data.lineUpCardsUuid.push(lineUpCardUUid);
        });

        return data;
    }
}

export class SUserInfo {
    //用户名
    public nickName:string = "";
    //头像url
    public headPic:string = "";
    //当前经验
    public exp:number = 0;
    //当前等级
    public level:number = 1;

    public static parse(obj:any):SUserInfo{
        var info:SUserInfo = new SUserInfo();
        info.nickName = obj.nickName;
        info.headPic = obj.headPic;
        info.exp = obj.exp;
        info.level = obj.level;

        return info;
    }
}

export class SResInfo{
    //金币
    public gold:number = 0;
    //钻石
    public diamond:number = 0;
    //灵石
    public lifeStone:number = 0;
    //魂石 
    public soulStone:number = 0;

    public static parse(obj:any):SResInfo{
        var info:SResInfo = new SResInfo();
        info.gold = obj.gold;
        info.diamond = obj.diamond;
        info.lifeStone = obj.lifeStone;
        info.soulStone = obj.soulStone;
        return info;
    }
}

export class SGuideInfo{
    //引导步骤
    public guideId:number = -1;  //-1:引导完成

    public static parse(obj:any):SGuideInfo{
        var info:SGuideInfo = new SGuideInfo();
        info.guideId = obj.guideId;
        return info;
    }

}
export class SBuildInfo{
    // 建筑type
    public type:number = 0;
    // 建筑等级
    public level:number = 1;
    // 是否锁定——锁定的不产生五彩石
    public locked:boolean = false;
    //五彩石
    public colorStones:Array<SColorStoneInfo> = [];

    public static parse(info:any):SBuildInfo{
        var buildInfo:SBuildInfo = new SBuildInfo();
        buildInfo.type = info.type;
        buildInfo.level = info.level;
        buildInfo.locked = info.locked;
        if(info.colorStones!=undefined){
            buildInfo.colorStones = [];
            info.colorStones.forEach(stone => {
                var stoneInfo:SColorStoneInfo = SColorStoneInfo.parse(stone);
                buildInfo.colorStones.push(stoneInfo);
            });
        }
        return buildInfo;
    }
}

export class SColorStoneInfo{
    //开始产生时间
    public time:number = 0;
    //资源类型
    public resType:number = 0;
    //资源数量
    public resNum:number = 0;

    public static parse(obj:any):SColorStoneInfo{
        var info:SColorStoneInfo = new SColorStoneInfo();
        info.time = obj.time;
        info.resType = obj.resType;
        info.resNum = obj.resNum;
        return info;
    }
}

export default class MsgLogin
 extends MessageBase {
    public param:CSLoginData;
    public resp:SCLoginData;

    constructor(){
        super(NetConst.Login);
        this.isLocal = true;
    }

    public static create(accountId,shareId,adId){
        var msg = new MsgLogin();
        msg.param = new CSLoginData();
        msg.param.accountId = accountId;
        msg.param.shareId = shareId;
        msg.param.adId = adId;
        return msg;
    }

    public respFromLocal(){
        var ownerCards:Array<any> = [];
        for(var i:number = 0;i<5;i++){
            ownerCards.push(MsgCardSummon.randomCardInfo(CardSummonType.LifeStone));
        }
        var json:any = {firstLogin:true,
            userInfo:{nickName:"上古战神",headPic:"",exp:100,level:5},
            resInfo:{gold:9000,diamond:20,lifeStone:5000,soulStone:370},
            guideInfo:{guideId:-1},
            buildInfos:[{type:0,level:1,locked:true},
                {type:1,level:2,locked:true},
                {type:2,level:1,locked:true},
                {type:3,level:1,locked:true},],
            stoneSummonNum:0,videoSummonNum:0,
            ownerCards:ownerCards,
            lineUpCardsUuid:[]
        };
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        var data:SCLoginData = SCLoginData.parse(obj);
        this.resp = data;
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}