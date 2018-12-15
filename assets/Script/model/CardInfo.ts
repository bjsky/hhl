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
    //卡牌配置
    public cardInfoCfg:any = null;
    //卡牌升级配置
    public carUpCfg:any = null;
    //卡牌技能配置
    public cardSkillCfg:Array<any> = null;

    public initFormServer(data:SCardInfo){
        this.uuid = data.uuid;
        this.cardId = data.cardId;
        this.grade = data.grade;
        this.level = data.level;

        this.cardInfoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this.cardId);
        this.carUpCfg = CFG.getCfgByKey(ConfigConst.CardUp,"level",this.level,"grade",this.grade)[0];
        this.cardSkillCfg = CFG.getCfgByKey(ConfigConst.CardSkill,"cardId",this.cardId);
    }
}