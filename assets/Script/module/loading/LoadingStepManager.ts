import LoadingStep from "./loadingStep";
import LoadingStepConfig from "./steps/LoadingStepConfig";
import LoadingStepLogin from "./steps/LoadingStepLogin";
import LoadingStepRes from "./steps/LoadingStepRes";
import LoadingStepScene from "./steps/LoadingStepScene";
import LoadingStepServerConn from "./steps/LoadingStepServerConn";
import LoadingStepServerData from "./steps/LoadingStepServerData";
import { SCENE, SceneConst } from "../../manager/SceneManager";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { GLOBAL, ServerType } from "../../GlobalData";

export enum LoadingStepEnum  {
    Config = 1,         //加载配置
    Login,        //微信登录
    Res,                //资源加载
    Scene,              //场景预支加载
    ServerConnect,      //服务器连接
    ServerData          //服务器数据
}

export default class LoadingStepManager{

    public steps:any = {};

    public stepQueueMap:any ={};

    public getStep(stepName){
        return this.steps[stepName];
    }

    public updateTotalProgress(){
        var total:number = 0;
        for(var key in this.steps){
            var step:LoadingStep = this.getStep(key);
            total += step.curProgress;

        }
        if(total>100){
            total = 100;
        }
        EVENT.emit(GameEvent.LOADING_PROGRESS,total);
    }

    constructor(){
        this.stepQueueMap ={};
        this.steps[LoadingStepEnum.Config] = new LoadingStepConfig(LoadingStepEnum.Config,10,this);
        this.steps[LoadingStepEnum.Res] = new LoadingStepRes(LoadingStepEnum.Res,80,this);
        this.steps[LoadingStepEnum.Scene] = new LoadingStepScene(LoadingStepEnum.Scene,10,this);
        this.steps[LoadingStepEnum.Login] = new LoadingStepLogin(LoadingStepEnum.Login,0,this);
        this.steps[LoadingStepEnum.ServerConnect] = new LoadingStepServerConn(LoadingStepEnum.ServerConnect,0,this);
        this.steps[LoadingStepEnum.ServerData] = new LoadingStepServerData(LoadingStepEnum.ServerData,0,this);
    }
    //开始加载
    public startLoading(){
        var configStep:LoadingStep = this.getStep(LoadingStepEnum.Config);
        if(configStep){
            configStep.startStep();
        }
    }

    private _isRelogin:boolean = false;
    public get isRelogin(){
        return this._isRelogin;
    }
    public startReLogin(){
        this._isRelogin = true;
        var configStep:LoadingStep = this.getStep(LoadingStepEnum.Login);
        if(configStep){
            configStep.startStep();
        }
    }

    public endLoading(){
        EVENT.emit(GameEvent.LOADING_COMPLETE);
    }

    public addQueue(type:LoadingStepEnum ,step:LoadingStep){
        if(this.stepQueueMap[type] == undefined){
            this.stepQueueMap[type] = step;
        }
    }
    public getQueueCount(){
        var count:number = 0;
        for(var key in this.stepQueueMap){
            count ++;
        }
        return count;
    }
    public updateQueue(type:LoadingStepEnum,step:LoadingStep){
        if(this.stepQueueMap[type]!=undefined){
            this.stepQueueMap[type] = step;
        }
    }

    public endQueue(type:LoadingStepEnum){
        if(this.stepQueueMap[type]!=undefined){
            delete this.stepQueueMap[type];
        }
        if(this.getQueueCount()==0){
            if(this.isRelogin){
                this._isRelogin = false;
                console.log("relogin success!");
            }else{
                this.endLoading();
            }
        }
    }
}