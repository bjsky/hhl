// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ExpLevelEffect extends cc.Component {

    @property(cc.ProgressBar) expProgress: cc.ProgressBar = null;
    @property(cc.Label) levelLabel: cc.Label = null;
    @property(cc.Label) expLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    
    private _levelAdd:number =0;
    private _isUpdating:boolean = false;
    private _isPlaying:boolean = false;
    private _change:ProgressChangeValue =null;

    private _initExp:number = 0;
    private _initLevelExp:number = 0;
    private _initLevel:number = 0;
    private _expLevelChangeList:Array<ProgressChangeValue> = [];
    public initProgress(exp:number,levelExp:number,level:number){
        this._initExp = Number(exp);
        this._initLevelExp = Number(levelExp);
        this._initLevel = Number(level);

        this.expLabel.string = (this._initExp.toFixed(0)) + " / "+ (this._initLevelExp.toFixed(0));
        this.expProgress.progress = this._initExp / this._initLevelExp;
        this.levelLabel.string = this._initLevel.toString();
    }

    public playProgressAnim(exp,levelExp,level){
        this._expLevelChangeList.push(new ProgressChangeValue(exp,levelExp,level));
        // Log.debug("progress_count++:",this._playCount);
            
        if(this._isPlaying){
            return;
        }
        this._isPlaying = true;
        this.checkNext();
    }

    private checkNext(){
        if(this._expLevelChangeList.length>0){
            this._change = this._expLevelChangeList.shift();
            this.doStartAnim();
        }else{
            this._isPlaying = false;
        }
    }

    private doStartAnim(){
        this._levelAdd =  this._change.lv - this._initLevel;
        this._startPro = this._initExp/ this._initLevelExp;
        this._endPro = this._change.exp/this._change.lvExp;

        this.startAnim();
    }

    private startAnim(){
        this._isUpdating = true;
        
    }
    private stopAnim(){
        this.initProgress(this._change.exp,this._change.lvExp,this._change.lv);
        this._isUpdating = false;

        this.checkNext();
    }

    private _speed:number =2;
    private _startPro:number;
    private _endPro:number;
    // private _curPro:number;
    update (dt) {

        if(!this._isUpdating)
            return;
        
        this._startPro += this._speed*dt;
        if(this._levelAdd>0){ 
            if(this._startPro >= 1){
                this._levelAdd --;
                this._startPro = 0;
            }
        }else{
            //开始到结束
            if(this._startPro >= this._endPro){
                this._startPro = this._endPro;
                this.stopAnim();
            }
        }
        // Log.debug("progress_:",this._startPro,this._levelAdd);
        this.expProgress.progress = this._startPro;
    }
    // update (dt) {}
}

export class ProgressChangeValue{
    constructor(exp,lvExp,lv){
        this.exp = exp;
        this.lv = lv ;
        this.lvExp = lvExp;
    }
    public exp:number = 0;
    public lvExp:number = 0;
    public lv:number = 0;
}