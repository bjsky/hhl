

/**
 * 全局事件定义
 */
export default class GameEvent{
    //加载
    public static LOADING_PROGRESS:string = "LOADING_PROGRESS";
    public static LOADING_COMPLETE:string = "LOADING_COMPLETE";

    //场景
    public static Scene_Change_Complete:string = "Scene_Change_Complete";
    //点击引导遮罩
    public static Guide_Mask_Touch:string ="Guide_Mask_Touch";
}