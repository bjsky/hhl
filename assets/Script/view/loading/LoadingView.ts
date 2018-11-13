import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { SCENE, SceneConst } from "../../manager/SceneManager";


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
export default class LoadingView extends cc.Component {

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;

    @property(cc.Label)
    version: cc.Label = null;


    onEnable(){
        EVENT.on(GameEvent.LOADING_PROGRESS,this.onLoadingProgress,this);
        EVENT.on(GameEvent.LOADING_COMPLETE,this.onLoadingComplete,this);
    }

    onDisable(){
        EVENT.off(GameEvent.LOADING_PROGRESS,this.onLoadingProgress,this);
        EVENT.off(GameEvent.LOADING_COMPLETE,this.onLoadingComplete,this);
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.progress.progress = 0;
    }

    public onLoadingProgress(e:any){
        this.setPro(e.detail);
    }

    public onLoadingComplete(e:GameEvent){
        this.setProgressValue(100);
        this.scheduleOnce(()=>{
            SCENE.changeScene(SceneConst.CityScene);
        },0.1)
    }

    start () {

    }


    private _speed:number  = 50;
    private _curPro:number = 0;
    private _toPro:number = 0;

    public setPro(pro:number){
        if(pro > this._toPro){
            this.setProgressValue(this._toPro);
            this._toPro = pro;
        }
    }

    private setProgressValue(pro){
        this._curPro = pro;
        this.progress.progress = this._curPro/100;
        // console.log(this._curPro);
    }
    
    update (dt) {
        if(this._curPro < this._toPro){
            var pro = this._curPro +(dt *1000/this._speed);
            if(pro > this._toPro){
                pro = this._toPro;
            }
            this.setProgressValue(pro);
        }
    }
}
