import LoadingStep from "../loadingStep";
import { RES } from "../../../manager/ResourceManager";
import { CFG } from "../../../manager/ConfigManager";
import { LoadingStepEnum } from "../LoadingStepManager";

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

        var serverStep:LoadingStep = this.getStep(LoadingStepEnum.Login);
        
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