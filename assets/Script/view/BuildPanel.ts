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
    Castle = 0,
    Temple,
    Hero,
    Battle
}

@ccclass
export default class BuildPanel extends UIBase{

    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Sprite)
    bgSpr: cc.Sprite = null;
    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.Node)
    panelNode: cc.Node = null;
    @property(cc.Node)
    panelNodeload: cc.Node = null;
    @property(cc.Node)
    leftNode: cc.Node = null;
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
        if((this._buildInfo.level+1)>30){
            this._nextLevelCfg = null;
        }else{
            this._nextLevelCfg = CFG.getCfgByKey(ConfigConst.Building,"level",(this._buildInfo.level+1))[0];
        }

    }

    onLoad () {
        this.doHide(true);
        
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
            default:
            res = ResConst.TemplePanel;
            break;
        }
        UI.loadUI(res,{type:this._buildType},this.panelNodeload,this.loadComplete.bind(this));

        this.initBuildView();
    }

    private loadComplete(ui:UIBase){
        this._buildUI = ui;
        this.doShow(()=>{
            // this.buildName.node.runAction(cc.fadeIn(0.1));
            var scene:CityScene = SCENE.CurScene as CityScene;
            scene.activeBuild = this;
        });
    }

    onEnable(){
        this.closeBtn.node.on(ButtonEffect.CLICK_END,this.onClose,this);
        this.upgradeBtn.node.on(ButtonEffect.CLICK_END,this.onUpdate,this);
        
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);

        this.loadBuild();
    }
    onDisable(){
        this.closeBtn.node.off(ButtonEffect.CLICK_END,this.onClose,this);
        this.upgradeBtn.node.off(ButtonEffect.CLICK_END,this.onUpdate,this)

        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
    }

    public closeUI(cb:Function){
        this.doClose(cb);
    }
    private onClose(){
        this.doClose();
    }

    private doClose(cb?:Function){
        this.doHide(false,()=>{
            if(this._buildUI!=null){
                UI.removeUI(this._buildUI.node);
                this._buildUI = null;
            }
            UI.closePopUp(this.node);
            var scene:CityScene = SCENE.CurScene as CityScene;
            scene.activeBuild = null;
            cb && cb();
        })
    }

    start () {
        
    }

    private doShow(cb?:Function){
        
        this.topNode.runAction(cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeInOut(2)));
        this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeInOut(2)))
        
        var scene:CityScene = SCENE.CurScene as CityScene;
        if(scene){
            var builidng:cc.Node = scene.getBuilding(this._buildType);
            var fPos:cc.Vec2 = builidng.parent.convertToWorldSpaceAR(builidng.position);
            var tPos:cc.Vec2 = this.buildIcon.parent.convertToWorldSpaceAR(this.buildIcon.position);
            
            scene.moveCamToPos(fPos,tPos,0.3,1,cb);
        }
    }

    private doHide(noAction:boolean =false,cb?:Function){
        if(noAction){
            this.topNode.x = 750;
            this.panelNode.y = -1100;
        }else{
            this.topNode.runAction(cc.moveTo(0.3,cc.v2(750,0)).easing(cc.easeInOut(2)));
            this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,-1000)).easing(cc.easeInOut(2)))
            // this.buildName.node.runAction(cc.fadeOut(0.1));
            var scene:CityScene = SCENE.CurScene as CityScene;
            if(scene){
                scene.moveCamBack(cb);
            }
        }
    }

    private initBuildView(){
        this.buildName.string = this._buildInfo.level+" 级";// + "  " + CONSTANT.getBuidlingName(this._buildType);
        var str = CONSTANT.getBuildingBuffDesc(this._buildType);
        this.curLevelDesc.string = "当前等级：" + str.replace("#",(this._buildInfo.buildLevelCfg.addValue*100).toFixed(0));
        if(this._nextLevelCfg!=null){
            this.nextLevelDesc.string = "下一等级：" + str.replace("#",(this._nextLevelCfg.addValue*100).toFixed(0));
            this.upgradeBtn.node.active = true;
            this.costGold.string = StringUtil.formatReadableNumber(this._buildInfo.buildLevelCfg.upNeedGold);
        }else{
            this.nextLevelDesc.string ="下一等级：(已满级)";
            this.upgradeBtn.node.active = false;
            this.costGold.string = ""
        }
    }

    private onUpdate(){
        console.log("click_end!!")
        var needGold:number = this._buildInfo.buildLevelCfg.upNeedGold;
        var needLevel:number = this._buildInfo.buildLevelCfg.upNeedPlayerLv;
        if(COMMON.resInfo.gold<needGold){
            UI.showTip("资源不足!");
            return;
        }
        if(COMMON.userInfo.level<needLevel ){
            UI.showTip("角色等级不足!");
            return;
        }
        BUILD.updateBuild(this._buildType,needGold);
    }

    private onBuildUpdate(e){
        this.setData({buildType:this._buildType});
        this.initBuildView();
    }

    // update (dt) {}
}
