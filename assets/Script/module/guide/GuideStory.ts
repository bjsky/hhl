import { UI } from "../../manager/UIManager";
import GuideInfo from "../../model/GuideInfo";
import TextAni from "../../component/TextAni";
import { NET } from "../../net/core/NetController";
import MsgGuideUpdate from "../../net/msg/MsgGuideUpdate";
import { GUIDE } from "./GuideManager";
import MessageBase from "../../net/msg/MessageBase";

export default class GuideStory{
    
    private _storyMask:cc.Node = null;
    private _storyTextNode:cc.Node = null;
    private _storyText:cc.RichText = null;
    private _storyTextAni:TextAni = null;

    private _guideId:number =0;

    private initStoryMask(){
        this._storyMask = new cc.Node();
        this._storyMask.setAnchorPoint(0.5, 0.5);
        this._storyMask.addComponent(cc.BlockInputEvents);
        let sp = this._storyMask.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame('res/raw-internal/image/default_sprite_splash.png');
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this._storyMask.opacity = 255;
        this._storyMask.color = cc.color(0, 0, 0);
        this._storyMask.zIndex = 0;
        this._storyMask.setContentSize(cc.winSize.width, cc.winSize.height);
        this._storyMask.parent = UI.PlotLayer;
        // this._storyMask.active = false;

        this._storyTextNode = new cc.Node();
        this._storyTextNode.parent = this._storyMask;
        this._storyTextNode.anchorY = 0;
        this._storyTextNode.y = 100-cc.winSize.height/2;

        this._storyText = this._storyTextNode.addComponent(cc.RichText);
        this._storyText.fontSize = 40;
        this._storyText.maxWidth = 600;
        this._storyText.lineHeight = 50;
        this._storyText.string = "";

        this._storyTextAni = this._storyTextNode.addComponent(TextAni);
        this._storyTextAni.htmltext = this._storyText;
    }

    public show(guide:GuideInfo){
        if(this._storyMask == null){
            this.initStoryMask();
        }

        this._guideId = guide.guideId;
        this._storyMask.off(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);
        this._storyTextAni.addTypewriterAni(guide.content,this.complete.bind(this),"#FFFFFF");
    }

    private complete(){

        this._storyMask.on(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);
    }

    private onMaskClick(e){
        this._storyTextAni.removeTypewriterAni();
        NET.send(MsgGuideUpdate.createLocal(this._guideId),(msg:MsgGuideUpdate)=>{
            if(msg && msg.resp){
                GUIDE.guideInfo.updateGuide(msg.resp);
                GUIDE.nextGuide();
            }
        },this)
    }
}