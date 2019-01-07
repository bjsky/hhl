import UIBase from "./UIBase";
import DList, { DListDirection } from "./DList";
import TouchHandler from "./TouchHandler";

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
export default class DListItem extends UIBase {


    private _select:boolean = false;
    public set select(val){
        this._select = val;
        this.setSelect(this._select);
    }
    public get select(){
        return this._select;
    }
    public list :DList = null;
    public index:number = -1;

    protected _data:any = null;
    public setData(data:any){
        super.setData(data);
        this._data = data;
    }

    public getData(){
        return this._data;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var handler = this.getComponent(TouchHandler);
        if(!handler){
            this.addComponent(TouchHandler);
        }
    }
    protected setSelect(select:boolean){

    }

    public showEffect(toPos:cc.Vec2,reset:boolean = false){
        // this.node.opacity = 255;
        if(this.isValid){
            var delay:number = this.index *0.05;
            var noResetFade =cc.sequence(
                cc.delayTime(delay),
                cc.moveTo(0.15,toPos),
            )
            var restFade = cc.sequence(
                cc.delayTime(delay),
                cc.spawn(
                    cc.moveTo(0.15,toPos),
                    cc.fadeIn(0.15),
                )
            )
            this.node.runAction(reset?restFade:noResetFade);
        }
    }

    public stopEffect(){
        this.node.stopAllActions();
    }

    private _listenDragEvent:boolean  = false;
    onEnable(){
        this.node.on(TouchHandler.TOUCH_CLICK,this.onNodeTouch,this);
        if(this.list && this.list.enableDrag){
            this._listenDragEvent = true;
            this.node.on(TouchHandler.DRAG_START,this.onDragStart,this);
            this.node.on(TouchHandler.DRAG_MOVE,this.onDragMove,this);
            this.node.on(TouchHandler.DRAG_END,this.onDragEnd,this);
        }

    }

    onDisable(){
        this.node.off(TouchHandler.TOUCH_CLICK,this.onNodeTouch,this);
        if(this._listenDragEvent){
            this._listenDragEvent = false;
            this.node.off(TouchHandler.DRAG_START,this.onDragStart,this);
            this.node.off(TouchHandler.DRAG_MOVE,this.onDragMove,this);
            this.node.off(TouchHandler.DRAG_END,this.onDragEnd,this);
        }
    }

    private onNodeTouch(e){
        this.list.node.emit(DList.ITEM_CLICK,{index:this.index,data:this._data});
        if(this.index!=this.list.selectIndex){
            this.list.selectIndex = this.index;
            this.list.node.emit(DList.ITEM_SELECT_CHANGE,{index:this.index,data:this._data});
        }
    }

    private _isDrag:boolean = false;
    private onDragStart(e){
        var dragAngle = (e.detail as TouchHandler).dragStartAngle;
        if(this.list.enableDragDirection == DListDirection.Horizontal && dragAngle<45 
            ||this.list.enableDragDirection == DListDirection.Vertical && dragAngle>45){
            console.log("dragStart____",dragAngle)
            this._isDrag = true;
            this.list.scrollView.horizontal = false;
        }
    }

    private onDragMove(e){
        if(this._isDrag){
            console.log("dragMove____")
        }
    }
    private onDragEnd(e){
        if(this._isDrag){
            console.log("dragEnd____")
            this._isDrag = false;
            this.list.scrollView.horizontal = true;
        }
    }
    //更新的处理
    onUpdate(completeCB?:Function){

    }

    //移除的处理
    onRemove(completeCB?:Function){

    }
    start () {

    }

    // update (dt) {}
}
