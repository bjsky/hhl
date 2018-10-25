
export default class Socket
{
    private m_ws:WebSocket;
    private m_onConnect:Function;
    private m_onMessage:Function;
    private m_onClose:Function;
    private m_onError:Function;
    private m_this:any;
    private m_onTimeOut:Function;
    private m_id:Number;
    /**
     * 
     * @param onConnect 连接回调
     * @param onMessage 收到消息回调
     * @param onClose   关闭回调
     * @param onError   出错回调
     * @param thisObj   回调上下文
     */
    public constructor(onConnect,onMessage,onClose,onError,thisObj:any,id:Number)
    {
        this.m_onClose = onClose;
        this.m_onMessage = onMessage;
        this.m_onConnect = onConnect;
        this.m_onError = onError;
        this.m_this = thisObj;
        this.m_ws = null;
        this.m_onTimeOut = null;
        this.m_id = id;
    }
    /**
     * 
     * @param ip  ip地址格式:wss://ip:port或ws://ip:port
     */
    public connect(ip:string,connectTimeOut:number,onTimeOut:Function)
    {
        if(this.m_ws == null)
        {
            let ws;
            if(ip.indexOf("ws")!=0)
            {
                ip ="wss://"+ip
            }
            console.log("连接服务器:",ip);
            //[bi] will connect gs:ip

            //超时
            this.m_onTimeOut =onTimeOut;
            setTimeout(this.onTimeOut.bind(this),connectTimeOut);    
            
            ws = new WebSocket(ip);
            this.m_ws = ws;                   
            
            //连接成功
            ws.onopen = this.onOpen.bind(this);
            //连接关闭
            ws.onclose = this.onClose.bind(this);
            //收到消息
            ws.onmessage = this.onMessage.bind(this);
            //出错
            ws.onerror = this.onError.bind(this);
          
        }
    }
    /**
     * @param data 消息内容
     */
    public send(data:string)
    {
        if(this.m_ws && this.m_ws.readyState == WebSocket.OPEN)
        {
            if(data.indexOf('"id":"10101"')<0){
                console.log("socket:发送消息__"+data)
            }
            this.m_ws.send(data);
        }
    }
    public isClosing(){
        return this.m_ws && (this.m_ws.readyState == WebSocket.CLOSING);            
    }
    public isClosed(){
        return this.m_ws && (this.m_ws.readyState == WebSocket.CLOSED);            
    }
    private onOpen(e:Event = null)
    {
        console.log("连接网络:成功:");
       if(this.m_onConnect)
       {
           this.m_onConnect.call(this.m_this,this);
       }
    }

    private onClose(e:CloseEvent)
    {
        console.log("socket:close")
        if(this.m_onClose)
       {
           this.m_onClose.call(this.m_this)
       }
    }
    private onMessage(e:MessageEvent)
    {
        // Log.debug("socket:收到消息  "+e.data)
        if(this.m_onMessage)
        {
            this.m_onMessage.call(this.m_this,e.data)
        }
    }
    private onError(e:Event)
    {
        console.log("socket:连接出错")
        if(this.m_onError)
        {
            this.m_onError.call(this.m_this)
        }
    }
    private onTimeOut()
    {            
        if(!this.m_ws || this.m_ws.readyState != WebSocket.CONNECTING){
            return;
        }
        console.log("[net] connect timeout..")    
        if(this.m_onTimeOut ){
            this.m_onTimeOut();
        }
        
    }
    public close()
    {
        if(this.m_ws)
        {
            console.log("socket:主动断开连接")
            this.m_ws.close();
            // this.onError(null);
        }
    }
    public disponse(immediate=false)
    {
        if(this.m_ws)
        {
            if(this.m_ws.readyState == WebSocket.CLOSING || this.m_ws.readyState == WebSocket.CLOSED){
                return;
            }
            if(immediate || this.m_ws.readyState == WebSocket.OPEN)
            {
                this.m_ws.close();
            }
            //连接成功
            this.m_ws.onopen = this.m_ws.onclose = this.m_ws.onmessage = this.m_ws.onerror = null;
        }
        this.m_ws = null;
        this.m_onClose = null;
        this.m_onMessage = null;
        this.m_onConnect = null;
        this.m_onError = null;
        this.m_this = null;
    }
}