import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MessageDataBase from "./MessageDataBase";

import UserInfo from "../../model/UserInfo";
import ResInfo from "../../model/ResInfo";
import GuideInfo from "../../model/GuideInfo";
/**
 * 登录客户端数据
 */
export class CSLoginData extends MessageDataBase{
    public accountId:string;  
    public adId:string;
    public shareId:string;
}

/**
 * 登录服务器数据
 */
export class SCLoginData extends MessageDataBase{
    //每天首次登录
    public firstLogin:boolean  = false;
    //用户信息
    public userInfo:UserInfo = null;
    //资源信息
    public resInfo:ResInfo = null;
    //引导数据
    public guideInfo:GuideInfo = null;
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
        this.resp = new SCLoginData();
        this.resp.firstLogin = true;
        this.resp.userInfo = new UserInfo().parse({nickName:"上古战神",headPic:"",exp:200,level:2});
        this.resp.resInfo = new ResInfo().parse({gold:4600000,diamond:20,lifeStone:5000,soulStone:370});
        this.resp.guideInfo = new GuideInfo().parse({guideId:1001});
        return this;
    }
    
    public respFromServer(json:any){
        this.resp = new SCLoginData();
        return this;
    }
}