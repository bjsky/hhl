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
    public initConstant(){
        this._buildingNames = CFG.getCfgByKey(ConfigConst.Constant,"key","buidling_names")[0]["param1"].split(";");
        this._buildingBuffDesc = CFG.getCfgByKey(ConfigConst.Constant,"key","build_buffDesc")[0]["param1"].split(";");
    }

    public getBuidlingName(type:BuildType){
        return this._buildingNames[type];
    }

    public getBuildingBuffDesc(type:BuildType){
        return this._buildingBuffDesc[type];
    }
}

export var CONSTANT:Constant = Constant.getInstance();