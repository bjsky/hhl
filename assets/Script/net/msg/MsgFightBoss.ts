import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SPassageInfo, SResInfo, SUserInfo } from "./MsgLogin";
import { Passage } from "../../module/battle/PassageAssist";
import { COMMON } from "../../CommonData";

export class CSFightBoss{
    //关卡id
    public passageId:number = 0;
}

export class SCFightBoss{
    
    //挑战完成增加的经验
    public addExp:number = 0;
    //挑战完成后的res信息
    public resInfo:SResInfo;
    //挑战完成后的等级经验信息
    public userInfo:SUserInfo;
    //挑战完成后的关卡
    public passageInfo:SPassageInfo = null;

    public static parse(obj:any):SCFightBoss{
        var data:SCFightBoss = new SCFightBoss();
        data.addExp = obj.addExp;
        data.resInfo = SResInfo.parse(obj.resInfo);
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.passageInfo = SPassageInfo.parse(obj.passageInfo);
        return data;
    }
}

export default class MsgFightBoss extends MessageBase{
    public param:CSFightBoss;
    public resp:SCFightBoss;

    constructor(){
        super(NetConst.FightBoss);
        // this.isLocal = true;
    }

    public static create(passId:number){
        var msg = new MsgFightBoss();
        msg.param = new CSFightBoss();
        msg.param.passageId = passId;
        return msg;
    }

    public respFromLocal(){
        var json:any;

        var addGold = Number(Passage.passageInfo.passageCfg.firstGold);
        var addStone = Number(Passage.passageInfo.passageCfg.firstStone);
        var addExp = Number(Passage.passageInfo.passageCfg.firstExp);
        var resInfo:SResInfo = COMMON.resInfo.cloneServerInfo();
        resInfo.gold += addGold;
        resInfo.lifeStone += addStone;
        var userInfo :SUserInfo = COMMON.userInfo.cloneAddExpServerInfo(addExp);
        var passage:SPassageInfo = Passage.passageInfo.cloneServerInfo();
        passage.passId +=1; 

        json ={
            addExp:addExp,
            resInfo:resInfo,
            userInfo:userInfo,
            passageInfo:passage
        }
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCFightBoss.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}