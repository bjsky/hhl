import UIBase from "../component/UIBase";
import { UI } from "../manager/UIManager";
import ButtonEffect from "../component/ButtonEffect";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import CityScene from "../scene/CityScene";
import { SCENE } from "../manager/SceneManager";

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
    Temple = 0,
    Hero,
    Castle,
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
    leftNode: cc.Node = null;
    @property(cc.Node)
    buildIcon: cc.Node = null;
    @property(cc.Label)
    buildName: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:
    private _buildType:number = 0;
    private _buildUI:UIBase = null;
    
    public setData(param:any){
        this._buildType = param.buildType;

    }

    onLoad () {
        this.doHide(true);
        
    }

    public loadBuild(){
        var res:string = "";
        switch(this._buildType){
            case BuildType.Temple:
            res = ResConst.TempleBuild;
            break;
            default:
            res = ResConst.TempleBuild;
            break;
        }
        UI.loadUI(res,{},this.panelNode,this.loadComplete.bind(this));
    }

    private loadComplete(ui:UIBase){
        this._buildUI = ui;
        this.doShow(()=>{
            this.buildName.node.runAction(cc.fadeIn(0.1));
        });
    }

    onEnable(){
        this.closeBtn.node.on(ButtonEffect.CLICK_END,this.onClose,this);
        this.loadBuild();
    }
    onDisable(){
        this.closeBtn.node.off(ButtonEffect.CLICK_END,this.onClose,this);
    }

    private onClose(){
        this.doHide(false,()=>{
            if(this._buildUI!=null){
                UI.removeUI(this._buildUI.node);
                this._buildUI = null;
            }
            UI.closePopUp(this.node);
        })
    }

    start () {
        
    }

    private doShow(cb?:Function){
        
        this.topNode.runAction(cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeInOut(2)));
        this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeInOut(2)))
        
        var scene:CityScene = SCENE.CurScene as CityScene;
        if(scene){
            var wPos:cc.Vec2 = this.buildIcon.parent.convertToWorldSpaceAR(this.buildIcon.position);
            scene.moveCamToPos(wPos,this._buildType,0.3,cb);
        }
    }

    private doHide(noAction:boolean =false,cb?:Function){
        if(noAction){
            this.topNode.x = 750;
            this.panelNode.y = -1100;
        }else{
            this.topNode.runAction(cc.moveTo(0.3,cc.v2(750,0)).easing(cc.easeInOut(2)));
            this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,-1000)).easing(cc.easeInOut(2)))
            this.buildName.node.runAction(cc.fadeOut(0.1));
            var scene:CityScene = SCENE.CurScene as CityScene;
            if(scene){
                scene.moveCamBack(cb);
            }
        }
    }

    // update (dt) {}
}
