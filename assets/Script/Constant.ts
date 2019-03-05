import { BuildType } from "./view/BuildPanel";
import { CFG } from "./manager/ConfigManager";
import { ConfigConst } from "./module/loading/steps/LoadingStepConfig";
import { COMMON } from "./CommonData";
import { GrowRewardType } from "./model/TaskInfo";

export default class Constant{
    public static _inst:Constant;
    public static getInstance():Constant
    {
        return this._inst||(this._inst = new Constant())
    }

    private _constantKeyValueMap:any = {};
    public initConstant(){
        var group = CFG.getCfgGroup(ConfigConst.Constant);
        for(let key in group){
            var obj = group[key];
            this._constantKeyValueMap[obj["key"]] = obj["param1"];
        }

    }

    public getBuidlingName(type:BuildType){
        return this._constantKeyValueMap["buidling_names"].split(";")[type];
    }

    public getBuildingBuffDesc(type:BuildType){
        return this._constantKeyValueMap["build_buffDesc"].split(";")[type];
    }

    //获得当前抽取卡片消耗的灵石
    public getSummonStoneCost():number{
        var stoneSummonCost:number = Number(this._constantKeyValueMap["store_summon_use"].split(";")[0]);
        // var unfreetime = COMMON.stoneSummonNum - this.getStoneFreeSummonNum();
        // if(unfreetime<0){
        //     return 0;
        // }else{
        //     var cost = stoneSummonCost * Math.pow(this.getSummonStoneCostAdd(),unfreetime);
            return Number(stoneSummonCost.toFixed(0));
        // }
    }

    public getSummonStoneCostAdd():number{
        return this._constantKeyValueMap["store_summon_costAdd"];
    }

    //灵石抽取获得的经验
    public getSummonStoneExpGet(){
        return Number(this._constantKeyValueMap["store_summon_use"].split(";")[1]);
    }

    //灵石免费次数
    public getStoneFreeSummonNum():number{
        return Number(this._constantKeyValueMap["stone_free_summon_num"]);
    }
    //视频免费抽卡次数
    public getVideoFreeSummonNum():number{
        return Number(this._constantKeyValueMap["video_summon_num"].split(";")[0]);
    }
    //灵石抽取获得的经验
    public getSummonVideoExpGet(){
        return Number(this._constantKeyValueMap["video_summon_num"].split(";")[1]);
    }
    //灵石抽奖权重
    public getStoneSummonWeightArr():string[]{
        return this._constantKeyValueMap["store_summon_rate"].split("|");
    }
    //视频抽奖权重
    public getVideoSummonWeightArr():string[]{
        return this._constantKeyValueMap["video_summon_rate"].split("|");
    }
    //获取种族名称
    public getRaceNameWithId(raceId:number):string{
        return this._constantKeyValueMap["race_name"].split(";")[raceId-1];
    }

    public getSkillMaxLevelArr(){
        return this._constantKeyValueMap["grade_skillMaxLv"].split("|");
    }

    //挂机最短可领取时间
    public getPassCollectMinTime(){
        return Number(this._constantKeyValueMap["produce_minTime"]);
    }

    //挂机最长可积累时间
    public getPassIncreaseMaxTime(){
        return Number(this._constantKeyValueMap["produce_maxTime"]);
    }
    //每日分享次数
    public getMaxShareCount(){
        return Number(this._constantKeyValueMap["sharecount_day"]);
    }
    //分享获得钻石
    public getShareGetDiamond(){
        return Number(this._constantKeyValueMap["shareGetDiamond"]);
    }
    //看视频获得金币
    public getSeeVideoGold(){
        return Number(this._constantKeyValueMap["seeVideoAddGold"]);
    }
    //看视频获得灵石
    public getSeeVideoStone(){
        return Number(this._constantKeyValueMap["seeVideoAddStone"]);
    }
    //////////////
    // 战场
    ////////////
    //敌人等级范围
    public getEnemyListLevelArea():number{
        return Number(this._constantKeyValueMap["enmeyLevelArea"]);
    }
    //机器人战力范围
    public getRobotPowerArea():number{
        return Number(this._constantKeyValueMap["robotPowerarea"]);
    }
    //行动力初始值
    public getActionPointInitNum():number{
        return Number(this._constantKeyValueMap["actionPoint_init"]);
    }
    //行动力最大值
    public getActionPointMax():number{
        return Number(this._constantKeyValueMap["actionPoint_max"]);
    }
    //行动力恢复时间
    public getActionPointPerTime():number{
        return Number(this._constantKeyValueMap["actionPoint_perTime"]);
    }
    //复仇恢复时间
    public getRevengeTime():number{
        return Number(this._constantKeyValueMap["revenge_time"]);
    }
    //侦查消耗金币
    public getScoutCost():number{
        return Number(this._constantKeyValueMap["scout_cost"]);
    }
    //排行榜显示等级
    public getRankShowLevel():number{
        return Number(this._constantKeyValueMap["rank_show_level"]);
    }

    public getMaxPassageId():number{
        return 100;
    }

    public getMaxPlayerLevel():number{
        return 60;
    }
    //任务奖励id 
    public getTaskRewardIds():string[]{
        var ids:string[] = this._constantKeyValueMap["taskRewardIds"].split("|");
        return ids;
    }
    //七日奖励id 
    public getSevendayRewardIds():string[]{
        var ids:string[] = this._constantKeyValueMap["sevendayRewardIds"].split(";");
        return ids;
    }
    //成长奖励id 
    public getGrowthRewardIds(type:GrowRewardType):string[]{
        var ids:string[];
        if(type == GrowRewardType.LevelGrowth){
            ids = this._constantKeyValueMap["levelGrowthRewards"].split("|");
        }else if(type == GrowRewardType.PassGrowth){
            ids = this._constantKeyValueMap["passGrowthRewards"].split("|");
        }else if(type == GrowRewardType.cardUpGrowth){
            ids = this._constantKeyValueMap["cardUpGrowthRewards"].split("|");
        }else if(type == GrowRewardType.cardGrowth){
            ids = this._constantKeyValueMap["cardGrowthRewards"].split("|");
        }else if(type == GrowRewardType.scoreGrowth){
            ids = this._constantKeyValueMap["scoreGrowthRewards"].split("|");
        }
        return ids;
    }
}

export var CONSTANT:Constant = Constant.getInstance();