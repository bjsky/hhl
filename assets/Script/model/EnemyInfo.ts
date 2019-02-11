import LineupInfo from "./LineupInfo";
import { SEnemyInfo, SEnemyLineup} from "../net/msg/MsgGetEnemyList";
import StringUtil from "../utils/StringUtil";
import { COMMON } from "../CommonData";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

export enum EnemyTypeEnum{
    Enemy = 1, //玩家
    Robit,      //机器人
    PersonlEnemy //仇人
}
export default class EnemyInfo {
    //敌人类型
    public enemyType:EnemyTypeEnum = 0;
    //敌人uid
    public enemyUid:string = "";
    //敌人姓名
    public enemyName:string = "";
    //敌人等级
    public enemyLevel:Number = 1;
    //敌人性别
    public enemySex:number = 1;
    //敌人头像
    public enemyIcon:string = "";
    //敌人阵容
    public enemyLineupMap:any = {}
    //敌人总战力
    public enemyTotalPower:number = 0;
    //敌人积分
    public enemyScore:number = 0;
    //是否已攻击
    public isAttacked:boolean =false;

    public initEnemy(sInfo:SEnemyInfo,isPersonal:boolean){
        this.enemyType = isPersonal?EnemyTypeEnum.PersonlEnemy: EnemyTypeEnum.Enemy;
        this.enemyUid = sInfo.enemyUid;
        this.enemyName = sInfo.enemyName;
        this.enemyLevel = sInfo.enemyLevel;
        this.enemySex = sInfo.enemySex;
        this.enemyIcon = sInfo.enemyIcon;
        this.enemyLineupMap = {};
        var lineup:LineupInfo = null;
        var totalPower:number = 0;
        sInfo.enemyLineup.forEach((sLineup:SEnemyLineup)=>{
            lineup = new LineupInfo();
            lineup.initEnmey(sLineup);
            this.enemyLineupMap[lineup.pos] = lineup;
            totalPower+= lineup.power;
        })
        this.enemyTotalPower = totalPower;
        this.enemyScore = sInfo.enemyScore;
        this.isAttacked = false;
    }

    public static NameConsts =['划船不用桨',"一刀屠万狗","爱过人渣","一表人渣","女神收割机",
    "看你咋滴","酷似你祖宗","爱迪不能生","狂拽龙少","污林萌主"]

    public initRobot(passageId:number){
        this.enemyType = EnemyTypeEnum.Robit;
        this.enemyUid = StringUtil.getUUidClient();
        this.enemyName = EnemyInfo.NameConsts[Math.floor(Math.random()*EnemyInfo.NameConsts.length)];
        this.enemyLevel = COMMON.userInfo.level;
        this.enemySex = 1;
        this.enemyIcon ="";

        //阵容 
        var passCfg:any = CFG.getCfgDataById(ConfigConst.Passage,passageId);
        this.enemyLineupMap = {};
        var lineupPower:number = 0;
        var lineupIds:string = passCfg.amyHero;
        var lineupGradeLevel:string = passCfg.amyHeroGradeLv;
        if(lineupIds!=""){
            var ids:Array<string> = lineupIds.split(";");
            var lineup:LineupInfo;
            var gradeLvs:Array<string> = lineupGradeLevel.split("|");
            var gradelv:string;
            for(var i:number = 0;i<ids.length;i++){
                lineup = new LineupInfo();
                gradelv = gradeLvs[i];
                lineup.initRobot(i,Number(ids[i]),Number(gradelv.split(";")[0]),Number(gradelv.split(";")[1]));
                this.enemyLineupMap[lineup.pos] = lineup;
                lineupPower += Number(lineup.power);
            }
        }
        this.enemyTotalPower = lineupPower;
        
        this.enemyScore = 0;
    }

}