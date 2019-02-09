import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SResInfo, SBattleInfo } from "./MsgLogin";
import { COMMON } from "../../CommonData";
import { Lineup } from "../../module/battle/LineupAssist";
import { Battle } from "../../module/battle/BattleAssist";
import LineupInfo from "../../model/LineupInfo";
import MsgCardSummon from "./MsgCardSummon";
import { Card } from "../../module/card/CardAssist";

export class CSGetEnemyList{
    //最小等级
    public levelMin:number = 0;
    //最大等级
    public levelMax:number = 0;
    //刷新消耗金币
    public goldCost:number = 0;

}

export class SCGetEnemyList{
    //最新的资源(刷新消耗金币)
    public resInfo:SResInfo = null;
    //敌人列表(一定等级范围内的随机玩家,不包括自己)
    public enmeyList:Array<SEnemyInfo> = [];

    public static parse(obj:any):SCGetEnemyList{
        var info:SCGetEnemyList = new SCGetEnemyList();
        info.resInfo = SResInfo.parse(obj.resInfo);
        info.enmeyList =[];
        obj.enmeyList.forEach((enemyInfo:any) => {
            info.enmeyList.push(SEnemyInfo.parse(enemyInfo));
        });
        return info;
    }
}

export class SEnemyInfo{
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
    public enemyLineup:Array<SEnemyLineup> =[];
    //敌人阵容战力
    public enemyPower:number = 0;
    //敌人积分
    public enemyScore:number = 0;
    //敌人抢卡纪录
    public enemyRabRecord:Array<SRabRecord> = [];

    public static parse(obj:any):SEnemyInfo{
        var info:SEnemyInfo = new SEnemyInfo();
        info.enemyUid = obj.enemyUid;
        info.enemyName = obj.enemyName;
        info.enemySex = obj.enemySex;
        info.enemyIcon = obj.enemyIcon;
        info.enemyLevel = obj.enemyLevel;
        info.enemyLineup = [];
        obj.enemyLineup.forEach((enemyLineup:any) => {
            info.enemyLineup.push(SEnemyLineup.parse(enemyLineup));
        });
        info.enemyPower = obj.enemyPower;
        info.enemyScore = obj.enemyScore;
        info.enemyRabRecord = [];
        obj.enemyRabRecord.forEach((rabRecord:any) => {
            info.enemyRabRecord.push(SRabRecord.parse(rabRecord));
        });

        return info;
    }
}

//取敌人阵容的位置，和card数据
export class SEnemyLineup{
    //位置
    public pos:number = 0;
    //cardid
    public cardId:number = 0;
    //品级
    public grade:number = 0;
    //等级
    public level:number = 0;

    public static parse(obj:any):SEnemyLineup{
        var info:SEnemyLineup = new SEnemyLineup();
        info.pos = obj.pos;
        info.cardId = obj.cardId;
        info.grade = obj.grade;
        info.level = obj.level;
        return info;
    }
}

export class SRabRecord{
    //时间;毫秒
    public time:number = 0;
    //被抢卡的角色名称
    public beRabName:string =""
    //获得卡牌品级
    public cardGrade:number = 0;
    //获得卡牌id
    public cardId:number =0;

    public static parse(obj:any):SRabRecord{
        var info:SRabRecord = new SRabRecord();
        info.time = obj.time;
        info.cardId = obj.cardId;
        info.cardGrade = obj.cardGrade;
        info.beRabName = obj.beRabName;
        return info;
    }
}

//获得一定等级范围的敌人列表
export default class MsgGetEnemyList extends MessageBase{

    public param:CSGetEnemyList;
    public resp:SCGetEnemyList;

    constructor(){
        super(NetConst.GetEnemyList);
        this.isLocal = true;
    }

    public static create(lvMin:number,lvMax:number,cost:number){
        var msg = new MsgGetEnemyList();
        msg.param = new CSGetEnemyList();
        msg.param.levelMin = lvMin;
        msg.param.levelMax = lvMax;
        msg.param.goldCost = cost;
        return msg;
    }
    public respFromLocal(){
        var resInfo:SResInfo = COMMON.resInfo.cloneServerInfo();
        resInfo.gold -= this.param.goldCost;
        var json:any ={
            resInfo:resInfo,
            enmeyList:[
                MsgGetEnemyList.getEnemyInfo()
            ]
        };
        return this.parse(json);
    }

    public static getEnemyInfo():SEnemyInfo{
        var info:SEnemyInfo = new SEnemyInfo();
        info.enemyUid = COMMON.userInfo.uid;
        info.enemyName = COMMON.userInfo.name;
        info.enemyLevel = COMMON.userInfo.level;
        info.enemySex = COMMON.userInfo.gender;
        info.enemyIcon = COMMON.userInfo.icon;
        info.enemyLineup = [];
        var lineups:Array<SEnemyLineup> = [];
        var slineup:SEnemyLineup = null;
        for(var i:number = 0;i<5;i++){
            slineup = new SEnemyLineup();
            slineup.pos = i;
            slineup.cardId = Card.getSummonCardId();
            slineup.grade = 1;
            slineup.level = 1;
            lineups.push(slineup);
        }
        info.enemyLineup = lineups;
        var sBattle:SBattleInfo = Battle.battleInfo.cloneServerInfo();
        info.enemyScore = sBattle.score;
        info.enemyRabRecord = sBattle.rabRecord;
        return info;
    }

    private parse(obj:any):MessageBase{
        this.resp = SCGetEnemyList.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}