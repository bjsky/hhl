import { SCardInfo } from "../net/msg/MsgCardSummon";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

export default class CardInfo{
    //卡牌的唯一id:时间戳+6位随机数
    public uuid:string ="";
    //卡牌的id
    public cardId:number = 0;
    //卡牌的品级
    public grade:number = 0;
    //卡牌的等级
    public level:number = 0;
    //技能等级
    public skillLevel:number = 1;
    //卡牌配置
    public cardInfoCfg:any = null;
    //卡牌升级配置
    public carUpCfg:any = null;
    //卡牌技能配置
    public cardSkillCfg:Array<any> = null;
    // 技能升级配置
    public skillUpCfg:any = null;

    public initFormServer(data:SCardInfo){
        this.uuid = data.uuid;
        this.cardId = data.cardId;
        this.grade = data.grade;
        this.level = data.level;
        this.skillLevel = data.skillLevel;

        this.cardInfoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this.cardId);
        this.carUpCfg = CFG.getCfgByKey(ConfigConst.CardUp,"level",this.level,"grade",this.grade)[0];
        this.cardSkillCfg = CFG.getCfgByKey(ConfigConst.CardSkill,"cardId",this.cardId);
        this.skillUpCfg = CFG.getCfgDataById(ConfigConst.SkillUp,this.skillLevel);
    }

    public updateInfo(info:SCardInfo){
        this.initFormServer(info);
    }

    public cloneServerInfo():SCardInfo{
        var info:SCardInfo = new SCardInfo();
        info.uuid = this.uuid;
        info.cardId = this.cardId;
        info.grade = this.grade;
        info.level = this.level;
        info.skillLevel = this.skillLevel;
        return info;
    }

    //技能的当前加成
    public getSkillValue(index){
        var cfg:any = this.cardSkillCfg[index];
        var num = Number(cfg.value) + (this.grade-1) * Number(cfg.addValue);
        console.log(num);
        return num;
    }
    //下级技能的加成
    public getSkillNextGradeValue(index){
        var cfg:any = this.cardSkillCfg[index];
        var num = Number(cfg.value) + this.grade * Number(cfg.addValue);
        console.log(num);
        return num;
    }

    public get isMaxGrade(){
        return this.grade == 5;
    }


}