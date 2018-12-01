

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
}
