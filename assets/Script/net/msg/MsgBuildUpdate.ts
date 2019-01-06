import MessageBase from "./MessageBase";
import { SResInfo, SBuildInfo, SUserInfo } from "./MsgLogin";
import NetConst from "../NetConst";
import BuildInfo from "../../model/BuildInfo";
import { BUILD } from "../../module/build/BuildAssist";
import { COMMON } from "../../CommonData";
import ResInfo from "../../model/ResInfo";
import { CFG } from "../../manager/ConfigManager";


export class CSBuildUpdate{
    //建筑类型
    public buildType:number = 0;
}

export class SCBuildUpdate{
    //建筑类型
    public buildType:number = 0;
    //当前建筑等级
    public buildInfo:SBuildInfo = null;
    //最新的res
    public retRes:SResInfo = null;
    //最新的用户数据
    public userInfo:SUserInfo = null;

    public static parse(obj:any):SCBuildUpdate{
        var data:SCBuildUpdate = new SCBuildUpdate();
        data.buildType = obj.buildType;
        data.buildInfo = SBuildInfo.parse(obj.buildInfo);
        data.retRes = SResInfo.parse(obj.retRes);
        data.userInfo = SUserInfo.parse(obj.userInfo);
        return data;
    }
}
export default class MsgBuildUpdate extends MessageBase{
    public param:CSBuildUpdate;
    public resp:SCBuildUpdate;

    constructor(){
        super(NetConst.BuildUpdate);
        // this.isLocal = true;
    }
    public static create(buildType:number){
        var msg:MsgBuildUpdate = new MsgBuildUpdate();
        msg.param = new CSBuildUpdate();
        msg.param.buildType = buildType;
        return msg;
        
    }
    public respFromLocal(){
        var info:BuildInfo = BUILD.getBuildInfo(this.param.buildType)
        var sInfo:SBuildInfo = info.cloneServerInfo();
        var needGold = info.buildLevelCfg.upNeedGold;
        sInfo.level += 1;
        var retRes:SResInfo = COMMON.resInfo.cloneServerInfo();
        retRes.gold -= needGold;

        var userInfo = COMMON.userInfo.cloneAddExpServerInfo(info.buildLevelCfg.upGetExp);
        var json:any ={
            buildType:this.param.buildType,
            buildInfo:sInfo,
            retRes:retRes,
            userInfo:userInfo
        };
        
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCBuildUpdate.parse(obj);
        return this;
    }
}