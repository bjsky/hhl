import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MessageDataBase from "./MessageDataBase";
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
    //首次登录
    public firstLogin:boolean  = false;
}

export default class MsgLogin extends MessageBase {
    public param:CSLoginData;
    public resp:SCLoginData;

    constructor(){
        super(NetConst.Login);
    }

    public static createLoaclQuery(){
        var msg = new MsgLogin();
        msg.isLocal = true;
        msg.query("123","","");
        return msg;
    }

    public query(accountId,shareId,adId){
        this.param = new CSLoginData();
        this.param.accountId = accountId;
        this.param.shareId = shareId;
        this.param.adId = adId;
    }

    public respFromLocal(){
        this.resp = new SCLoginData();
        this.resp.firstLogin = true;
        return this;
    }
    
    public respFromServer(json:any){
        this.resp = new SCLoginData();
        return this;
    }
}