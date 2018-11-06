import UIBase from "../component/UIBase";
import { UI } from "../manager/UIManager";
import ButtonEffect from "../component/ButtonEffect";
import { ResConst } from "../module/loading/steps/LoadingStepRes";

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
            console.log("!!")
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
        
        this.topNode.runAction(cc.moveTo(0.3,cc.v2(0,10)).easing(cc.easeInOut(2)));
        this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,0)).easing(cc.easeInOut(2)))
        if(cb!=undefined)
            this.scheduleOnce(cb,0.3);
    }

    private doHide(noAction:boolean =false,cb?:Function){
        if(noAction){
            this.topNode.x = 750;
            this.panelNode.y = -1100;
        }else{
            this.topNode.runAction(cc.moveTo(0.3,cc.v2(750,10)).easing(cc.easeInOut(2)));
            this.panelNode.runAction(cc.moveTo(0.3,cc.v2(0,-1100)).easing(cc.easeInOut(2)))
            if(cb!=undefined)
                this.scheduleOnce(cb,0.3);
        }
    }

    // update (dt) {}
}
