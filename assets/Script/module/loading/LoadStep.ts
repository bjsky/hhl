
export enum LoadStepEnum  {
    Config = 1,         //加载配置
    Login,        //微信登录
    Res,                //资源加载
    Scene,              //场景预支加载
    ServerConnect,      //服务器连接
    ServerData          //服务器数据
}

export default class LoadStep{
    constructor(type:LoadStepEnum,pro:number){
        this.type = type;
        this.progress = pro;
    }
    public type:LoadStepEnum =0;
    public progress:number = 0;

    private _curProgress:number = 0;
    public get curProgress(){
        return this._curProgress;
    }

    public updateProgress(pro){
        this._curProgress = pro/100 * this.progress;
        this._updateFunc && this._updateFunc(this._curProgress);
    }

    private _completeFunc:Function = null;
    private _updateFunc:Function = null;
    public doStep(completeFuc:Function,updateFunc:Function){
        this._completeFunc = completeFuc;
        this._updateFunc = updateFunc;
        this.onStep();
    }
    protected onStep(){

    }

    public resume(){
        
    }

    protected endStep(){
        this._completeFunc && this._completeFunc();
    }
}