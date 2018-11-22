import GuideInfo from "../../model/GuideInfo";
import TextAni from "../../component/TextAni";
import { GUIDE } from "./GuideManager";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";

export default class GuideStory extends cc.Component{
    
    private _storyTextNode:cc.Node = null;
    private _storyText:cc.RichText = null;
    private _storyTextAni:TextAni = null;

    private _guideId:number =0;
    private _guideInfo:GuideInfo = null;

    private _loaded:boolean = false;
    onLoad(){
        this._storyTextNode = new cc.Node();
        this._storyTextNode.parent = this.node;
        this._storyTextNode.anchorY = 0;
        this._storyTextNode.y = 100-cc.winSize.height/2;

        this._storyText = this._storyTextNode.addComponent(cc.RichText);
        this._storyText.fontSize = 40;
        this._storyText.maxWidth = 600;
        this._storyText.lineHeight = 50;
        this._storyText.string = "";

        this._storyTextAni = this._storyTextNode.addComponent(TextAni);
        this._storyTextAni.htmltext = this._storyText;

        this._loaded = true;
        if(this._guideInfo!=null){
            this.show(this._guideInfo);
        }

    }
    public show(guide:GuideInfo){

        this._guideId = guide.guideId;
        this._guideInfo = guide;
        
        if(this._loaded){
            this.showContent(guide.content);
        }
    }

    private showContent(content:string){
        this._storyTextAni.addTypewriterAni(content,this.complete.bind(this),"#FFFFFF");
    }

    private complete(){
        this._storyText.scheduleOnce(this.onMaskClick.bind(this),5);
        EVENT.on(GameEvent.Guide_Mask_Touch,this.onMaskClick,this);
    }

    private onMaskClick(e){
        EVENT.off(GameEvent.Guide_Mask_Touch,this.onMaskClick,this);
        this._storyText.unscheduleAllCallbacks();
        this._storyTextAni.removeTypewriterAni();

        if(this._guideInfo.params && Boolean(this._guideInfo.params.hideMask) == true){
            GUIDE.removeStoryGuide(this._guideId);
        }else{
            GUIDE.nextGuide(this._guideId);
        }
        
    }
}