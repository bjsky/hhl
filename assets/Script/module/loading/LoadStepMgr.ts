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
        this._progress = 0;
        this.doNext();
    }

    private _curStep:LoadStep = null;
    public doNext(){
        if(this._curStep!=null){
            this._progress+=this._curStep.progress*100;
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
        this._totalProgress = this._progress +curProgress;
        this._updateCb && this._updateCb(this._totalProgress);
    }

    private _totalProgress:number = 0;
    private _progress:number = 0;


    private endStep(){
        this._totalProgress = 100;
        this._updateCb && this._updateCb(this._totalProgress);
        this._completeCb();
    }
}