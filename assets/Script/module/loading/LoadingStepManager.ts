import LoadingStep from "./loadingStep";
import LoadingStepConfig from "./steps/LoadingStepConfig";
import LoadingStepLogin from "./steps/LoadingStepLogin";
import LoadingStepRes from "./steps/LoadingStepRes";
import LoadingStepScene from "./steps/LoadingStepScene";
import LoadingStepServerConn from "./steps/LoadingStepServerConn";
import LoadingStepServerData from "./steps/LoadingStepServerData";

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

    constructor(){
        this.steps ={};
        this.steps[LoadingStepEnum.Config] = new LoadingStepConfig(LoadingStepEnum.Config);
        this.steps[LoadingStepEnum.Login] = new LoadingStepLogin(LoadingStepEnum.Login);
        this.steps[LoadingStepEnum.Res] = new LoadingStepRes(LoadingStepEnum.Res);
        this.steps[LoadingStepEnum.Scene] = new LoadingStepScene(LoadingStepEnum.Scene);
        this.steps[LoadingStepEnum.ServerConnect] = new LoadingStepServerConn(LoadingStepEnum.ServerConnect);
        this.steps[LoadingStepEnum.ServerData] = new LoadingStepServerData(LoadingStepEnum.ServerData);
        
    }

    //开始加载
    public startLoading(){
        var firstStep:LoadingStep = this.steps[1];
        if(firstStep){
            firstStep.startStep();
        }
    }
}