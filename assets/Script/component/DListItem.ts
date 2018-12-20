import UIBase from "./UIBase";
import DList from "./DList";
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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var handler = this.getComponent(TouchHandler);
        if(!handler){
            this.addComponent(TouchHandler);
        }
    }

    public showEffect(){
        // this.node.opacity = 255;
        if(this.isValid){
            this.node.setPosition(this.node.position.x+50,this.node.position.y);
            var delay:number = this.index *0.05;
            var fade =cc.sequence(
                cc.delayTime(delay),
                cc.spawn(
                    cc.moveBy(0.15,cc.v2(-50,0)),
                    cc.fadeIn(0.15),
                )
            )
            this.node.runAction(fade);
        }
    }

    public stopEffect(){
        this.node.stopAllActions();
    }

    onEnable(){
        this.node.on(TouchHandler.TOUCH_CLICK,this.onNodeTouch,this);
    }

    onDisable(){
        this.node.off(TouchHandler.TOUCH_CLICK,this.onNodeTouch,this);
    }

    private onNodeTouch(e){
        this.list.node.emit(DList.ITEM_CLICK,{index:this.index,data:this._data});
        if(this.index!=this.list.selectIndex){
            this.list.selectIndex = this.index;
            this.list.node.emit(DList.ITEM_SELECT_CHANGE,{index:this.index,data:this._data});
        }
    }
    start () {

    }

    // update (dt) {}
}
