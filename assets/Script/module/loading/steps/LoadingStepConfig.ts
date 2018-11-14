import LoadingStep from "../loadingStep";
import { RES } from "../../../manager/ResourceManager";
import { CFG } from "../../../manager/ConfigManager";
import { LoadingStepEnum } from "../LoadingStepManager";
import { EVENT } from "../../../message/EventCenter";
import GameEvent from "../../../message/GameEvent";

export const ConfigConst = {
    Constant:"resources/config/constant.json",
    Building:"resources/config/building.json",
    CardInfo:"resources/config/cardInfo.json",
    CardUp:"resources/config/cardUp.json",
    PlayerLevel:"resources/config/playerLevel.json",
    Stand:"resources/config/stand.json",
    Guide:"resources/config/guide.json"
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

        this.setNext(LoadingStepEnum.Res);
    }
    private loadConfigProgress(pro:number){
        this.updateProgress(pro);
    }
    private loadConfigFailed(msg:string){
        console.log("config load failed!",msg);
    }
}