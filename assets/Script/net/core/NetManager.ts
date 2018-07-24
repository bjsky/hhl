import Socket from "./Socket";
import Log from "../utils/log/Log";
import { MC } from "../message/MessageController";

export class NetManager
{
    public NET_MESSAGE:string = "NET_MESSAGE";
    
    private static _inst:NetManager;
    public  errorID:string = "-1";
    

    private _ip:string;
    private _socket:Socket
    private _msgDict:object;
    private _isConnected:boolean;
    private _isConnecting:boolean;
    private _connectCbObj:any;
    
    private _reconnectMax:number;
    private _reConncetCount:number;

    /**计时器ID */
    private _timeOutId:number;
    /**超时次数 */
    private _timeOutNum:number;
    /**超时时长 */
    private _timeOutTime:number;
    private _timeOutMsgId:any;
    private _seqId: number = 0;
    
    private constructor()
    {
        this._msgDict = {};
        this._reConncetCount = 0;
        this._reconnectMax = 2;
        this._isConnected = false;
        this._isConnecting = false;
        this._socket = null;
        this._timeOutId = NaN;
        this._timeOutTime = NaN;
        this._timeOutMsgId = null;
        this._seqId = 0;
    }

    public static getInst(): NetManager {
        return NetManager._inst ||(NetManager._inst = new NetManager());
    }

    /**
     * 发送网络消息
     * @param id 消息ID
     * @param data 消息内容 JSONOBJ
     * @param cb 消息回调 cbFun(data:string)
     * @param thisObj 回调上下文
     * @param fail 网络处理失败回调，1. 后端报错 2. 前端处理异常
     */
    public send(id: string, data: any, cb: Function, thisObj: any, fail: Function = null)
    {
        if(this._socket)
        {
            let obj = {seq: this._seqId, "id":id,"data":data||{}}
            let msg = JSON.stringify(obj);
            if(cb != null) {
                this._msgDict[this._seqId] = {"id": id, "cb":cb, "this":thisObj, fail: fail, "msg":msg};
            }
            this._socket.send(msg);
            this._seqId += 1;
        }
      
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
        this._timeOutNum = 0;
        if(this._socket == null) {
            this._socket = new Socket(this.onConnect,this.onMessage,this.onClose,this.onError,this);
        }
        this._socket.connect(ip);
    }

    public reConnect() {
        if(this._reConncetCount<this._reconnectMax) {
            Log.debug("尝试重连:"+this._reConncetCount);
            this.connect(this._ip,this.reConnected,this);
            this._reConncetCount++;
            
        } else {
            MC.emit(NET.NET_MESSAGE, {id:-2,data:{}});
        }
    }

    private reConnected() {
        this._reConncetCount = 0;
        //根据timeOuttim是否设置，来判定是否开启了心跳
        if(isNaN(this._timeOutTime)) {
            this.startHeartbeat(this._timeOutMsgId,this._timeOutTime);
        }
        Log.debug("重连成功:重新发送之前消息");
        for(let key in this._msgDict) {
            this._socket.send(this._msgDict[key].msg);
        }
    }

    private onConnect() {
        this._isConnected = true;
        this._isConnecting = false;
        this._reConncetCount = 0;
        this._seqId = 0;
        if(this._connectCbObj)
        {
            this._connectCbObj.cb.call(this._connectCbObj.this);
            this._connectCbObj = null;
        }
    }

    private onMessage(data:string) {
        let json = null;
        if(data.indexOf("id:")>-1) {
            Log.debug("此消息id属性不对：",data);
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
                Log.debug("消息异常:" + JSON.stringify(data));
            } else {
                this.doSuccMessage(json);
            }
            MC.emit(NET.NET_MESSAGE, json);
        }
    }

    /** 处理失败消息 */
    private doFailMessage(json: any, error: any = null) {
        let obj = this._msgDict[json.seq];
        if(obj != null) {
            if (obj.fail instanceof Function) {
                obj.fail.call(obj.this, json, error);
                delete this._msgDict[json.seq];
            }
        }
    }

    /** 处理成功消息 */
    private doSuccMessage(json: any) {
        let obj = this._msgDict[json.seq];
        if(obj != null) {
            obj.cb.call(obj.this, json.data);
            delete this._msgDict[json.seq];
        }
    }

    private onClose() {
        this.dispose();
        //如果之前因网络连接错误正在尝试重连时，不进行提示消息派发，否则派发
        // if(!this._isConnecting)
        // {
            // EVT.emit(NET.NET_MESSAGE, {id:-2,data:{}});
        // }
    }

    private onError() {
        this.dispose();
        // this.reConnect();
    }

    private dispose() {
        this._isConnected = false;
        this._isConnecting = false;
        if(!isNaN(this._timeOutId))
        {
            clearInterval(this._timeOutId);
            this._timeOutId = NaN;
        }
        if(this._socket)
        {
            this._socket.disponse();
        }
        this._socket = null;
        MC.emit(NET.NET_MESSAGE, {id:-2,data:{}});
    }

    /**
     * 启动心跳
     * @param msgId 心跳消息号
     * @param time  心跳间隔 默认15s
     */
    public startHeartbeat(msgId:any,time:number = 15000) {
        this._timeOutTime = time;
        if(isNaN(this._timeOutId))
        {
            let self = this;
            this._timeOutId = setInterval(()=>{
                self._timeOutNum++;
                if(self._timeOutNum>2)
                {
                    Log.debug("心跳超时次数：",self._timeOutNum);
                    this.dispose();
                }else
                {
                    self.send(msgId,null,()=>{
                        self._timeOutNum--;
                    },self);
                }
               
            },time)
        }
    }
}

export var NET = NetManager.getInst();