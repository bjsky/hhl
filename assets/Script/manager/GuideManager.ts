import GuideInfo from "../model/GuideInfo";
import GuideTapPanel from "../view/guide/GuideTapPanel";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { UI } from "./UIManager";
import UIBase from "../component/UIBase";
import MsgGuideUpdate, { SCGuideUpdate } from "../net/msg/MsgGuideUpdate";
import { NET } from "../net/core/NetController";
import CityScene from "../scene/CityScene";
import { SCENE } from "./SceneManager";
import GameEvent from "../message/GameEvent";
import { EVENT } from "../message/EventCenter";
import PathUtil from "../utils/PathUtil";
import { COMMON } from "../CommonData";
import { SGuideInfo } from "../net/msg/MsgLogin";
import { TaskType } from "../module/TaskAssist";
import { Battle } from "../module/battle/BattleAssist";

export enum GuideTypeEnum {
    GuideStory = 1,
    GuideTalk = 2,
    GuideArrow = 3,
    GuideDrag = 4,
    GuideNodeTalk = 5,
}

export enum GuideForceEnum{
    Force = 1,  //强引导
    Weak,   //若引导
}

export enum GuideNpcDir{
    NpcDirLeft = 1,
    NpcDirRight = 2
}

export enum GuideArrowDir{
    ArrowDirLeft = 1,
    ArrowDirRight
}

export default class GuideManager{
    private static _instance: GuideManager = null;
    public static getInstance(): GuideManager {
        if (GuideManager._instance == null) {
            GuideManager._instance = new GuideManager();
            
        }
        return GuideManager._instance;
    }

    //引导数据
    public guideInfo:GuideInfo;

    private guideTap:GuideTapPanel = null;

    public get isInGuide(){
        return this.guideInfo && this.guideInfo.guideId>0;
    }

    public initGuide(data:any,newUser:number){
        if(!this.guideInfo){
            this.guideInfo = new GuideInfo();
        }
        
        // this.guideInfo.initFromServer(data);
        if(COMMON.isNewUser){
            var temp:SGuideInfo = new SGuideInfo();
            temp.guideId = 2;
            this.guideInfo.initFromServer(temp);
        }
        this.initGuideMaskLayer();
    }

    public startGuide(){
        if(!this.isInGuide){
            this.endGuide();
            return;
        }
        this.showGuideMask();
        if(this.guideTap == null){
            UI.loadUI(ResConst.GuideTap,{},UI.PlotLayer,(res:UIBase)=>{
                this.guideTap = res as GuideTapPanel;
                this.guideTap.show(this.guideInfo);
            });
        }else{
            this.guideTap.show(this.guideInfo);
        }
    }


    public endStoryGuide(guideId:number){
        this._guideColorLayer.runAction(cc.sequence(cc.fadeOut(0.6),cc.callFunc(()=>{
            this.guideInfo.updateGuideClient(MsgGuideUpdate.getNextGuide(guideId));
            var scene:CityScene = SCENE.CurScene as CityScene;
            if(scene){
                scene.showMainUI();
            }
            NET.send(MsgGuideUpdate.create(guideId),(msg:MsgGuideUpdate)=>{
                if(msg && msg.resp){
                    // GUIDE.guideInfo.updateGuide(msg.resp);
                    // var scene:CityScene = SCENE.CurScene as CityScene;
                    // if(scene){
                    //     scene.showMainUI();
                    // }
                }
            },this)
        })));
    }


    public nextGuide(guideId:number){
        this.guideInfo.updateGuideClient(MsgGuideUpdate.getNextGuide(guideId));
        this.startGuide();
        NET.send(MsgGuideUpdate.create(guideId),(msg:MsgGuideUpdate)=>{
            if(msg && msg.resp){
                // this.guideInfo.updateGuide(msg.resp);
                // this.startGuide();
            }
        },this)
    
    }

    public endGuide(){
        this.hideGuideMask();
        this._guideBlockLayer.destroy();
        this._guideBlockLayer = null;
        this._guideMaskLayer.destroy();
        this._guideColorLayer = null;
        this._guideMaskLayer = null;
        UI.removeUI(this.guideTap.node);
        this.guideTap  = null;
        this.guideInfo = null;
        EVENT.emit(GameEvent.Guide_End,{});
    }
    
    /** 初始化GuideMaskLayer */

    /** 新手引导面板--遮罩节点 */
    private _guideMaskLayer: cc.Node = null;
    private _guideColorLayer: cc.Node = null;
    private _guideBlockLayer: cc.Node = null; 

    private initGuideMaskLayer() {
        if (this._guideMaskLayer != null) {
            return;
        }
        let blockLayer = new cc.Node();
        blockLayer.setAnchorPoint(0.5, 0.5);
        blockLayer.addComponent(cc.BlockInputEvents);
        blockLayer.setContentSize(cc.director.getWinSizeInPixels().width, cc.director.getWinSizeInPixels().height);
        blockLayer.parent = UI.PlotLayer;
        blockLayer.active = false;
        this._guideBlockLayer = blockLayer;

        this._guideMaskLayer = new cc.Node();
        this._guideMaskLayer.setAnchorPoint(cc.p(0.5,0.5));
        this._guideMaskLayer.setContentSize(cc.size(0,0));
        let mask = this._guideMaskLayer.addComponent(cc.Mask);
        mask.inverted = true;
        mask.type = 0;
        this._guideMaskLayer.parent = UI.PlotLayer;

        let colorLayer = new cc.Node();
        colorLayer.setAnchorPoint(0.5, 0.5);
        // colorLayer.addComponent(cc.BlockInputEvents);
        let sp = colorLayer.addComponent(cc.Sprite);
        cc.loader.loadRes(PathUtil.getMaskBgUrl(),cc.SpriteFrame,(error: Error, spr: cc.SpriteFrame) => {
            sp.spriteFrame = spr;
        })
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        colorLayer.opacity = 0;
        colorLayer.color = cc.color(0, 0, 0);
        colorLayer.zIndex = 0;
        colorLayer.setContentSize(cc.director.getWinSizeInPixels().width * 3, cc.director.getWinSizeInPixels().height* 3);
        colorLayer.parent = this._guideMaskLayer;
        this._guideColorLayer = colorLayer;

        this._guideMaskLayer.active = false;
    }
    public showGuideMask () {
        this._guideColorLayer.opacity = 0;
        this._guideMaskLayer.active = true;
        this._guideBlockLayer.active = true;
    }
    public hideGuideMask () {
        this._guideMaskLayer.active = false;
        this._guideBlockLayer.active = false;
        this._guideColorLayer.opacity = 0;
        this._guideMaskLayer.setContentSize(cc.size(0,0));
    }

    public updateGuideMaskPosAndSize (pos:cc.Vec2, size:cc.Size, arcPos:cc.Vec2 = cc.v2(0.5,0.5)
        , opacity:number = 200,isFullScr:boolean=false) {
        let localPos = this._guideMaskLayer.parent.convertToNodeSpaceAR(pos);
        this._guideMaskLayer.setPosition(localPos);
        this._guideMaskLayer.setContentSize(size);
        this._guideMaskLayer.setAnchorPoint(arcPos);
        this._guideColorLayer.opacity = opacity;
        if (isFullScr) {
            this._guideMaskLayer.setContentSize(cc.size(0,0));
            this._guideColorLayer.opacity = 0;
        }
    }
    public setBlockEnable(bool:boolean){
        this._guideBlockLayer.active = bool;
    }

    /////////////弱引导/////////////////
    private _currentWeakGuideId:number =0;
    private _currentWeakGuideInfo:GuideInfo = null;
    public startWeakGuide(guideId:number){
        this._currentWeakGuideId = guideId;
        if(!this.isInWeakGuide){
            this.endWeakGuide();
            return;
        }
        this._currentWeakGuideInfo = new GuideInfo();
        this._currentWeakGuideInfo.initFromWeak(this._currentWeakGuideId);
        if(this.checkGuideEnable(this._currentWeakGuideInfo)){
            if(this.guideTap == null){
                UI.loadUI(ResConst.GuideTap,{},UI.PlotLayer,(res:UIBase)=>{
                    this.guideTap = res as GuideTapPanel;
                    this.guideTap.showWeak(this._currentWeakGuideInfo);
                });
            }else{
                this.guideTap.showWeak(this._currentWeakGuideInfo);
            }
        }else{
            this.endWeakGuide();
        }
    }

    private checkGuideEnable(info:GuideInfo):boolean{
        if(info.guideName == "buildPanel_fightRevenge"){    //能够复仇
            return Battle.personalEnemyList.length>0 && Battle.battleInfo.revengeTime<=0;
        }else{
            return true;
        }
    }

    //是否在弱引导
    public get isInWeakGuide(){
        return this._currentWeakGuideId>0;
    }

    public endWeakGuide(){
        UI.removeUI(this.guideTap.node);
        this.guideTap  = null;
        this._currentWeakGuideInfo = null;
        this._currentWeakGuideId = 0;
        EVENT.emit(GameEvent.Guide_Weak_End,{});
    }

    public nextWeakGuide(guideId:number){
        this.startWeakGuide(MsgGuideUpdate.getNextGuide(guideId));
    }

}

export var GUIDE = GuideManager.getInstance();

