import NetConst from "./NetConst";
import { NET } from "./core/NetController";
import { EVENT } from "../message/EventCenter";
import { UI } from "../manager/UIManager";
import { GAME } from "../GameController";
import MessageBase from "./msg/MessageBase";
import MsgUtil from "./msg/MsgUtil";
import { Battle } from "../module/battle/BattleAssist";
import MsgPushFightCard from "./msg/MsgPushFightCard";

export default class NetMessage extends cc.Component{

    start () {

    }
    onEnable() {
        EVENT.on(NET.NET_MESSAGE, this.onNetMessage, this);
    }

    onDisable() {
        EVENT.off(NET.NET_MESSAGE, this.onNetMessage, this);
    }
    private onNetMessage(e:any)
    {
        let msgid = e.detail.id+"";
        
        switch(msgid)
        {
            case NetConst.NET_Connecting:
            {
                UI.addLoadingLayer();
            }   
            break;
            case NetConst.NET_Connected:
            {
                UI.removeLoadingLayer();
            }                
            break;
            case NetConst.ExceptionCmd:{
                let msg = e.detail.data.errorCode+","+e.detail.data.errorMsg;
                if(CC_DEBUG) {
                    msg = JSON.stringify(e.detail.data);
                }
                // altp = AlertPanel.showAlert("",msg);
            }break;
            case NetConst.NET_CLOSE:{
                // this.forceReConnect();
                this.retryConnect("网络异常","链接已断开，请检查网络状态后重试",NetConst.NET_CLOSE);
            }break;
            case NetConst.NET_ERROR:{
                this.retryConnect("网络异常","链接错误，请检查网络后重试",NetConst.NET_ERROR);
            }break;
            case NetConst.NET_ConnectTimeOut:
            {
                this.retryConnect("超时警告","链接超时，请检查网络后重试",NetConst.NET_ConnectTimeOut);
            }                
            break;
            default:{
                this.MsgPushParser(Number(msgid),e.detail.data);
            }
            break;
        }
    }

    private MsgPushParser(id:number,data:any)
    {
        console.log("推通消息处理：",id,JSON.stringify(data));
        var message:MessageBase;
        switch(id)
        {
            case NetConst.PushFightCard:{
                message = MsgUtil.createMessage(id);
                message = message.respFromServer(data);
                Battle.onPushRabCard(message as MsgPushFightCard);
            }break;
        }

    }
    private retryConnect(tittle:string,content:string,src:string)
    {
        console.log("Retry Connect:",",type:",src);
        UI.showNetAlert(tittle,content,()=>{
            GAME.reLogin();
        });
        if(CC_DEBUG)
        {
            console.log(src);
        }
    }

}
