import MessageBase from "./MessageBase";
import { enemyTypeEnum } from "./MsgWorldEnemyList";
import { SResInfo, SUserInfo } from "./MsgLogin";
import { SCardInfo } from "./MsgCardSummon";
import NetConst from "../NetConst";

export class CSFightEnemy{
    //敌人类型
    public enemyType:enemyTypeEnum = 0;
    //敌人uid
    public enemyUid:string ="";
    //战斗评价，1-5星
    public fightEvaluate:number = 0;
}

export class SCFightEnemy{
    //战斗完成增加的经验
    public addExp:number = 0;
    //战斗完成后的res信息
    public resInfo:SResInfo;
    //战斗完成后的等级经验信息
    public userInfo:SUserInfo;
    //战斗完成后获得的卡牌
    public addCard:SCardInfo;

    public static parse(obj:any):SCFightEnemy{
        return null;
    }
}

export default class MsgFightEnemy extends MessageBase{
    public param:CSFightEnemy;
    public resp:SCFightEnemy;

    constructor(){
        super(NetConst.FightEnemy);
        this.isLocal = true;
    }

    public static create(type:enemyTypeEnum,uid:string,evaluate:number){
        var msg = new MsgFightEnemy();
        msg.param = new CSFightEnemy();
        msg.param.enemyType = type;
        msg.param.enemyUid = uid;
        msg.param.fightEvaluate = evaluate;
        return msg;
    }

    public respFromLocal(){
        var json:any;


        json ={
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCFightEnemy.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}