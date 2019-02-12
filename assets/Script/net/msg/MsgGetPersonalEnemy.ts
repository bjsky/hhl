import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MsgGetEnemyList, { SEnemyInfo } from "./MsgGetEnemyList";

export class CSGetPersonalEnemy{
    ////最多显示个数
    public listMaxCount:number = 5;
}
export class SCGetPersonalEnemy{
    //仇人列表
    public personalEnmeyList:Array<SEnemyInfo> = [];

    public static parse(obj:any):SCGetPersonalEnemy{
        var data:SCGetPersonalEnemy =new SCGetPersonalEnemy();
        data.personalEnmeyList = [];
        obj.personalEnmeyList.forEach((enemyInfo:any) => {
            data.personalEnmeyList.push(SEnemyInfo.parse(enemyInfo));
        });
        return data;
    }
}
//获得仇人列表（抢过自己卡的）
export default class MsgGetPersonalEnemy extends MessageBase{
    public param:CSGetPersonalEnemy;
    public resp:SCGetPersonalEnemy;

    constructor(){
        super(NetConst.GetPersonalEnemy);
        this.isLocal = true;
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
                MsgGetEnemyList.getEnemyInfo()
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