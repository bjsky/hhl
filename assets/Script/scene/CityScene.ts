import SceneBase from "./SceneBase";
import { UI } from "../manager/UIManager";
import { GUIDE } from "../module/guide/GuideManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import AlertPanel from "../view/AlertPanel";
import { BuildType } from "../view/BuildPanel";

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
export default class CityScene extends SceneBase {

    @property(cc.Node)
    buildCastle: cc.Node = null;
    @property(cc.Node)
    buildTemple: cc.Node = null;
    @property(cc.Node)
    buildHero: cc.Node = null;
    @property(cc.Node)
    buildBattle: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        if(GUIDE.isInGuide){

        }else{
            this.showMainUI();
        }
    }

    private showMainUI(){
        //加载UI
        UI.loadUI(ResConst.MainUI,{showAction:true},this.node);
    }

    onEnable(){
        this.buildCastle.on(cc.Node.EventType.TOUCH_START,this.onCastleTouch,this);
        this.buildTemple.on(cc.Node.EventType.TOUCH_START,this.onTempleTouch,this);
        this.buildHero.on(cc.Node.EventType.TOUCH_START,this.onHeroTouch,this);
        this.buildBattle.on(cc.Node.EventType.TOUCH_START,this.onBattleTouch,this);
    }
    onDisable(){
        this.buildCastle.off(cc.Node.EventType.TOUCH_START,this.onCastleTouch,this);
        this.buildTemple.off(cc.Node.EventType.TOUCH_START,this.onTempleTouch,this);
        this.buildHero.off(cc.Node.EventType.TOUCH_START,this.onHeroTouch,this);
        this.buildBattle.off(cc.Node.EventType.TOUCH_START,this.onBattleTouch,this);
    }

    private onCastleTouch(e){
        UI.showTip("你妈逼哦");
    }
    private _test:number = 0;
    private onTempleTouch(e){
        UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Temple});
    }
    private onHeroTouch(e){
        UI.showAlert("这是个弹窗");
    }
    private onBattleTouch(e){
        
    }

    start () {

    }

    // update (dt) {}
}
