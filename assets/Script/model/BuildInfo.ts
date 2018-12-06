import ColorStoneInfo from "./ColorStoneInfo";
import { SBuildInfo, SColorStoneInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

export default class BuildInfo{
    // 建筑type
    public type:number = 0;
    // 建筑等级
    public level:number = 1;
    // 是否锁定——锁定的不产生五彩石
    public locked:boolean = false;
    //五彩石
    public colorStones:Array<ColorStoneInfo> = [];
    // 客户端等级数据
    public buildLevelCfg:any = null;

    public initFormServer(data:SBuildInfo){
        this.type = data.type;
        this.level = data.level;
        this.locked = data.locked;
        data.colorStones.forEach((stone:SColorStoneInfo) =>{
            var stoneInfo:ColorStoneInfo = new ColorStoneInfo();
            stoneInfo.initFromServer(stone);
            this.colorStones.push(stoneInfo)
        });

        this.buildLevelCfg = CFG.getCfgByKey(ConfigConst.Building,"level",this.level)[0];
    }

    public updateInfo(data:SBuildInfo){
        this.initFormServer(data);
    }

    public cloneServerInfo():SBuildInfo{
        var info:SBuildInfo = new SBuildInfo();
        info.type = this.type;
        info.level = this.level;
        info.locked = this.locked;
        info.colorStones = [];
        this.colorStones.forEach((stone:ColorStoneInfo) =>{
            var stoneInfo:SColorStoneInfo = stone.cloneServerInfo();
            info.colorStones.push(stoneInfo);
        })
        return info;
    }
}