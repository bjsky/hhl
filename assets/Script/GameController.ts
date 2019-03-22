import { GLOBAL } from "./GlobalData";
import LoadingStepLogin from "./module/loading/steps/LoadingStepLogin";
import { EVENT } from "./message/EventCenter";
import GameEvent from "./message/GameEvent";
import { GUIDE } from "./manager/GuideManager";
import { UI } from "./manager/UIManager";
import LoadingStepRes, { ResConst } from "./module/loading/steps/LoadingStepRes";
import LoadStepMgr from "./module/loading/LoadStepMgr";
import LoadStep, { LoadStepEnum } from "./module/loading/LoadStep";
import LoadingStepConfig from "./module/loading/steps/LoadingStepConfig";
import LoadingStepScene from "./module/loading/steps/LoadingStepScene";
import LoadingStepServerConn from "./module/loading/steps/LoadingStepServerConn";
import LoadingStepServerData from "./module/loading/steps/LoadingStepServerData";

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
        // LoadSprite.addSpriteAtlas("image/ui/","image/ui/image_ui");
        //修改下载并发
        cc.macro.DOWNLOAD_MAX_CONCURRENT = 4;
        GLOBAL.initSystemInfo();
        //初始化
        GLOBAL.initGameConfig();
        // //加载
        // this.loadingStepMgr = new LoadingStepManager();
        // this.loadingStepMgr.startLoading();
        this.startLoading();
    }

    public reLoading(){
        this.startLoading();
    }

    private _cfgStepMgr:LoadStepMgr;
    private _cfgStepProgress:number = 0;
    private _loadingStepMgr:LoadStepMgr;
    private _loadingStepProgress:number = 0;
    private _loginStepMgr:LoadStepMgr;
    private _loginStepProgress:number =0;
    private startLoading(){
        this._resLoaded = false;
        this._loginEnd = false;
        this._showUserAuthButton = false;
        this._cfgStepProgress = this._loadingStepProgress =this._loginStepProgress = 0;

        this._cfgStepMgr = new LoadStepMgr(
            [new LoadingStepConfig(LoadStepEnum.Config,10)]
        )
        this._cfgStepMgr.start(this.configComplete.bind(this),this.onCfgProgress.bind(this));
    }
    private configComplete(){
        this._cfgStepMgr = null;
        this._loadingStepMgr = new LoadStepMgr([
            new LoadingStepRes(LoadStepEnum.Res,60),
            new LoadingStepScene(LoadStepEnum.Scene,10)
        ])
        this._loadingStepMgr.start(this.loadingComplete.bind(this),this.onLoadingProgress.bind(this));
        this._loginStepMgr = new LoadStepMgr([
            new LoadingStepLogin(LoadStepEnum.Login,10),
            new LoadingStepServerConn(LoadStepEnum.ServerConnect,5),
            new LoadingStepServerData(LoadStepEnum.ServerData,5),]);
        this._loginStepMgr.start(this.loginComplete.bind(this),this.onLoginProgress.bind(this));
    }

    private onCfgProgress(total:number){
        this._cfgStepProgress = total;
        this.showProgress();
    }
    private onLoadingProgress(total:number){
        this._loadingStepProgress = total;
        this.showProgress();
    }
    private onLoginProgress(total:number){
        this._loginStepProgress = total;
        this.showProgress();
    }
    private showProgress(){
        var total = this._cfgStepProgress + this._loadingStepProgress + this._loginStepProgress;
        EVENT.emit(GameEvent.LOADING_PROGRESS,total);
    }

    private _resLoaded:boolean =false;
    private _loginEnd:boolean =false;
    private _showUserAuthButton:boolean = false;
    private loadingComplete(){
        this._loadingStepMgr = null;
        this._resLoaded = true;
        this.checkConnect();
    }

    public setLoginEnd(showUserAuthButton:boolean){
        this._loginEnd = true;
        this._showUserAuthButton = showUserAuthButton;
        this.checkConnect();
    }

    private checkConnect(){
        if(this._loginEnd && this._resLoaded){
            if(this._showUserAuthButton){   //显示授权
                this._showUserAuthButton = false;
                EVENT.emit(GameEvent.Show_UserInfo_AuthButton);
            }else{
                this.resumeLogin(); //直接登录
            }
        }
    }

    public resumeLogin(){
        if(this._loginStepMgr){
            this._loginStepMgr.resume();
        }
    }

    private loginComplete(){
        this._loginStepMgr = null;
        EVENT.emit(GameEvent.LOADING_COMPLETE);
    }

    private _isReLogin:boolean =false;
    public get isReLogin(){
        return this._isReLogin;
    }
    //断线重来
    public reLogin(){
        this._isReLogin = true;
        var reLoginStepMgr:LoadStepMgr = new LoadStepMgr([
            new LoadingStepLogin(LoadStepEnum.Login,0),
            new LoadingStepServerConn(LoadStepEnum.ServerConnect,0),
            new LoadingStepServerData(LoadStepEnum.ServerData,0),
        ])
        reLoginStepMgr.start(this.reLoginComplete.bind(this));
    }
    private reLoginComplete(){
        this._isReLogin = false;
        if(this._loginStepMgr!=null){
            this.loginComplete();
        }
    }

    //后台加载资源
    private _preloadArr:Array<any> = [];
    private _preloadComplete:boolean = false;
    public preloadResDir(){
        if(this._preloadComplete){
            return;
        }
        this._preloadArr = [];
        for(var key in BackLoadResConst){
            this._preloadArr.push(BackLoadResConst[key]);
        }
        this.preloadNext();
    }

    private preloadNext(){
        if(this._preloadArr.length>0){
            var preload = this._preloadArr.shift();
            cc.loader.loadResDir(preload, (error: Error, resource: any[]) => {
                if(error){
                    cc.error(error);
                }else{
                    console.log("preloadRes complete:"+preload);
                }
                this.preloadNext();
            });
        }else{
            this._preloadComplete = true;
        }
    }
}
export const BackLoadResConst = {
    ImageUI:"image/ui",
    Cards:"image/card",
    CardSmall:"image/cardSmall",
    Heads:"image/head",
    Sound:"sound",
    Skills:"image/skill",
}

export var GAME = GameController.getInstance();