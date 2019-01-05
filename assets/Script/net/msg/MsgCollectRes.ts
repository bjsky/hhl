import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SResInfo, SUserInfo, SPassageInfo } from "./MsgLogin";
import { COMMON } from "../../CommonData";
import { Passage } from "../../module/battle/PassageAssist";

export class SCCollectRes{
    //收集的金币数
    public addGold:number = 0;
    //收集的灵石数
    public addStone:number = 0;
    //收集的经验
    public addExp:number = 0;
    //收集后的res信息
    public resInfo:SResInfo;
    // 收集后的等级经验信息
    public userInfo:SUserInfo;
    //关卡挂机信息
    public passageInfo:SPassageInfo;

    public static parse(obj:any):SCCollectRes{
        var data:SCCollectRes = new SCCollectRes();
        data.addGold = obj.addGold;
        data.addStone = obj.addStone;
        data.addExp = obj.addExp;
        data.resInfo = SResInfo.parse(obj.resInfo);
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.passageInfo = SPassageInfo.parse(obj.passageInfo);
        return data;
    }
}

//卡牌升级
export default class MsgCollectRes extends MessageBase{
    public param:any;
    public resp:SCCollectRes;

    constructor(){
        super(NetConst.CollectPassageRes);
        this.isLocal = true;
    }

    public static create(para?:string){
        var msg = new MsgCollectRes();
        return msg;
    }

    public respFromLocal(){
        var json:any;

        var addGold = Passage.geUnCollectGold();
        var addStone = Passage.getUnCollectStone();
        var addExp = Passage.getUnCollectExp();
        var resInfo:SResInfo = COMMON.resInfo.cloneServerInfo();
        resInfo.gold += addGold;
        resInfo.lifeStone += addStone;
        var userInfo :SUserInfo = COMMON.userInfo.cloneAddExpServerInfo(addExp);
        var passage:SPassageInfo = Passage.passageInfo.cloneServerInfo();
        passage.passStartTime = new Date().getTime();
        passage.passUncollectedTime = 0;
        passage.passUncollectExp = 0;
        passage.passUncollectGold = 0;
        passage.passUncollectStone = 0;

        json ={
            addGold:addGold,
            addStone:addStone,
            addExp:addExp,
            resInfo:resInfo,
            userInfo:userInfo,
            passageInfo:passage
        }
        
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCCollectRes.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}
