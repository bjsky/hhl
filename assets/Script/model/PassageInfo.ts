import { SPassageInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { COMMON } from "../CommonData";
import { CONSTANT } from "../Constant";
import LineupInfo from "./LineupInfo";

export default class PassageInfo{
    //当前关卡id
    public passId:number = 0;
    //当前关卡开始的时间（计算当前关卡收益）
    public passStartTime:number = 0;

    //关卡配置表
    public passageCfg:any = null;
    public initFromServer(info:SPassageInfo){
        this.passId = info.passId;
        this.passStartTime = info.passStartTime;
        this.passageCfg = CFG.getCfgDataById(ConfigConst.Passage,this.passId);
    }
    //是否是最后一关
    public get isMaxPassage(){
        return this.passId == CONSTANT.getMaxPassageId();
    }

    public cloneServerInfo():SPassageInfo{
        var info:SPassageInfo = new SPassageInfo();
        info.passId  = this.passId;
        info.passStartTime = this.passStartTime;
        return info;
    }


    //当前关卡已经积累的时间-毫秒
    public getPassIncreaseTime():number{
        var max = CONSTANT.getPassIncreaseMaxTime()*1000;
        var time = COMMON.getServerTime() - this.passStartTime;
        if(time<0){
            time = 0;
        }
        if(time>max){
            time = max;
        }
        return time;
    }
}