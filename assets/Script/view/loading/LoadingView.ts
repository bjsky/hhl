import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { SCENE, SceneConst } from "../../manager/SceneManager";
import { WeiXin } from "../../wxInterface";
import { GLOBAL, ServerType } from "../../GlobalData";
import { GAME } from "../../GameController";
import { COMMON } from "../../CommonData";


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
    @property(cc.Button)
    btnEnterGame: cc.Button = null;
    @property(cc.Node)
    nodeLoading: cc.Node = null;



    onEnable(){
        EVENT.on(GameEvent.LOADING_PROGRESS,this.onLoadingProgress,this);
        EVENT.on(GameEvent.LOADING_COMPLETE,this.onLoadingComplete,this);
        EVENT.on(GameEvent.Show_UserInfo_AuthButton,this.showUserInfoButton,this);
        this.initView();
    }

    onDisable(){
        EVENT.off(GameEvent.LOADING_PROGRESS,this.onLoadingProgress,this);
        EVENT.off(GameEvent.LOADING_COMPLETE,this.onLoadingComplete,this);
        EVENT.off(GameEvent.Show_UserInfo_AuthButton,this.showUserInfoButton,this);
    }

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.progress.progress = 0;
        this.progressLabel.string ="0 %";
        this.btnEnterGame.node.active = false;
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

    private initView(){
        this.version.string = "v"+GLOBAL.version;
        this.nodeLoading.active = true;
    }

    private showUserInfoButton(e){
        this.btnEnterGame.node.active = true;
        var btnNode = this.btnEnterGame.node;
        let btnSize = cc.size(btnNode.width+10,btnNode.height+10);
        let frameSize = cc.view.getFrameSize();
        let winSize = cc.director.getWinSize();
        // console.log("winSize: ",winSize);
        // console.log("frameSize: ",frameSize);
        //适配不同机型来创建微信授权按钮
        let left = (winSize.width*0.5+btnNode.x-btnSize.width*0.5)/winSize.width*frameSize.width;
        let top = (winSize.height*0.5-btnNode.y-btnSize.height*0.5)/winSize.height*frameSize.height;
        let width = btnSize.width/winSize.width*frameSize.width;
        let height = btnSize.height/winSize.height*frameSize.height;
        WeiXin.createUserInfoButton(left,top,width,height,(userInfo)=>{
            GLOBAL.initUserInfo(userInfo);
            GAME.resumeLogin();
        });
        this.nodeLoading.active = false;
    }
    start () {

    }

    private infoButtonTap(useInfo){

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
        this.progressLabel.string = this._curPro.toFixed(0) + " %";
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
