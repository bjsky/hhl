import LoadingStepManager, { LoadingStepEnum } from "./module/loading/LoadingStepManager";
import { GLOBAL } from "./GlobalData";
import LoadingStepLogin from "./module/loading/steps/LoadingStepLogin";

/**
 *  游戏逻辑控制器
 * 
 */
export default class GameController{
    private static _instance: GameController = null;
    public static getInstance(): GameController {
        if (GameController._instance == null) {
            GameController._instance = new GameController();
            
        }
        return GameController._instance;
    }

    //游戏加载管理器
    private loadingStepMgr:LoadingStepManager;

    /**
     *  游戏启动
     * 
     */
    public start(){
        //初始化
        GLOBAL.initGameConfig();
        //加载
        this.loadingStepMgr = new LoadingStepManager();
        this.loadingStepMgr.startLoading();
    }

    public resumeLogin(){
        var loginStep:LoadingStepLogin = this.loadingStepMgr.getStep(LoadingStepEnum.Login)
        if(loginStep){
            loginStep.setNext(LoadingStepEnum.ServerConnect);
        }
    }
}

export var GAME = GameController.getInstance();