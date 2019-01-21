import LoadingStep from "../loadingStep";
import { SceneConst } from "../../../manager/SceneManager";
import { LoadingStepEnum } from "../LoadingStepManager";
import LoadingStepLogin from "./LoadingStepLogin";
import { EVENT } from "../../../message/EventCenter";
import GameEvent from "../../../message/GameEvent";
/**
 * 加载配置
 */
export default class LoadingStepScene extends LoadingStep{

    private preloadSceneNameArr:string[];
    public doStep(){
        super.doStep();
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
            // this.setNext(LoadingStepEnum.Login);
            var login:LoadingStepLogin = this.mgr.getStep(LoadingStepEnum.Login) as LoadingStepLogin;
            if(login.showUserInfoAuthButton){
                EVENT.emit(GameEvent.Show_UserInfo_AuthButton);
            }
            this.endStep();
        }
    }
}