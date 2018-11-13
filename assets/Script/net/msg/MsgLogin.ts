
import NetConst from "../NetConst";
import MessageBase from "./MessageBase";

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
}

export class SGuideInfo{
    //引导步骤
    public guideId:number = -1;  //-1:引导完成

}

export default class MsgLogin extends MessageBase {
    public param:CSLoginData;
    public resp:SCLoginData;

    constructor(accountId,shareId,adId){
        super(NetConst.Login);

        this.param = new CSLoginData();
        this.param.accountId = accountId;
        this.param.shareId = shareId;
        this.param.adId = adId;
    }

    public static createLocal(){
        var msg = new MsgLogin("123","","");
        msg.isLocal = true;
        return msg;
    }

    public respFromLocal(){
        var json:any = {firstLogin:true,
            userInfo:{nickName:"上古战神",headPic:"",exp:200,level:2},
            resInfo:{gold:4600000,diamond:20,lifeStone:5000,soulStone:370},
            guideInfo:{guideId:1001}
        };
        this.resp = this.parse(json);
        return this;
    }

    protected parse(obj:any){
        var data:SCLoginData = new SCLoginData();
        data.firstLogin = obj.firstLogin;

        data.userInfo = new SUserInfo();
        data.userInfo.nickName = obj.userInfo.nickName;
        data.userInfo.headPic = obj.userInfo.headPic;
        data.userInfo.exp = obj.userInfo.exp;
        data.userInfo.level = obj.userInfo.level;

        data.resInfo = new SResInfo();
        data.resInfo.gold = obj.resInfo.gold;
        data.resInfo.diamond = obj.resInfo.diamond;
        data.resInfo.lifeStone = obj.resInfo.lifeStone;
        data.resInfo.soulStone = obj.resInfo.soulStone;

        data.guideInfo = new SGuideInfo();
        data.guideInfo.guideId = obj.guideInfo.guideId;
        return data;
    }
}