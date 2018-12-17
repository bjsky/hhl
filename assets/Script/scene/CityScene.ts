import SceneBase from "./SceneBase";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import AlertPanel, { AlertBtnType } from "../view/AlertPanel";
import { BuildType } from "../view/BuildPanel";
import TouchHandler from "../component/TouchHandler";
import { COMMON } from "../CommonData";
import { GUIDE, GuideTypeEnum } from "../manager/GuideManager";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";

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
    @property(cc.Node)
    content:cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        if(GUIDE.isInGuide && GUIDE.guideInfo.type == GuideTypeEnum.GuideStory){
            this.node.active = false;
            GUIDE.startGuide();
        }else{
            this.showMainUI();
        }
    }

    public showMainUI(){
        this.node.active = true;
        //加载UI
        UI.loadUI(ResConst.MainUI,{showAction:true},this.node,this.showMainUIComplete.bind(this));
    }

    private showMainUIComplete(){
        if(GUIDE.isInGuide){
            GUIDE.startGuide();
        }
    }

    onEnable(){
        this.buildCastle.on(TouchHandler.TOUCH_CLICK,this.onCastleTouch,this);
        this.buildTemple.on(TouchHandler.TOUCH_CLICK,this.onTempleTouch,this);
        this.buildHero.on(TouchHandler.TOUCH_CLICK,this.onHeroTouch,this);
        this.buildBattle.on(TouchHandler.TOUCH_CLICK,this.onBattleTouch,this);
        
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
    }
    onDisable(){
        this.buildCastle.off(TouchHandler.TOUCH_CLICK,this.onCastleTouch,this);
        this.buildTemple.off(TouchHandler.TOUCH_CLICK,this.onTempleTouch,this);
        this.buildHero.off(TouchHandler.TOUCH_CLICK,this.onHeroTouch,this);
        this.buildBattle.off(TouchHandler.TOUCH_CLICK,this.onBattleTouch,this);

        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "building_temple"){
            this.onTempleTouch(null);
        }

        GUIDE.nextGuide(guideId);
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
        UI.showAlert("功能暂未开放，敬请期待！",null,null,AlertBtnType.OKAndCancel);
        // UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Castle});
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
    private _curZoom:number = 1;
    private _toZoom:number = 1;
    private _updateZoom:boolean = false;
    public moveCamToPos(fPos:cc.Vec2,tPos:cc.Vec2,during:number,toZoom:number= 1,cb?:Function){
        this._zoomDuring = during;
        var camPos:cc.Vec2 ;//= this.cam.getTargets()[0].convertToNodeSpaceAR(pos);
        camPos = fPos.sub(tPos);
        var move;
        if(cb!=undefined){
            move = cc.sequence(cc.moveTo(0.3,camPos),cc.callFunc(cb));
        }else{
            move = cc.moveTo(0.3,camPos);
        }
        this.cam.node.runAction(move);
        if(toZoom!= this._curZoom){
            this._updateZoom = true;
            this._toZoom = toZoom;
        }
    }

    public moveCamBack(cb?:Function){
        var move;
        if(cb!=undefined){
            move = cc.sequence(cc.moveTo(0.3,COMMON.ZERO),cc.callFunc(cb));
        }else{
            move = cc.moveTo(0.3,COMMON.ZERO);
        }
        this.cam.node.runAction(move);
        if(this._curZoom!=1){
            this._updateZoom = true;
            this._toZoom = 1;
        }
    }

    public moveSceneByPos(toPos:cc.Vec2,cb?:Function){
        var move;
        if(cb!=undefined){
            move = cc.sequence(cc.moveBy(0.3,toPos),cc.callFunc(cb));
        }else{
            move = cc.moveBy(0.3,toPos);
        }
        this.content.runAction(move);
    }

    update(dt){
        if(this._updateZoom){
            var add:number = (this._toZoom - this._curZoom) * dt/this._zoomDuring;
            var toZoom:number = this.cam.zoomRatio + add;
            if(add>0){
                if(toZoom> this._toZoom){
                    this._curZoom = this.cam.zoomRatio = this._toZoom;
                    this._updateZoom = false;
                }else{
                    this.cam.zoomRatio = toZoom;
                }
            }else{
                if(toZoom < this._toZoom){
                    this._curZoom = this.cam.zoomRatio = this._toZoom;
                    this._updateZoom = false;
                }else{
                    this.cam.zoomRatio = toZoom;
                }
            }
            console.log(this.cam.zoomRatio);
        }
    }

    start () {

    }

    //////////////////////////////
    //      引导
    /////////////////////////////
    public getGuideNode(nodeName):cc.Node{
        var build:cc.Node = null;
        if(nodeName == "building_temple"){
            build = this.buildTemple;
        }else if(nodeName == "building_templetop"){
            build = this.buildTemple;
        }else if(nodeName == "building_hero"){
            build = this.buildHero;
        }else if(nodeName == "building_battle"){
            build = this.buildBattle;
        }
        return build;
    }
    // update (dt) {}
}
