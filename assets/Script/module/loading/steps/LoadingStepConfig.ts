import LoadStep from "../LoadStep";
import { RES } from "../../../manager/ResourceManager";
import { CFG } from "../../../manager/ConfigManager";
import { GAME } from "../../../GameController";

export const ConfigConst = {
    Constant:"config/constant",
    Building:"config/building",
    CardInfo:"config/cardInfo",
    CardUp:"config/cardUp",
    PlayerLevel:"config/playerLevel",
    Passage:"config/passage",
    Guide:"config/guide",
    CardSkill:"config/cardSkill",
    SkillUp:"config/skillUp",
    Store:"config/store",
    Score:"config/score",
    Task:"config/task",
    Reward:"config/reward"
}
/**
 * 加载配置
 */
export default class LoadingStepConfig extends LoadStep{
    private _cfgArr:string[];
    protected onStep(){
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
        
        this.endStep();
    }
    private loadConfigProgress(pro:number){
        this.updateProgress(pro);
    }
    private loadConfigFailed(msg:string){
        console.log("config load failed!",msg);
        GAME.reLoading();
    }
}