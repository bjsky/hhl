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
    //加载队列
    public stepQueue:Array<any> = [];


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
        this.steps[LoadingStepEnum.Config] = new LoadingStepConfig(LoadingStepEnum.Config,10,this);
        this.steps[LoadingStepEnum.Res] = new LoadingStepRes(LoadingStepEnum.Res,40,this);
        this.steps[LoadingStepEnum.Scene] = new LoadingStepScene(LoadingStepEnum.Scene,10,this);
        this.steps[LoadingStepEnum.Login] = new LoadingStepLogin(LoadingStepEnum.Login,20,this);
        this.steps[LoadingStepEnum.ServerConnect] = new LoadingStepServerConn(LoadingStepEnum.ServerConnect,10,this);
        this.steps[LoadingStepEnum.ServerData] = new LoadingStepServerData(LoadingStepEnum.ServerData,10,this);
    }
    //开始加载
    public startLoading(){
        var configStep:LoadingStep = this.getStep(LoadingStepEnum.Config);
        if(configStep){
            configStep.startStep();
        }
    }

    public endLoading(){
        EVENT.emit(GameEvent.LOADING_COMPLETE);
    }
}