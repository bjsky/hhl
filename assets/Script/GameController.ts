import LoadingStepManager, { LoadingStepEnum } from "./module/loading/LoadingStepManager";
import { GLOBAL } from "./GlobalData";
import LoadingStepLogin from "./module/loading/steps/LoadingStepLogin";
import { EVENT } from "./message/EventCenter";
import GameEvent from "./message/GameEvent";
import { GUIDE } from "./manager/GuideManager";
import { UI } from "./manager/UIManager";
import { ResConst } from "./module/loading/steps/LoadingStepRes";

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

    constructor(){
        this.addGameListener();
    }
    public addGameListener(){
        EVENT.on(GameEvent.User_Level_UP,this.onLevelUp,this);
    }

    private _showLevelup:boolean = false;
    private onLevelUp(e){
        if(!GUIDE.isInGuide){
            this._showLevelup = true;
        }
    }

    public showLevelUp(){
        if(this._showLevelup){
            this._showLevelup = false;
            UI.createPopUp(ResConst.LevelupPanel,{});
        }
    }
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
    //断线重来
    public reLogin(){
        this.loadingStepMgr.startReLogin();
    }
}

export var GAME = GameController.getInstance();