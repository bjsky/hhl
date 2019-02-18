import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MsgGetEnemyList, { SEnemyInfo } from "./MsgGetEnemyList";
import { SBattleInfo } from "./MsgLogin";

export class CSGetPersonalEnemy{
    ////最多显示个数
    public listMaxCount:number = 5;
}
export class SCGetPersonalEnemy{
    //战场信息，前端没有战场信息获取的接口
    public battleInfo:SBattleInfo = null;
    //仇人列表
    public personalEnmeyList:Array<SPersonalEnemyInfo> = [];

    public static parse(obj:any):SCGetPersonalEnemy{
        var data:SCGetPersonalEnemy =new SCGetPersonalEnemy();
        if(obj.battleInfo!=undefined){
            data.battleInfo = SBattleInfo.parse(obj.battleInfo);
        }
        data.personalEnmeyList = [];
        obj.personalEnmeyList.forEach((enemyInfo:any) => {
            data.personalEnmeyList.push(SPersonalEnemyInfo.parse(enemyInfo));
        });
        return data;
    }
}

export class SPersonalEnemyInfo{
    //最近抢夺时间
    public lastRabTime:number = 0;
    //敌人信息
    public enmeyInfo:SEnemyInfo = null;

    public static parse(obj:any):SPersonalEnemyInfo{
        var info:SPersonalEnemyInfo = new SPersonalEnemyInfo();
        info.lastRabTime = obj.lastRabTime;
        info.enmeyInfo = SEnemyInfo.parse(obj.enmeyInfo);
        return info;
    }
}
//获得仇人列表（抢过自己卡的）
export default class MsgGetPersonalEnemy extends MessageBase{
    public param:CSGetPersonalEnemy;
    public resp:SCGetPersonalEnemy;

    constructor(){
        super(NetConst.GetPersonalEnemy);
        // this.isLocal = true;
    }

    public static create(count:number =5){
        var msg = new MsgGetPersonalEnemy();
        msg.param = new CSGetPersonalEnemy();
        msg.param.listMaxCount = count;
        return msg;
    }
    public respFromLocal(){
        var json:any ={
            personalEnmeyList:[
                {lastRabTime:new Date().getTime(),
                    enmeyInfo:MsgGetEnemyList.getEnemyInfo()}
            ]
        };
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCGetPersonalEnemy.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}