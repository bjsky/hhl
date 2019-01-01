import { BuildType } from "./view/BuildPanel";
import { CFG } from "./manager/ConfigManager";
import { ConfigConst } from "./module/loading/steps/LoadingStepConfig";

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
    public getSummonStoneCost(unfreeIndex:number):number{
        // var stoneSummonCost:Array<any> = this._constantKeyValueMap["store_summon_use"].split(";");
        // var cost:string =""
        // if(unfreeIndex <= stoneSummonCost.length-1){
        //     cost = stoneSummonCost[unfreeIndex];
        // }else{
        //     cost = stoneSummonCost[stoneSummonCost.length-1];
        // }
        // return Number(cost);
        return this._constantKeyValueMap["store_summon_use"].split(";")[0];
    }

    //灵石免费次数
    public getStoneFreeSummonNum():number{
        return this._constantKeyValueMap["stone_free_summon_num"];
    }
    //视频免费抽卡次数
    public getVideoFreeSummonNum():number{
        return this._constantKeyValueMap["video_summon_num"];
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
}

export var CONSTANT:Constant = Constant.getInstance();