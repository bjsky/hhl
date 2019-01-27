import GuideInfo from "../model/GuideInfo";
import GuideTapPanel from "../view/guide/GuideTapPanel";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { UI } from "./UIManager";
import UIBase from "../component/UIBase";
import MsgGuideUpdate from "../net/msg/MsgGuideUpdate";
import { NET } from "../net/core/NetController";
import CityScene from "../scene/CityScene";
import { SCENE } from "./SceneManager";
import GameEvent from "../message/GameEvent";
import { EVENT } from "../message/EventCenter";
import PathUtil from "../utils/PathUtil";

export enum GuideTypeEnum {
    GuideStory = 1,
    GuideTalk = 2,
    GuideArrow = 3,
    GuideDrag = 4
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
    public guideInfo:GuideInfo = new GuideInfo();

    private guideTap:GuideTapPanel = null;

    private _isINGuide:boolean = false;
    public get isInGuide(){
        return this._isINGuide;
    }
    public set isInGuide(bool:boolean){
        this._isINGuide = bool;
    }

    public initGuide(data:any){
        this.guideInfo.initFromServer(data);
        this.initGuideMaskLayer();
    }

    public startGuide(){
        if(!this._isINGuide){
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
            NET.send(MsgGuideUpdate.create(guideId),(msg:MsgGuideUpdate)=>{
                if(msg && msg.resp){
                    GUIDE.guideInfo.updateGuide(msg.resp);
                    var scene:CityScene = SCENE.CurScene as CityScene;
                    if(scene){
                        scene.showMainUI();
                    }
                }
            },this)
        })));
    }


    public nextGuide(guideId:number){
        NET.send(MsgGuideUpdate.create(guideId),(msg:MsgGuideUpdate)=>{
            if(msg && msg.resp){
                this.guideInfo.updateGuide(msg.resp);
                this.startGuide();
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
        this.isInGuide = false;
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
        // sp.spriteFrame = new cc.SpriteFrame('res/raw-internal/image/default_sprite_splash.png');
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
}

export var GUIDE = GuideManager.getInstance();

