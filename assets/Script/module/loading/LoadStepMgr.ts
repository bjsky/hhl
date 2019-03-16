import LoadStep from "./LoadStep";

export default class LoadStepMgr{
    constructor(steps:LoadStep[]){
        this._steps = steps;
    }
    private _steps:LoadStep[] = [];

    private _completeCb:Function = null;
    private _updateCb:Function = null;
    public start(complete:Function,updateFunc:Function = null){
        this._completeCb = complete;
        this._updateCb = updateFunc;
        this._totalProgress = 0;
        this.doNext();
    }

    private _curStep:LoadStep = null;
    public doNext(){
        if(this._curStep!=null){
            this._totalProgress+=this._curStep.progress;
            this._updateCb && this._updateCb(this._totalProgress);
        }
        if(this._steps.length>0){
            this._curStep = this._steps.shift();
            this._curStep.doStep(this.stepComplete.bind(this),this.stepUpdate.bind(this));
        }else{
            this._curStep =null;
            this.endStep();
        }
    }

    public resume(){
        if(this._curStep){
            this._curStep.resume();
        }
    }
    private stepComplete(){
        this.doNext();
    }
    private stepUpdate(curProgress){
        var progress = this._totalProgress +curProgress;
        this._updateCb && this._updateCb(progress);
    }

    private _totalProgress:number = 0;


    private endStep(){
        this._completeCb();
    }
}