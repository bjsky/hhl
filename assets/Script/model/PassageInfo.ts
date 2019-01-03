import { SPassageInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

export default class PassageInfo{
    //当前关卡id
    public passId:number = 0;
    //当前关卡开始的时间（计算当前关卡收益）
    public passStartTime:number = 0;
    //所有未领取收益的时间(计算是否领取)
    public passUncollectedTime:number = 0;
    //未领取的金币(之前关卡已累计的金币)
    public passUncollectGold:number =0;
    //未领取的经验(之前关卡已累计的经验)
    public passUncollectExp:number =0;
    //未领取的石头(之前关卡已累计的灵石)
    public passUncollectStone:number =0;

    //关卡配置表
    public passageCfg:any = null;

    public initFromServer(info:SPassageInfo){
        this.passId = info.passId;
        this.passStartTime = info.passStartTime;
        this.passUncollectedTime = info.passUncollectedTime;
        this.passUncollectExp = info.passUncollectExp;
        this.passUncollectGold = info.passUncollectGold;
        this.passUncollectStone  = info.passUncollectStone;

        this.passageCfg = CFG.getCfgDataById(ConfigConst.Passage,this.passId);
    }
}