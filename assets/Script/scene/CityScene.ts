import SceneBase from "./SceneBase";
import { UI } from "../manager/UIManager";
import { GUIDE } from "../module/guide/GuideManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import AlertPanel from "../view/AlertPanel";
import { BuildType } from "../view/BuildPanel";
import TouchHandler from "../component/TouchHandler";
import { COMMON } from "../CommonData";

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
    @property(cc.Camera)
    cam: cc.Camera = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        if(GUIDE.isInGuide){
            GUIDE.startGuide();
        }else{
            this.showMainUI();
        }
    }

    private showMainUI(){
        //加载UI
        UI.loadUI(ResConst.MainUI,{showAction:true},this.node);
    }

    onEnable(){
        this.buildCastle.on(TouchHandler.TOUCH_CLICK,this.onCastleTouch,this);
        this.buildTemple.on(TouchHandler.TOUCH_CLICK,this.onTempleTouch,this);
        this.buildHero.on(TouchHandler.TOUCH_CLICK,this.onHeroTouch,this);
        this.buildBattle.on(TouchHandler.TOUCH_CLICK,this.onBattleTouch,this);
    }
    onDisable(){
        this.buildCastle.off(TouchHandler.TOUCH_CLICK,this.onCastleTouch,this);
        this.buildTemple.off(TouchHandler.TOUCH_CLICK,this.onTempleTouch,this);
        this.buildHero.off(TouchHandler.TOUCH_CLICK,this.onHeroTouch,this);
        this.buildBattle.off(TouchHandler.TOUCH_CLICK,this.onBattleTouch,this);
    }


    public getBuilding(type:number){
        var buildingNode:cc.Node;
        switch(type){
            case BuildType.Temple:
            buildingNode = this.buildTemple;
            break;
            case BuildType.Castle:
            buildingNode = this.buildCastle;
            break;
            case BuildType.Battle:
            buildingNode = this.buildBattle;
            break;
            case BuildType.Hero:
            buildingNode = this.buildHero;
            break;
            default:
            buildingNode = this.buildTemple;
            break;
        }
        return buildingNode;
    }
    private onCastleTouch(e){
        // UI.showTip("你妈逼哦");
        UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Castle});
    }
    private onTempleTouch(e){
        UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Temple});
    }
    private onHeroTouch(e){
        // UI.showAlert("这是个弹窗");
        UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Hero});
    }
    private onBattleTouch(e){
        UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Battle});
        
    }

    private _zoomDuring:number =0.3;
    private _zommMinRatio:number = 1;
    private _zoomMaxRatio:number = 1.2;
    private _updateZoomToMax:boolean = false;
    private _updateZoomToMin:boolean = false;
    public moveCamToPos(pos:cc.Vec2,buildType:number,during:number,cb?:Function){
        this._zoomDuring = during;
        var camPos:cc.Vec2 ;//= this.cam.getTargets()[0].convertToNodeSpaceAR(pos);
        var builidng:cc.Node = this.getBuilding(buildType);
        var bPos:cc.Vec2 = builidng.parent.convertToWorldSpaceAR(builidng.position);
        camPos = bPos.sub(pos);
        var move;
        if(cb!=undefined){
            move = cc.sequence(cc.moveTo(0.3,camPos),cc.callFunc(cb));
        }else{
            move = cc.moveTo(0.3,camPos);
        }
        this.cam.node.runAction(move);
        this._updateZoomToMax = true;
    }

    public moveCamBack(cb?:Function){
        var move;
        if(cb!=undefined){
            move = cc.sequence(cc.moveTo(0.3,COMMON.ZERO),cc.callFunc(cb));
        }else{
            move = cc.moveTo(0.3,COMMON.ZERO);
        }
        this.cam.node.runAction(move);
        this._updateZoomToMin = true;
    }

    update(dt){
        if(this._updateZoomToMax || this._updateZoomToMin){
            var add:number = (this._zoomMaxRatio - this._zommMinRatio) * dt/this._zoomDuring;
            var toZoom:number;
            if(this._updateZoomToMax){
                toZoom = this.cam.zoomRatio + add;
                if(toZoom < this._zoomMaxRatio){
                    this.cam.zoomRatio  = toZoom;
                }else{
                    this.cam.zoomRatio = this._zoomMaxRatio;
                    this._updateZoomToMax = false;
                }
            }else if(this._updateZoomToMin){
                toZoom = this.cam.zoomRatio - add;
                if(toZoom > this._zommMinRatio){
                    this.cam.zoomRatio = toZoom;
                }else{
                    this.cam.zoomRatio = this._zommMinRatio;
                    this._updateZoomToMin = false;
                }
            }
            console.log(this.cam.zoomRatio);
        }
    }

    start () {

    }

    // update (dt) {}
}
