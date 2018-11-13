import NetConst from "../NetConst";
import MsgLogin from "./MsgLogin";

export default class MessageBase {

    public id:number = -1;
    public param:any = null;
    public resp:any = null;

    // local 配置
    public isLocal:boolean = false;
    constructor(id:number){
        this.id = id;
    }

    //本地数据回调
    public respFromLocal():MessageBase{
        return null;
    }
    //服务器数据回调
    public respFromServer(json:any):MessageBase{
        this.resp = this.parse(json);
        return this;
    }

    protected parse(obj:any){
        return null;
    }

    //创建response message
    public static createMessage(id:number){
        var message:MessageBase;
        switch(id){
            case NetConst.Login:
            // message = new MsgLogin();
            break;
        }
        return message;
    }
}
