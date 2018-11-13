import LoadingStep from "../loadingStep";
import { SceneConst } from "../../../manager/SceneManager";
/**
 * 加载配置
 */
export default class LoadingStepScene extends LoadingStep{


    private preloadSceneNameArr:string[];
    public doStep(){

        this.preloadSceneNameArr = [SceneConst.CityScene];
        this.preloadScene();
    }

    private doPreload(name:string){
        cc.director.preloadScene(name,()=>{
            this.preloadScene();
        });
    }


    private preloadScene(){
        if(this.preloadSceneNameArr.length>0){
            this.doPreload(this.preloadSceneNameArr.shift());
        }else{
            this.endStep();
        }
    }
}