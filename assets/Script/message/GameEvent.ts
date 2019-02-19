

/**
 * 全局事件定义
 */
export default class GameEvent{
    //加载
    public static LOADING_PROGRESS:string = "LOADING_PROGRESS";
    public static LOADING_COMPLETE:string = "LOADING_COMPLETE";
    //登录验证button
    public static Show_UserInfo_AuthButton:string = "Show_UserInfo_AuthButton";
    //遮罩点击
    public static Mask_touch:string = "Mask_touch";
    //场景
    public static Scene_Change_Complete:string = "Scene_Change_Complete";
    //面板显示效果完成
    public static Panel_Show_Effect_Complete:string ="Panel_Show_Effect_Complete";
    
    public static Guide_Touch_Complete:string ="Guide_Touch_Complete";   //完成引导点击

    //建筑升级完成
    public static Build_Update_Complete:string ="Build_Update_Complete";
    //资源数据更新
    public static Res_Data_Change:string = "Res_Data_Change";
    //资源消耗
    public static Res_update_Cost_Complete:string ="Res_update_Cost_Complete";
    //获得资源面板
    public static Show_AwardPanel:string ="Show_AwardPanel";
    //资源增加
    public static Show_Res_Add:string ="Show_Res_Add";
    //用户数据更新
    public static UserInfo_update_Complete:string = "UserInfo_update_Complete";
    //抽卡完成
    public static Card_summon_Complete:string="Card_summon_Complete";
    //打开界面
    public static Goto_build_panel:string = "Goto_build_panel";
    //卡牌更新
    public static Card_update_Complete:string = "Card_update_Complete";
    //卡牌删除
    public static Card_Remove:string = "Card_Remove";
    //挂机领取
    public static Passage_Collected:string ="PassageCollected";
    //挑战boss完成
    public static Passage_FightBossEnd:string ="Passage_FightBossEnd";
    //阵容修改
    public static Lineup_Changed:string ="Lineup_Changed";

    public static ShareGetReward_Complete:string ="ShareGetReward_Complete";
    //合成升星
    public static Card_Drop_UpStar:string ="Card_Drop_UpStar";

    //侦查完成
    public static Battle_scout_Complete:string ="Battle_scout_Complete";
    public static Battle_refresh_personalEnemey:string ="Battle_refresh_personalEnemey";
    //进攻完成
    public static FightEnemey_Success:string ="FightEnemey_Success";
    //抢夺卡牌显示完成
    public static Card_RabGet_Close:string ="Card_RabGet_Close";
    //卡牌数据变化
    public static Card_data_change:string ="Card_data_change";
    //战斗数据变化
    public static Battle_data_Change:string = "Battle_data_Change";
    //挂机奖励更新
    public static Passage_data_change:string ="Passage_data_change";
    //引导结束
    public static Guide_End:string ="Guide_End";
    //用户升级
    public static User_Level_UP:string ="用户升级";
}
