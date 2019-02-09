import SceneBase from "./SceneBase";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import AlertPanel, { AlertBtnType } from "../view/AlertPanel";
import BuildPanel, { BuildType } from "../view/BuildPanel";
import TouchHandler from "../component/TouchHandler";
import { COMMON } from "../CommonData";
import { GUIDE, GuideTypeEnum } from "../manager/GuideManager";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import { SOUND, SoundConst } from "../manager/SoundManager";
import { Battle } from "../module/battle/BattleAssist";

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

    private _activeBuild:BuildPanel = null;
    public set activeBuild(b:BuildPanel){
        this._activeBuild = b;
    }
    public get activeBuild():BuildPanel{
        return this._activeBuild;
    }
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

        SOUND.playBgSound(SoundConst.Bg_sound);
    }

    onEnable(){
        this.buildCastle.on(TouchHandler.TOUCH_CLICK,this.onCastleTouch,this);
        this.buildTemple.on(TouchHandler.TOUCH_CLICK,this.onTempleTouch,this);
        this.buildHero.on(TouchHandler.TOUCH_CLICK,this.onHeroTouch,this);
        this.buildBattle.on(TouchHandler.TOUCH_CLICK,this.onBattleTouch,this);
        
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.on(GameEvent.Goto_build_panel,this.onGotoPanelFast,this);
    }
    onDisable(){
        this.buildCastle.off(TouchHandler.TOUCH_CLICK,this.onCastleTouch,this);
        this.buildTemple.off(TouchHandler.TOUCH_CLICK,this.onTempleTouch,this);
        this.buildHero.off(TouchHandler.TOUCH_CLICK,this.onHeroTouch,this);
        this.buildBattle.off(TouchHandler.TOUCH_CLICK,this.onBattleTouch,this);

        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.off(GameEvent.Goto_build_panel,this.onGotoPanelFast,this);
    }

    private onGotoPanelFast(e){
        var buildType = e.detail.type;
        if(this._activeBuild){
            this._activeBuild.closeUI(()=>{
                this.openBuildUI(buildType);
            })
        }else{
            this.openBuildUI(buildType);
        }
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
        if(Battle.battleDataInited){
            this.openBuildUI(BuildType.Castle);
        }else{
            UI.showTip("战场数据初始化中，请稍候点击");
        }
        // UI.createPopUp(ResConst.BuildPanel,{buildType:BuildType.Castle});
    }
    private onTempleTouch(e){
        this.openBuildUI(BuildType.Temple);
    }
    private onHeroTouch(e){
        // UI.showAlert("这是个弹窗");
        this.openBuildUI(BuildType.Hero)
    }
    private onBattleTouch(e){
        this.openBuildUI(BuildType.Battle);
    }

    private openBuildUI(type:BuildType){
        switch(type){
            case BuildType.Castle:
            // UI.showAlert("功能暂未开放，敬请期待！",null,null,AlertBtnType.OKAndCancel);
            UI.loadPanel(ResConst.BuildPanel,{buildType:BuildType.Castle})
            break;
            case BuildType.Temple:
            UI.loadPanel(ResConst.BuildPanel,{buildType:BuildType.Temple});
            break;
            case BuildType.Hero:
            UI.loadPanel(ResConst.BuildPanel,{buildType:BuildType.Hero});
            break;
            case BuildType.Battle:
            UI.loadPanel(ResConst.BuildPanel,{buildType:BuildType.Battle});
            break;
        }
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

    public moveSceneToPos(toPos:cc.Vec2,cb?:Function){
        var local:cc.Vec2 = this.content.parent.convertToNodeSpaceAR(toPos);
        var move;
        var contentPos = this.content.position.sub(local);
        var contentMaxX = (this.content.width-this.content.parent.width)/2;
        var contentMinX = -(this.content.width-this.content.parent.width)/2;
        var contentMaxY = (this.content.height - this.content.parent.height)/2;
        var contentMinY = -(this.content.height - this.content.parent.height)/2;
        if(contentPos.x<contentMinX){
            contentPos.x = contentMinX;
        }
        if(contentPos.x>contentMaxX){
            contentPos.x = contentMaxX;
        }
        if(contentPos.y<contentMinY){
            contentPos.y = contentMinY;
        }
        if(contentPos.y>contentMaxY){
            contentPos.y = contentMaxY;
        }
        if(cb!=undefined){
            move = cc.sequence(cc.moveTo(0.3,contentPos),cc.callFunc(cb));
        }else{
            move = cc.moveTo(0.3,contentPos);
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
    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "building_temple"){
            this.openBuildUI(BuildType.Temple);
            GUIDE.nextGuide(guideId);
        }else if(nodeName == "building_hero"){
            this.openBuildUI(BuildType.Hero);
            GUIDE.nextGuide(guideId);
        }else if(nodeName == "building_battle"){
            this.openBuildUI(BuildType.Battle);
            GUIDE.nextGuide(guideId);
        }
    }
    // update (dt) {}
}
