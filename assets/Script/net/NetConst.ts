
/**
 * 网络协议
 * 
 */
export default class NetConst{
    public static NET_ConnectTimeOut:string = "-3";
    public static NET_CLOSE:string = "-2";
    public static NET_ERROR:string = "-4";
    public static ExceptionCmd :string = "-1";  
    public static NET_Connected:string = "0";
    public static NET_Connecting:string = "1";

    //登录
    public static Login:number = 10001;
    //引导更新
    public static GuideUpdate:number = 10002;

    //升级建筑
    public static BuildUpdate:number = 20001;
}

