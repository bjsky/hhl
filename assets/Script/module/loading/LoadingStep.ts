import LoadingStepManager, { LoadingStepEnum } from "./LoadingStepManager";


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
    public type:LoadingStepEnum = 0;
    public progress:number = 0;

    private _curProgress:number = 0;
    public get curProgress(){
        return this._curProgress;
    }

    public mgr:LoadingStepManager;
    public ququeType:LoadingStepEnum = 0;
    //开始步骤
    public startStep(){
        this.ququeType = this.type;
        this.mgr.addQueue(this.ququeType,this)
        this.doStep();
    }

    public doStep(){
        console.log("step:",this.type,"start:"+this.ququeType+",time:"+new Date().getTime())
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
            nextStep.ququeType = this.ququeType;
            this.mgr.updateQueue(this.ququeType,this);
            nextStep.doStep();
        }
    }

    public endStep(){
        this.updateProgress(100);
        this.mgr.endQueue(this.ququeType);
    }

}