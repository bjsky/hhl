import NetConst from "./NetConst";
import { NET } from "./core/NetController";
import { EVENT } from "../message/EventCenter";
import { UI } from "../manager/UIManager";

export default class NetMessage extends cc.Component{
    // update (dt) {}
    private _retryNum:number=0;
    private _retryMaxNum:number=3;
    private _retryTime:number=3;

    start () {

    }
    onEnable() {
        EVENT.on(NET.NET_MESSAGE, this.onNetMessage, this);
    }

    onDisable() {
        EVENT.off(NET.NET_MESSAGE, this.onNetMessage, this);
    }
    private isInBack:boolean = false;
    private onNetMessage(e:any)
    {
        let msgid = e.id+"";
        
        switch(msgid)
        {
            case NetConst.NET_Connecting:
            {
                UI.addLoadingLayer();
            }   
            break;
            case NetConst.NET_Connected:
            {
                this._retryNum =0;
                UI.removeLoadingLayer();
            }                
            break;
            case NetConst.ExceptionCmd:{
                let msg = e.data.errorCode+","+e.data.errorMsg;
                if(CC_DEBUG) {
                    msg = JSON.stringify(e);
                }
                // altp = AlertPanel.showAlert("",msg);
            }break;
            case NetConst.NET_CLOSE:{
                this.retryLogin("网络异常","链接已断开，请检查网络状态后重试",NetConst.NET_CLOSE);
            }break;
            case NetConst.NET_ERROR:{
                this.retryLogin("网络异常","链接错误，请检查网络后重试",NetConst.NET_ERROR);
            }break;
            case NetConst.NET_ConnectTimeOut:
            {
                this.retryLogin("超时警告","链接超时，请检查网络后重试",NetConst.NET_ConnectTimeOut);
            }                
            break;
            default:{
                this.MsgPushParser(msgid,e.data);
            }
            break;
        }
    }

    private MsgPushParser(id:string,data:any)
    {
        console.log("推通消息处理：",id,JSON.stringify(data));
        switch(id)
        {
        }

    }
    //切入后台
    private onGoBack(e){
        this.isInBack = true;
    }

    private onPageBack(e){
        this.isInBack = false;
        this.retryConnectNet();
    }

    private _isRetrying:boolean = false;
    private retryLogin(tittle:string,content:string,src:string,forceAlert:boolean= false)
    {
        if(this.isInBack){
            console.log("isInBack return");
            return;
        }
        if(this._isRetrying){
            console.log("_isRetrying return");
            return;
        }
        this._isRetrying = true;
        UI.addLoadingLayer();
        console.log("Retry Connect:",this._retryNum,",type:",src);
        if(++this._retryNum<this._retryMaxNum)
        {
            // if(this._retryNum==1)
            // {
            //     //第一次的时候直接尝试 重连
            //     PANEL.showNetAlert(tittle,content,()=>{
            //         this.retryConnectNet();
            //     });
            // }
            // else
            // {
                this.scheduleOnce(()=>{
                    this.retryConnectNet();
                },this._retryTime);
            // }
            
        }
        else{
            UI.showNetAlert(tittle,content,()=>{
                // let exitMiniProgram = window['exitMiniProgram'];
                // if(exitMiniProgram!=undefined)
                // {
                //     exitMiniProgram();
                // }
                this._retryNum=0;
                this.retryConnectNet();
            });
        }
        if(CC_DEBUG)
        {
            console.log(src);
        }
    }

    private retryConnectNet(){
        this._isRetrying = false;
        NET.reConnect();
    }

    private showNetClose()
    {
        this._isRetrying = true;
        // Game.eventCenter.off(NET.NET_MESSAGE,this.onNetMessage,this);
        UI.showNetAlert("警告","你的账号在别处登陆!请重新登录",this.okCallback.bind(this));
    }

    private okCallback(){
        this.retryConnectNet();
    }
}
