

/**
 * 全局事件定义
 */
export default class GameEvent{
    //加载
    public static LOADING_PROGRESS:string = "LOADING_PROGRESS";
    public static LOADING_COMPLETE:string = "LOADING_COMPLETE";

    //场景
    public static Scene_Change_Complete:string = "Scene_Change_Complete";
    
    public static Guide_Touch_Complete:string ="Guide_Touch_Complete";   //完成引导点击

    //建筑升级完成
    public static Build_Update_Complete:string ="Build_Update_Complete";
    //资源消耗
    public static Res_update_Cost_Complete:string ="Res_update_Cost_Complete";
    //用户数据更新
    public static UserInfo_update_Complete:string = "UserInfo_update_Complete";
    //抽卡完成
    public static Card_summon_Complete:string="Card_summon_Complete";
}
