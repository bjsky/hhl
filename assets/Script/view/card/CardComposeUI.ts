import UIBase from "../../component/UIBase";
import CardInfo from "../../model/CardInfo";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import { Drag, CDragEvent } from "../../manager/DragManager";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";

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

@ccclass
export default class CardComposeUI extends UIBase {
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;
    @property(LoadSprite)
    cardFront: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public static dragName:string = "CardComposeDrag";
    start () {

    }
    private _info:CardInfo;
    private _data:CardComposeData;
    public setData(data:any){
        super.setData(data);
        this._data = data;
        this._info = data.info;
    }

    onEnable(){
        this.initView();
        Drag.addDragDrop(this.node);
        this.node.on(CDragEvent.DRAG_DROP,this.onDragDrop,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.onDragStart,this);
    }

    onDisable(){
        Drag.removeDragDrop(this.node);
        this.node.off(CDragEvent.DRAG_DROP,this.onDragDrop,this);
        this.node.off(cc.Node.EventType.TOUCH_START,this.onDragStart,this);
    }

    private initView(){
        this.cardSrc.load(PathUtil.getCardImgPath(this._info.cardInfoCfg.simgPath));
        this.cardStar.load(PathUtil.getCardGradeImgPath(this._info.grade));
        this.cardFront.load(PathUtil.getCardFrontImgPath(this._info.grade));
    }

    public updateView(data:CardComposeData,isCompose:boolean){
        this.setData(data);
        this.initView();
        if(isCompose){
            var seq = cc.sequence(
                cc.scaleTo(0.15,1.3).easing(cc.easeOut(2)),
                cc.scaleTo(0.15,1).easing(cc.easeIn(2))
            )
            this.node.runAction(seq);
        }
    }

    private onDragStart(e){
        Drag.startDrag(this.node,this._data, CardComposeUI.dragName);
    }

    private onDragDrop(e:CDragEvent){
        if(Drag.dragName == CardComposeUI.dragName){
            var data:CardComposeData  = Drag.dragData as CardComposeData;
            if(data.info!=this._info && data.info.grade == this._info.grade){
                EVENT.emit(GameEvent.Card_Drop_UpStar,{from:data,to:this._data});
            }
        }
    }
    // update (dt) {}
}

export class CardComposeData{
    constructor(info,index){
        this.info = info;
        this.index = index;
    }
    public info:CardInfo = null;
    public index:number = 0;
}
