import GuideInfo from "../../model/GuideInfo";
import { GuideArrowDir } from "./GuideManager";

export default class GuideArrow extends cc.Component{

    private _guideArrowNode:cc.Node = null;
    private _guideArrow:cc.Sprite = null;

    private _guideId:number =0;
    private _guideInfo:GuideInfo = null;

    private _loaded:boolean = false;

    onLoad(){


    }
    public show(guide:GuideInfo){
        this._guideId = guide.guideId;
        this._guideInfo = guide;
        
        if(this._loaded){
            this.showArrow();
        }
    }

    private showArrow(){
        this._guideArrowNode = new cc.Node();
        this._guideArrowNode.parent = this.node;
        this._guideArrow = this._guideArrowNode.addComponent(cc.Sprite);
        if(this._guideInfo.arrowDir == GuideArrowDir.ArrowDirDown 
            || this._guideInfo.arrowDir == GuideArrowDir.ArrowDirRight
            || this._guideInfo.arrowDir == GuideArrowDir.ArrowDirLeft){
                
            }
    }
}