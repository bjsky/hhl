import LoadingStepManager from "./LoadingStepManager";


/**
 * 
 * 登录步骤基类，登录状态机的状态类型，对应一个进度表现和描述
 */
export default class LoadingStep{
    constructor(type,pro,mgr){
        this.type = type;
        this.progress = pro/100;

        this.mgr = mgr;
    }
    //枚举类型
    public queueIndex:number = -1;
    public type:number = 0;
    public progress:number = 0;

    private _curProgress:number = 0;
    public get curProgress(){
        return this._curProgress;
    }

    public mgr:LoadingStepManager;
    //开始步骤
    public startStep(){
        this.mgr.stepQueue.push(this);
        this.queueIndex = this.mgr.stepQueue.indexOf(this);
        this.doStep();
    }

    public doStep(){

    }

    public getStep(name){
        return this.mgr.getStep(name);
    }

    public updateProgress(pro){
        this._curProgress = pro * this.progress;
        this.mgr.updateTotalProgress();
    }

    public setNext(type){
        this.updateProgress(100);
        var nextStep:LoadingStep = this.getStep(type);
        if(nextStep){
            nextStep.queueIndex = this.queueIndex;
            this.mgr.stepQueue[this.queueIndex] = nextStep;
            nextStep.doStep();
        }
    }

    public endStep(){
        this.updateProgress(100);
        this.mgr.stepQueue.splice(this.queueIndex,1);
        if(this.mgr.stepQueue.length == 0){
            this.mgr.endLoading();
        }
    }

}