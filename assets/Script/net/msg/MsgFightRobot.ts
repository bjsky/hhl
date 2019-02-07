import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SResInfo, SUserInfo, SBattleInfo } from "./MsgLogin";
import { COMMON } from "../../CommonData";
import { Battle } from "../../module/battle/BattleAssist";
export class CSFightRobot{
    //战斗结束增加经验，前端算好
    public addExp:number = 0;
    //战斗结束增加钻石，前段算好
    public addDiamond:number = 0;
    //增加的红名点，前端算好
    public addRedPoint:number = 0;
    //消耗行动力
    public costActionPoint:number = 0;
}

export class SCFightRobot{
    //战斗完成增加的经验
    public addExp:number = 0;
    //战斗完成后的res信息
    public resInfo:SResInfo;
    //战斗完成后的等级经验信息
    public userInfo:SUserInfo;
    //战斗完成后的战场信息（行动力减少，重置行动力开始时间），红名增加
    public battleInfo:SBattleInfo;

    public static parse(obj:any):SCFightRobot{
        var info:SCFightRobot = new SCFightRobot();
        info.addExp =obj.addExp;
        info.resInfo = SResInfo.parse(obj.resInfo);
        info.userInfo = SUserInfo.parse(obj.userInfo);
        info.battleInfo = SBattleInfo.parse(obj.battleInfo);
        return info;
    }
}
//打机器人
export default class MsgFightRobot extends MessageBase{
    public param:CSFightRobot;
    public resp:SCFightRobot;

    constructor(){
        super(NetConst.FightRobot);
        this.isLocal = true;
    }

    //攻击机器人
    public static createFightRobot(addExp:number,addDiamond:number,addRedPoint:number){
        var msg = new MsgFightRobot();
        msg.param = new CSFightRobot();
        msg.param.addExp = addExp;
        msg.param.addDiamond = addDiamond;
        msg.param.addRedPoint = addRedPoint;
        msg.param.costActionPoint = 1;
        return msg;
    }
    public respFromLocal(){
        var json:any;
        var resInfo = COMMON.resInfo.cloneServerInfo();
        resInfo.diamond+= this.param.addDiamond;
        var userInfo = COMMON.userInfo.cloneAddExpServerInfo(this.param.addExp);
        var battleInfo = Battle.battleInfo.cloneServerInfo();
        battleInfo.actionPoint -= this.param.costActionPoint;
        battleInfo.apStartTime = new Date().getTime();
        battleInfo.redPoint += this.param.addRedPoint;

        json ={
            addExp:this.param.addExp,
            resInfo:resInfo,
            userInfo:userInfo,
            battleInfo:battleInfo
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCFightRobot.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}