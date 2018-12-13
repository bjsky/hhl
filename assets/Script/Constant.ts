import { BuildType } from "./view/BuildPanel";
import { CFG } from "./manager/ConfigManager";
import { ConfigConst } from "./module/loading/steps/LoadingStepConfig";

export default class Constant{
    public static _inst:Constant;
    public static getInstance():Constant
    {
        return this._inst||(this._inst = new Constant())
    }

    private _buildingNames:string[];
    private _buildingBuffDesc:string[];
    private _stoneSummonCost:string[];
    private _stoneFreeSummonNum:number = 0;
    private _videoFreeSummonNum:number = 0;
    public initConstant(){
        this._buildingNames = CFG.getCfgByKey(ConfigConst.Constant,"key","buidling_names")[0]["param1"].split(";");
        this._buildingBuffDesc = CFG.getCfgByKey(ConfigConst.Constant,"key","build_buffDesc")[0]["param1"].split(";");
        this._stoneSummonCost = CFG.getCfgByKey(ConfigConst.Constant,"key","store_summon_use")[0]["param1"].split(";");
        this._videoFreeSummonNum = CFG.getCfgByKey(ConfigConst.Constant,"key","video_summon_num")[0]["param1"];
        this._stoneFreeSummonNum = CFG.getCfgByKey(ConfigConst.Constant,"key","stone_free_summon_num")[0]["param1"];
    }

    public getBuidlingName(type:BuildType){
        return this._buildingNames[type];
    }

    public getBuildingBuffDesc(type:BuildType){
        return this._buildingBuffDesc[type];
    }

    //获得当前抽取卡片消耗的灵石
    public getSummonStoneCost(unfreeIndex:number):number{
        var cost:string =""
        if(unfreeIndex <= this._stoneSummonCost.length-1){
            cost = this._stoneSummonCost[unfreeIndex];
        }else{
            cost = this._stoneSummonCost[this._stoneSummonCost.length-1];
        }
        return Number(cost);
    }

    //灵石免费次数
    public getStoneFreeSummonNum():number{
        return this._stoneFreeSummonNum;
    }
    //视频免费抽卡次数
    public getVideoFreeSummonNum():number{
        return this._videoFreeSummonNum;
    }
}

export var CONSTANT:Constant = Constant.getInstance();