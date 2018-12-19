import UIBase from "./UIBase";

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
    public static ITEM_CLICK:string = "ITEM_CLICK";
    private _select:boolean = false;
    public set select(val){
        this._select = val;
    }
    public get select(){
        return this._select;
    }

    public index:number = -1;

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // onEnable(){
        
    // }

    public showEffect(){
        this.node.opacity = 0;
        this.node.setPosition(cc.v2(this.node.position.x+50,this.node.position.y));
        // this.node.position = cc.v2(0,50);
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

    onDisable(){

    }

    start () {

    }

    // update (dt) {}
}
