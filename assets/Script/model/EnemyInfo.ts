import LineupInfo from "./LineupInfo";
import { RabRecord } from "./BattleInfo";

export enum EnemyTypeEnum{
    Player = 1, //玩家
    Robit,      //机器人
}

export class EnemyLineup{
    //位置
    public pos:number = 0;
    //cardid
    public cardId:number = 0;
    //品级
    public grade:number = 0;
    //等级
    public level:number = 0;
    //战斗力
    public power:number = 0;
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
    public enemyLineup:Array<LineupInfo> =[];
    //敌人总战力
    public enemyTotalPower:number = 0;
    //敌人红名点
    public enemyRedPoint:number = 0;
    //敌人抢卡纪录
    public enemyRabRecord:Array<RabRecord> = [];
}