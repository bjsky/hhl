import UIBase from "../component/UIBase";
import { UI } from "../manager/UIManager";
import ButtonEffect from "../component/ButtonEffect";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import CityScene from "../scene/CityScene";
import { SCENE } from "../manager/SceneManager";
import { CONSTANT } from "../Constant";
import BuildInfo from "../model/BuildInfo";
import { COMMON } from "../CommonData";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { BUILD } from "../module/build/BuildAssist";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import StringUtil from "../utils/StringUtil";
import { GUIDE, GuideTypeEnum } from "../manager/GuideManager";
import ResPanel, { ResPanelType } from "./ResPanel";
import { Battle } from "../module/battle/BattleAssist";
import { GLOBAL } from "../GlobalData";

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

export enum BuildType{
    Castle = 0, //瀛洲城
    Temple, //祭坛
    Hero,   //英雄
    Battle  //试炼
}

@ccclass
export default class BuildPanel extends UIBase{

    @property(cc.Button)
    closeBtn: cc.Button = null;
    // @property(cc.Sprite)
    // bgSpr: cc.Sprite = null;
    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    panelNode: cc.Node = null;
    @property(cc.Node)
    panelNodeload: cc.Node = null;
    @property(cc.Node)
    buildIcon: cc.Node = null;
    @property(cc.Label)
    buildName: cc.Label = null;

    @property(cc.Label)
    curLevelDesc: cc.Label = null;
    @property(cc.Label)
    nextLevelDesc: cc.Label = null;
    @property(cc.Button)
    upgradeBtn: cc.Button = null;
    @property(cc.Label)
    costGold: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    private _buildType:number = 0;
    private _buildUI:UIBase = null;
    private _buildInfo:BuildInfo = null;
    private _nextLevelCfg:any = null;
    
    public setData(param:any){
        this._buildType = param.buildType;
        this._buildInfo = BUILD.getBuildInfo(this._buildType);
        if((this._buildInfo.level+1)>CONSTANT.getMaxPlayerLevel()){
            this._nextLevelCfg = null;
        }else{
            this._nextLevelCfg = CFG.getCfgByKey(ConfigConst.Building,"level",(this._buildInfo.level+1))[0];
        }

    }

    onLoad () {
    }

    public loadBuild(){
        var res:string = "";
        switch(this._buildType){
            case BuildType.Temple:
            res = ResConst.TemplePanel;
            break;
            case BuildType.Battle:
            res = ResConst.BattlePanel;
            break;
            case BuildType.Hero:
            res = ResConst.HeroPanel;
            break;
            case BuildType.Castle:
            res = ResConst.CastlePanel;
            break;
            default:
            res = ResConst.TemplePanel;
            break;
        }
        UI.loadUI(res,{type:this._buildType},this.panelNodeload,this.loadComplete.bind(this));

        this.initBuildView();
    }

    private loadComplete(ui:UIBase){
        this._buildUI = ui;
        this.panelNode.width = cc.winSize.width+10;
        if(GLOBAL.isIPhoneX){
            this.panelNode.height = cc.winSize.height - GLOBAL.statusBarHeight -414;
        }else{
            this.panelNode.height = cc.winSize.height - 414;
        }
        this.panelNode.y = -1100;
        this.panelNode.active = true;
        this.topNode.active = true;
        this.topNode.x = 750;
        this.doShow();
    }

    onEnable(){
        this.closeBtn.node.on(ButtonEffect.CLICK_END,this.onClose,this);
        this.upgradeBtn.node.on(ButtonEffect.CLICK_END,this.onUpdate,this);
        
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        
        if(UI.showFighting){
            UI.showFighting = false;
        }else{
            this.panelNode.active = false;
            this.topNode.active = false;
            this.loadBuild();
        }
    }
    onDisable(){
        this.closeBtn.node.off(ButtonEffect.CLICK_END,this.onClose,this);
        this.upgradeBtn.node.off(ButtonEffect.CLICK_END,this.onUpdate,this)

        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        
        if(!UI.showFighting){
            this.clear();
        }
    }

    public closeUI(cb:Function){
        this.doClose(cb);
    }
    private onClose(){
        if(GUIDE.isInGuide && GUIDE.guideInfo.type == GuideTypeEnum.GuideDrag){
            return;
        }
        this.doClose();
    }
    private clear(){
        if(this._buildUI!=null){
            UI.removeUI(this._buildUI.node);
            this._buildUI = null;
        }
    }

    private doClose(cb?:Function){
        this.doHide(()=>{
            UI.removePanel(this.node);
            var scene:CityScene = SCENE.CurScene as CityScene;
            scene.activeBuild = null;
            cb && cb();
        })
    }

    start () {
        
    }

    private _moveNextFrame:boolean = false;
    private _moveNextFrame2:boolean = false;
    private doShow(){
        
        this.topNode.runAction(cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeOut(2)));
        this.panelNode.runAction(
            cc.sequence(
                cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeOut(2)),
                cc.callFunc(()=>{
                    EVENT.emit(GameEvent.Panel_Show_Effect_Complete)
                })
            ) )
        this._moveNextFrame = true;
    }

    private doHide(cb?:Function){
        this.topNode.runAction(cc.moveTo(0.3,cc.v2(750,0)).easing(cc.easeIn(2)));
        this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,-1100)).easing(cc.easeIn(2)))
                    
        var scene:CityScene = SCENE.CurScene as CityScene;
        if(scene){
            if(this._subPos){
                scene.moveSceneByPos(cc.v2(-this._subPos.x,-this._subPos.y),cb);
                this._subPos = null;
            }else{
                cb && cb();
            }
        }
    }

    private initBuildView(){
        this.buildName.string = this._buildInfo.level+" 级";// + "  " + CONSTANT.getBuidlingName(this._buildType);
        var str = CONSTANT.getBuildingBuffDesc(this._buildType);
        this.curLevelDesc.string = str.replace("#",(this._buildInfo.buildLevelCfg.addValue*100).toFixed(1));
        if(this._nextLevelCfg!=null){
            this.nextLevelDesc.string = str.replace("#",(this._nextLevelCfg.addValue*100).toFixed(1));
            this.upgradeBtn.node.active = true;
            this.costGold.string = StringUtil.formatReadableNumber(this._buildInfo.buildLevelCfg.upNeedGold);
        }else{
            this.nextLevelDesc.string ="(已满级)";
            this.upgradeBtn.node.active = false;
            this.costGold.string = ""
        }
    }

    private onUpdate(){
        console.log("click_end!!")
        var needGold:number = this._buildInfo.buildLevelCfg.upNeedGold;
        var needLevel:number = this._buildInfo.buildLevelCfg.upNeedPlayerLv;
        if(COMMON.resInfo.gold<needGold){
            ResPanel.show(ResPanelType.GoldNotEnough);
            return;
        }
        if(COMMON.userInfo.level<needLevel ){
            UI.showTip("不能超过角色等级!");
            return;
        }
        BUILD.updateBuild(this._buildType,needGold);
    }

    private onBuildUpdate(e){
        this.setData({buildType:this._buildType});
        this.initBuildView();
    }

    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_close"){
            if(this._enableGetGuideNode){
                return this.closeBtn.node;
            }else{
                return null;
            }
        }else{
            return this._buildUI.getGuideNode(name);
        }
    }

    private _enableGetGuideNode:boolean =true;
    public set enableGetGuideNode(val:boolean){
        this._enableGetGuideNode = val;
    }
    private onGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_close"){
            this.onClose();
            GUIDE.nextGuide(guideId);
        }

    }

    private _subPos:cc.Vec2 = null;
    update (dt) {
        //真你妈蛋疼，为了跟系统的winget不冲突
        if(this._moveNextFrame){
            this._moveNextFrame = false;
            this._moveNextFrame2 = true;
        }else{
            if(this._moveNextFrame2){
                this._moveNextFrame2 = false;
                
                var scene:CityScene = SCENE.CurScene as CityScene;
                if(scene){
                    var builidng:cc.Node = scene.getBuilding(this._buildType);
                    var fPos:cc.Vec2 = builidng.parent.convertToWorldSpaceAR(builidng.position);
                    var tPos:cc.Vec2 = this.buildIcon.parent.convertToWorldSpaceAR(this.buildIcon.position);
                    this._subPos = tPos.sub(fPos);
                    scene.moveSceneByPos(this._subPos,()=>{
                        scene.activeBuild = this;
                    });
                }
            }
        }
    }
}
