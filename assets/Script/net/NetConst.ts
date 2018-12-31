
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

    //召唤卡牌
    public static CardSummon:number = 30001;
    //卡牌升级
    public static CardUpLv:number = 30002;
    //卡牌升星
    public static CardUpStar:number = 30003;
    //卡牌回收
    public static CardDestroy:number = 30004;
}

