import Socket from "./Socket";
import { EVENT } from "../../message/EventCenter";
import NetConst from "../NetConst";
import NetMessage from "../NetMessage";
import MessageBase from "../msg/MessageBase";

export class NetController
{
    public NET_MESSAGE:string = "NET_MESSAGE";
    public RECONNECT_FINISH:string = "RECONNECT_FINISH";

    private _isConnected:boolean = false;
    private _isConnecting:boolean = false;
    private _connectCbObj:any =null;
    private _connectTimeOutTime:number =5000;
    private _connectTimeOutId:number =NaN;

    private _ip:string ="";
    private _socket:WebSocket = null;
    
    public  errorID:string = "-1";
    private _msgDict:object ={};
    private _seqId: number = 0;


    private static _inst:NetController;
    
    constructor(){
    }

    public static getInst(): NetController {
        return NetController._inst ||(NetController._inst = new NetController());
    }

    /**
     * 
     * @param ip 连接服务器地址 ip地址格式:wss://ip:port或ws://ip:port
     * @param cb 连接成功回调 cbFun()
     * @param thisObj 回调上下文
     */
    public connect(ip:string, cb:Function, thisObj:any) {
        if(this._isConnecting || this._isConnected)
        {
            return;
        }
        
        this._ip = ip;
        if(cb) {
            this._connectCbObj ={"cb":cb,"this":thisObj};
        }
        this._isConnecting = true;
        if(this._socket == null) {
            this._socket = this.createSocket(this._connectTimeOutTime);
        }
        EVENT.emit(NET.NET_MESSAGE, {id:NetConst.NET_Connecting,data:{}});
    }
    /**
     * 主动断开socket
     * @param cb 
     */
    public dismissConnect(cb:Function){
        this.dispose()
        cb&&cb()
    }

    /**
     * 发送网络消息
     * @param id 消息ID
     * @param data 消息内容 JSONOBJ
     * @param cb 消息回调 cbFun(data:string)
     * @param thisObj 回调上下文
     * @param fail 网络处理失败回调，1. 后端报错 2. 前端处理异常
     */
    public send(message:MessageBase, cb: Function, thisObj: any, fail: Function = null)
    {
        if(message.isLocal){    //本地数据
            cb.call(thisObj,message.respFromLocal());
            return;
        }
        if(this._socket)
        {
            let obj = {seq: this._seqId, "id":message.id,"data":message.param||{}}
            let msg = JSON.stringify(obj);
            //Log.debug("[net] send msg: "+msg);
            if(cb != null) {
                this._msgDict[this._seqId] = {"id": message.id, "cb":cb, "this":thisObj, fail: fail, "msg":msg};
            }
            this._socket.send(msg);
            this._seqId += 1;
        }
        else{
            console.log("网络没有链接 socket 为null");
            EVENT.emit(NET.NET_MESSAGE, {id:NetConst.NET_ERROR,data:{}});
        }
    }

    private createSocket(timeout:number){
        let ws;
        if(this._ip.indexOf("ws")!=0)
        {
            this._ip ="wss://"+this._ip
        }
        console.log("连接服务器:",this._ip);
        //超时
        this._connectTimeOutId = setTimeout(this.onTimeout.bind(this),timeout);    
        
        ws = new WebSocket(this._ip);
        
        //连接成功
        ws.onopen = this.onOpen.bind(this);
        //连接关闭
        ws.onclose = this.onClose.bind(this);
        //收到消息
        ws.onmessage = this.onMessage.bind(this);
        //出错
        ws.onerror = this.onError.bind(this);
        
        return ws;
    }
    private onOpen(e:Event = null) {
        
        this.removeTimeout();

        this._isConnected = true;
        this._isConnecting = false;
        this._seqId = 0;
        EVENT.emit(NET.NET_MESSAGE, {id:NetConst.NET_Connected,data:{}});

        // for(let key in this._msgDict) {
        //     if(this._msgDict[key].id == NetConst.Login)
        //     {
        //         delete this._msgDict[key];
        //         break;
        //     }
        // }

        let self = this;
        // GAME.initLoginTime();

        var loginData = null;
        if(self._connectCbObj)
        {
            console.log(" GAME.initLogin 187");
            self._connectCbObj.cb.call(self._connectCbObj.this);
            self._connectCbObj = null;
        }
        for(let key in self._msgDict) {
            self._socket.send(self._msgDict[key].msg);
        }

        // if ( SOCIAL.social_type == SocialAssist.SOCIAL_Wechat){
        //     loginData = {
        //         accountId: SOCIAL.socialData.openId,
        //         deviceid:DEVICE.deviceData.deviceid,appversion:DEVICE.deviceData.appversion,platform:DEVICE.deviceData.platform,   
        //         shareId: SOCIAL.socialData.currentLoginShareId, 
        //         adId: window["adId"],
        //         adMaterial:window["adMaterial"],
        //         userInfo: SOCIAL.socialData.playerWXInfoEncryption,//3级授权前没有这个数据
        //         userAuthStatus: SOCIAL.socialBase.isHasAuth(),
        //         loginType:'weixin',channel:window["channel"],
        //         code:SOCIAL.socialData.code,
        //     }
        // }else {
        //     loginData = {
        //         accountId: SOCIAL.socialData.accountId,
        //         deviceid:DEVICE.deviceData.deviceid ? DEVICE.deviceData.deviceid: SOCIAL.socialData.accountId,
        //         appversion:DEVICE.deviceData.appversion,platform:DEVICE.deviceData.platform,   
        //         shareId: SOCIAL.socialData.currentLoginShareId, 
        //         adId: window["adId"],
        //         loginType:'web',
        //         adMaterial:window["adMaterial"],
        //     }
        // }
        // if(CC_DEBUG)
        // {
        //     console.log("请求登录数据：");
        //     console.log(loginData);
        // }
        // NET.send(
        //     NetConst.Login, 
        //     loginData,
        //         function(res) {
        //             //success 
        //             SOCIAL.socialData.code ="";
        //             NET.startHeartbeat(NetConst.Heart);
        //             SOCIAL.socialBase.toBI("GameServerLoginRet", 
        //              { 
        //                 ret: 0 ,
        //                 ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
        //                 InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
        //                 InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:''
        //             }, 
        //             true);
        //             if(CC_DEBUG)
        //             {
        //                 console.log("Login 返回:");
        //                 console.log(res);
        //             }
                    
        //             GAME.initLogin(res);
        //             if(self._connectCbObj)
        //             {
        //                 console.log(" GAME.initLogin 187");
        //                 self._connectCbObj.cb.call(self._connectCbObj.this);
        //                 self._connectCbObj = null;
        //             }
        //             for(let key in self._msgDict) {
        //                 self._socket.send(self._msgDict[key].msg);
        //             }
        //         },null,(msg)=>{
        //             SOCIAL.socialBase.toBI("GameServerLoginRet",
        //             { ret: 1,
        //                 ShareID: window['WX_ShareId'] ? window['WX_ShareId']:'',
        //                 InviterID: window["WX_InviteOpenid"] ? window["WX_InviteOpenid"]:'',
        //                 InviteType: window["WX_InviteType"] ? window["WX_InviteType"]:''
        //              }
        //                 , true);
        //         });
    }

    private onMessage(e:MessageEvent) {
        var data = e.data;
        var data = e.data;
        let json = null;
        if(data.indexOf("id:")>-1) {
            console.log("此消息id属性不对：",data);
            data = data.replace("id:","id");
        }
        try{
            json = JSON.parse(data);
        } catch(e){
            this.doFailMessage(null, 'json parse err!');
            throw("socket json ");
        }
        if(json != null) {
            if(json.id == this.errorID) {   
                this.doFailMessage(json);
                console.log("消息异常:" + JSON.stringify(data));
            } else {
                this.doSuccMessage(json);
            }
            EVENT.emit(NET.NET_MESSAGE, json);
        }
    }

    /** 处理失败消息 */
    private doFailMessage(json: any, error: any = null) {
        let obj = this._msgDict[json.seq];
        if(obj != null) {
            if (obj.fail instanceof Function) {
                delete this._msgDict[json.seq];
                obj.fail.call(obj.this, json, error);
            }
        }
    }

    /** 处理成功消息 */
    private doSuccMessage(json: any) {
        var message:MessageBase = MessageBase.createMessage(json.id);
        let obj = this._msgDict[json.seq];
        if(obj != null) {
            delete this._msgDict[json.seq];
            obj.cb.call(obj.this, message?message.respFromServer(json.data):json.data);
        }
    }
    private onClose(e:CloseEvent)
    {
        console.log("socket:close")
        this.dispose();
        EVENT.emit(NET.NET_MESSAGE, {id:NetConst.NET_CLOSE,data:{}});
    }
    private onError(e:Event)
    {
        console.log("socket:error")
        this.dispose();
        EVENT.emit(NET.NET_MESSAGE, {id:NetConst.NET_ERROR,data:{}});
    }
    private onTimeout()
    {
        if(!this._socket || this._socket.readyState != WebSocket.CONNECTING){
            return;
        }
        console.log("[net] connect cnt over max ,will hint");
        this.dispose();
        EVENT.emit(NET.NET_MESSAGE, {id:NetConst.NET_ConnectTimeOut,data:{}});
    }

    public reConnect(){
        if(this._connectCbObj) //登陆重连
        {
            this.connect(this._ip, this._connectCbObj.cb, this._connectCbObj.this);
        }else{ //断线重连
            this.connect(this._ip, function() {
                EVENT.emit(NET.RECONNECT_FINISH);
            }, this);
        }
    }

    private removeTimeout(){
        if(!isNaN(this._connectTimeOutId)){
            clearInterval(this._connectTimeOutId);
            this._connectTimeOutId = NaN;
        }
    }

    private dispose(){
        this._isConnected = false;
        this._isConnecting = false;
        if(!isNaN(this._timeOutId))
        {
            clearInterval(this._timeOutId);
            this._timeOutId = NaN;
        }
        this.removeTimeout();
        if(this._socket)
        {
            if(this._socket.readyState == WebSocket.OPEN)
            {
                this._socket.close();
            }
            this._socket.onopen = this._socket.onclose = this._socket.onmessage = this._socket.onerror = null;
        }
        this._socket = null;
    }

    /**
     * 连接是否有效
     */
    public isNetUseable(){
        return this._socket!=null  && this._socket.readyState == WebSocket.OPEN;
    }

    /**计时器ID */
    private _timeOutId:number = NaN;
    /**超时次数 */
    private _timeOutNum:number;
    /**超时时长 */
    private _timeOutTime:number;
    /**
     * 启动心跳
     * @param msgId 心跳消息号
     * @param time  心跳间隔 默认15s
     */
    // public startHeartbeat(msgId:any,time:number = 15000) {
    //     this._timeOutTime = time;
    //     if(isNaN(this._timeOutId))
    //     {
    //         let self = this;

    //         this._timeOutId = setInterval(()=>{
    //             self._timeOutNum++;
    //             if(self._timeOutNum>1)
    //             {
    //                 console.log("心跳超时次数：",self._timeOutNum);
    //                 this.dispose();
    //             }else
    //             {
    //                 self.send(msgId,null,()=>{
    //                     self._timeOutNum = 0;
    //                 },self);
    //             }
               
    //         },time)
    //     }
    // }
}

export var NET = NetController.getInst();