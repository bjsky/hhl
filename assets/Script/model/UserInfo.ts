import InfoBase from "./InfoBase";
import { SUserInfo } from "../net/msg/MsgLogin";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

/**
 * 用户数据
 */
export default class UserInfo  extends InfoBase{
    //用户名
    public name:string = "";
    //头像url
    public icon:string = "";
    //性别
    public gender:number = 0;
    //当前经验
    public exp:number = 0;
    //当前等级总经验
    public totalExp:number = 0;
    //当前等级
    public level:number = 1;
    

    public initFromServer(data:SUserInfo){
        this.name = data.name;
        this.icon = data.icon;
        this.exp = data.exp;
        this.level = data.level;
        
        var levelCfg = CFG.getCfgDataById(ConfigConst.PlayerLevel,this.level);
        this.totalExp = levelCfg.exp;
    }
    public updateInfo(data:SUserInfo){
        this.initFromServer(data);
    }

    public cloneServerInfo():SUserInfo{
        var clone:SUserInfo = new SUserInfo();
        clone.name = this.name;
        clone.icon = this.icon;
        clone.gender = this.gender;
        clone.exp = this.exp;
        clone.level = this.level;
        return clone;
    }
    /**
     * 获得增加经验后的经验和等级
     * @param exp 增加的经验
     */
    public cloneAddExpServerInfo(exp:number):SUserInfo{
        var curExp:number = this.exp + Number(exp);
        var curLevel:number = this.level;
        var total:number = Number(CFG.getCfgDataById(ConfigConst.PlayerLevel,curLevel).exp);
        while(total!=-1 && curExp>total){
            curLevel += 1;
            curExp -= total;
            total = Number(CFG.getCfgDataById(ConfigConst.PlayerLevel,curLevel).exp);
        }
        var clone:SUserInfo = this.cloneServerInfo();
        clone.exp = curExp;
        clone.level = curLevel;
        return clone;
    }
}