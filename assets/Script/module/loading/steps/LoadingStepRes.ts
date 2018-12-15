import LoadingStep from "../loadingStep";
import { RES } from "../../../manager/ResourceManager";
import { LoadingStepEnum } from "../LoadingStepManager";

export const ResConst = {
    MainUI:"prefabs/mainUI",
    AlertPanel:"prefabs/alertPanel",
    TipPanel:"prefabs/tipPanel",
    BuildPanel:"prefabs/buildPanel",
    cardSimple:"prefabs/cardSimple",
    CardDetail:"prefabs/cardDedtail",
    TempleBuild:"prefabs/templeBuild",
    GuideTap:"prefabs/guideTap"
}
/**
 * 加载配置
 */
export default class LoadingStepRes extends LoadingStep{

    private _resArr:string[];
    private _loadedCount:number = 0;
    private _totalCount:number = 0;
    public doStep(){
        this._resArr = [];
        for(var key in ResConst){
            this._resArr.push(ResConst[key]);
        }
        this._totalCount = this._resArr.length;
        this._loadedCount = 0;
        this.loadNext();

    }
    private loadNext(){
        if(this._resArr.length>0){
            cc.loader.loadRes(this._resArr.shift(),(err, prefab) =>{
                if (err) {
                    cc.error(err.message || err);
                    console.log("res load failed!",err.message);
                    return;
                }

                this._loadedCount ++;
                var pro = this._loadedCount *100 /this._totalCount;

                this.updateProgress(pro);
                this.loadNext();
            })
        }else{
            this.setNext(LoadingStepEnum.Scene);
        }
    }
}