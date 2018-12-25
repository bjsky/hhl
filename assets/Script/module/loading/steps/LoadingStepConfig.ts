import LoadingStep from "../loadingStep";
import { RES } from "../../../manager/ResourceManager";
import { CFG } from "../../../manager/ConfigManager";
import { LoadingStepEnum } from "../LoadingStepManager";
import { EVENT } from "../../../message/EventCenter";
import GameEvent from "../../../message/GameEvent";
import LoadingStepServerData from "./LoadingStepServerData";

export const ConfigConst = {
    Constant:"config/constant",
    Building:"config/building",
    CardInfo:"config/cardInfo",
    CardUp:"config/cardUp",
    PlayerLevel:"config/playerLevel",
    Stand:"config/stand",
    Guide:"config/guide",
    CardSkill:"config/cardSkill",
    SkillUp:"config/skillUp"
}
/**
 * 加载配置
 */
export default class LoadingStepConfig extends LoadingStep{

    private _cfgArr:string[];
    public doStep(){

        this._cfgArr = [];
        for(var key in ConfigConst){
            this._cfgArr.push(ConfigConst[key]);
        }

        RES.load(this._cfgArr,this.loadConfigComplete.bind(this),this.loadConfigProgress.bind(this),this.loadConfigFailed.bind(this));   
    }

    private loadConfigComplete(resArr:any){
        resArr.forEach(res => {
            CFG.parseCfg(res,RES.get(res));
        });
        console.log("Config loaded!");

        //必须加载完配置后
        var serverStep:LoadingStepServerData = this.getStep(LoadingStepEnum.ServerData);
        if(serverStep){
            serverStep.startStep();
        }
        this.setNext(LoadingStepEnum.Res);
    }
    private loadConfigProgress(pro:number){
        this.updateProgress(pro);
    }
    private loadConfigFailed(msg:string){
        console.log("config load failed!",msg);
    }
}