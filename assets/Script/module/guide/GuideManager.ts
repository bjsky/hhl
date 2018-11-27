import GuideInfo from "../../model/GuideInfo";
import { UI } from "../../manager/UIManager";
import GuideStory from "./GuideStory";
import GuideTalkPanel from "../../view/guide/GuideTalkPanel";
import { ResConst } from "../loading/steps/LoadingStepRes";
import UIBase from "../../component/UIBase";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { NET } from "../../net/core/NetController";
import MsgGuideUpdate from "../../net/msg/MsgGuideUpdate";
import CityScene from "../../scene/CityScene";
import { SCENE } from "../../manager/SceneManager";
import GuideArrow from "./GuideArrow";

export enum GuideTypeEnum {
    GuideStory = 1,
    GuideTalk = 2,
    GuideArrow = 3

}

export enum GuideNpcDir{
    NpcDirLeft = 1,
    NpcDirRight = 2
}

export enum GuideArrowDir{
    ArrowDirDown = 1,
    ArrowDirRight = 2,
    ArrowDirLeft = 3
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
    
    private guideStory:GuideStory = null;
    private guideStoryNode:cc.Node = null;

    private guideTalk:GuideTalkPanel = null;

    private guideArrowNode:cc.Node = null;
    private guideArrow:GuideArrow = null;

    private _isINGuide:boolean = false;
    public get isInGuide(){
        return this._isINGuide;
    }
    public set isInGuide(bool:boolean){
        this._isINGuide = bool;
    }

    public initGuide(data:any){
        this.guideInfo.initFromServer(data);
    }

    public startGuide(){
        if(this._guideMask == null){
            this.initGuideMask();
        }
        if(this.guideInfo.type == GuideTypeEnum.GuideStory){
            this._guideMask.opacity = 255;
            if(this.guideStoryNode == null){
                this.guideStoryNode = new cc.Node();
                this.guideStoryNode.parent = this._guideMask;
                this.guideStory = this.guideStoryNode.addComponent(GuideStory);
            }
            this.guideStory.show(this.guideInfo);
        }else if(this.guideInfo.type == GuideTypeEnum.GuideTalk){
            this._guideMask.opacity = 0;
            if(this.guideTalk == null){
                UI.loadUI(ResConst.GuideTalk,{},UI.PlotLayer,(res:UIBase)=>{
                    this.guideTalk = res as GuideTalkPanel;
                    this.guideTalk.show(this.guideInfo);
                });
            }else{
                this.guideTalk.show(this.guideInfo);
            }
        }else if(this.guideInfo.type == GuideTypeEnum.GuideArrow){
            if(this.guideArrowNode == null){
                this.guideArrowNode = new cc.Node();
                this.guideArrowNode.parent = UI.PlotLayer;
                this.guideArrow = this.guideArrowNode.addComponent(GuideArrow);
            }
            this.guideArrow.show(this.guideInfo);
        }
    }

    private showNodeMask(nodeName:string){

    }


    public removeStoryGuide(guideId:number){
        this._guideMask.runAction(cc.sequence(cc.fadeOut(0.6),cc.callFunc(()=>{
            this.guideStoryNode.destroy();
            this.guideStoryNode = null;
            NET.send(MsgGuideUpdate.createLocal(guideId),(msg:MsgGuideUpdate)=>{
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
        NET.send(MsgGuideUpdate.createLocal(guideId),(msg:MsgGuideUpdate)=>{
            if(msg && msg.resp){
                this.guideInfo.updateGuide(msg.resp);
                this.startGuide();
            }
        },this)
    
    }


    private _guideMask:cc.Node = null;
    private initGuideMask(){
        this._guideMask = new cc.Node();
        this._guideMask.setAnchorPoint(0.5, 0.5);
        this._guideMask.addComponent(cc.BlockInputEvents);
        let sp = this._guideMask.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame('res/raw-internal/image/default_sprite_splash.png');
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this._guideMask.opacity = 255;
        this._guideMask.color = cc.color(0, 0, 0);
        this._guideMask.zIndex = 0;
        this._guideMask.setContentSize(cc.winSize.width, cc.winSize.height);
        this._guideMask.parent = UI.PlotLayer;
        // this._guideMask.active = false;
        this._guideMask.on(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);

    }

    private onMaskClick(e){
        EVENT.emit(GameEvent.Guide_Mask_Touch);
    }
}

export var GUIDE = GuideManager.getInstance();

