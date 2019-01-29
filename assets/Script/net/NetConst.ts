
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

    
    /**心跳 */
    public static Heart:number = 10101;
    //登录
    public static Login:number = 10001;
    //引导更新
    public static GuideUpdate:number = 21081;

    //升级建筑
    public static BuildUpdate:number = 21020;

    //召唤卡牌
    public static CardSummon:number = 21000;
    //召唤卡牌引导
    public static CardSummonGuide:number = 21004;
    //卡牌升级
    public static CardUpLv:number = 21001;
    //卡牌升星
    public static CardUpStar:number = 21002;
    //卡牌回收
    public static CardDestroy:number = 21003;
    //挂机领取
    public static CollectPassageRes:number = 21061;
    //修改阵容
    public static LineupModify:number = 21040;
    //挑战boss
    public static FightBoss:number = 21060;
    //获得奖励
    public static GetReward:number = 21091;
    //钻石购买
    public static DiamondBuy:number = 21101;
    
    //世界征战列表
    public static WorldEnemyList:number = 70001;
    //玩家战斗
    public static FightEnemy:number = 70002;
}

