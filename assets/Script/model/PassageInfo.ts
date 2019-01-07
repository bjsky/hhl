import { SPassageInfo, SLineupCard } from "../net/msg/MsgLogin";
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
    //关卡boss
    public lineupBoss:Array<LineupInfo> =  [];

    public initFromServer(info:SPassageInfo){
        this.passId = info.passId;
        this.passStartTime = info.passStartTime;
        this.passUncollectedTime = info.passUncollectedTime;
        this.passUncollectExp = info.passUncollectExp;
        this.passUncollectGold = info.passUncollectGold;
        this.passUncollectStone  = info.passUncollectStone;

        this.passageCfg = CFG.getCfgDataById(ConfigConst.Passage,this.passId);


        this.lineupBoss  = [];
        var lineupIds:string = this.passageCfg.amyHero;
        var lineupGradeLevel = this.passageCfg.amyHeroGradeLv;
        if(lineupIds!=""){
            var ids:Array<string> = lineupIds.split(";");
            var lineup:LineupInfo;
            var gradeLvs:Array<string> = lineupGradeLevel.split("|");
            var gradelv:string;
            for(var i:number = 0;i<ids.length;i++){
                lineup = new LineupInfo();
                gradelv = gradeLvs[i];
                lineup.initFromCfg(i,Number(ids[i]),Number(gradelv.split(";")[0]),Number(gradelv.split(";")[1]));
                this.lineupBoss.push(lineup);
            }
        }
    }

    public cloneServerInfo():SPassageInfo{
        var info:SPassageInfo = new SPassageInfo();
        info.passId  = this.passId;
        info.passStartTime = this.passStartTime;
        info.passUncollectedTime = this.passUncollectedTime;
        info.passUncollectExp = this.passUncollectExp;
        info.passUncollectGold = this.passUncollectGold;
        info.passUncollectStone = this.passUncollectStone;
        return info;
    }


    //当前关卡已经积累的时间-毫秒
    public getCurPassIncreaseTime():number{
        var max = CONSTANT.getPassIncreaseMaxTime()*1000;
        if(this.getAllPassUncollectTime() > max){
            return max - this.passUncollectedTime;
        }else{
            var time = COMMON.getServerTime() - this.passStartTime;
            if(time<0){
                time = 0;
            }
            return time;
        }
    }
    //所有关卡未领取的时间
    public getAllPassUncollectTime(){
        return (COMMON.getServerTime() - this.passStartTime)+this.passUncollectedTime;
    }
}