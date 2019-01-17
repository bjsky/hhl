import MessageBase from "./MessageBase";
import NetConst from "../NetConst";

export enum WorldEnemyListType{
    World = 1,  //世界
    Friend,     //朋友圈
}

export enum enemyTypeEnum{
    Player = 1, //玩家
    Robit,      //机器人
}

export class CSWorldEnemyList{
    //列表类型
    public type:WorldEnemyListType = 0;

}

export class SCWorldEnemyList{
    //敌人列表
    public list:Array<SEnemyInfo> = [];

    public static parse(obj:any):SCWorldEnemyList{
        var data:SCWorldEnemyList = new SCWorldEnemyList();
        obj.list.forEach(enemy => {
            var enemyInfo:SEnemyInfo = SEnemyInfo.parse(enemy);
            data.list.push(enemyInfo);
        });
        return data;
    }
}

export class SEnemyInfo{
    //敌人类型
    public enemyType:enemyTypeEnum = 0;
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
    //敌人总战力
    public enemyTotalPower:number = 0;
    //敌人红名点 
    public enemyRedPoint:number = 0;
    //敌人攻击自己次数
    public enemyAttackNum:number = 0;
    //敌人攻击历史
    public enemyAttackHistory:Array<SAttackHistory> = [];

    public static parse(obj:any):SEnemyInfo{
        return null;
    }
}

export class SEnemyLineup{
    //位置
    public pos:number = 0;
    //cardid
    public cardId:number = 0;
    //品级
    public grade:number = 0;
    //等级
    public level:number = 0;
}

export class SAttackHistory{
    //时间;毫秒
    public time:number = 0;
    //攻击对象
    public attackName:string ="";
    //获得卡牌品级
    public cardGrade:number = 0;
    //获得卡牌id
    public cardId:number =0;
}

export default class MsgWorldEnemyList extends MessageBase{
    public param:CSWorldEnemyList;
    public resp:SCWorldEnemyList;

    constructor(){
        super(NetConst.WorldEnemyList);
        this.isLocal = true;
    }

    public static create(type:WorldEnemyListType){
        var msg = new MsgWorldEnemyList();
        msg.param = new CSWorldEnemyList();
        msg.param.type = type;
        return msg;
    }

    public respFromLocal(){
        var json:any;

        var worldEnemyList:Array<any>= [];
        for(var i:number = 0;i<10;i++){
            var enemy = this.createRobitEnemy();
            worldEnemyList.push(enemy);
        }
        json ={
            list:worldEnemyList
        }
        return this.parse(json);
    }

    private createRobitEnemy():any{
        return null;
    }

    private parse(obj:any):MessageBase{
        this.resp = SCWorldEnemyList.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}