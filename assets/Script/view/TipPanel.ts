import UIBase from "../component/UIBase";
import { DirectionEnum, COMMON } from "../CommonData";
import { UI } from "../manager/UIManager";

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

export enum TipTypeEnum{
    Normal = 0, //正常
    ResCost,    //资源消耗
}

@ccclass
export default class TipPanel extends UIBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null;
    @property(cc.Node)
    bgNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // super.onLoad();
        
        
    }

    private _content:string ="";
    private _pos:cc.Vec2 = null;
    private _type:TipTypeEnum = 0;
    public setData(data:any){
        this._content = data.content;
        if(data.position!=undefined){
            this._pos = data.position;
        }
        this._type = data.type;
        // super.setData(data);
    }

    onEnable(){
        this.initView();
        this.moveEffect();
    }

    private initView(){
        if(this._type == TipTypeEnum.ResCost){
            this.label2.node.active = true;
            this.label2.string = this._content;
            this.bgNode.active = false;
            this.label.node.active = false;
            
            this.node.position = UI.TipLayer.convertToNodeSpaceAR(this._pos);
        }else{
            this.label.node.active = true;
            this.label.string = this._content;
            this.label2.node.active = false;
            this.bgNode.active = true;
            this.bgNode.width = this.label.node.width + 100;

            this.node.position = COMMON.ZERO;
        }

        this.node.opacity = 255;
    }

    private moveEffect(){
        var moveByPos:cc.Vec2 = new cc.Vec2(0,0);
        if(this._type == TipTypeEnum.Normal){
            moveByPos = new cc.Vec2(0,80);
        }else if(this._type == TipTypeEnum.ResCost){
            moveByPos = new cc.Vec2(0,-50);
        }
        this.node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.moveBy(0.8,moveByPos),
                    cc.sequence(
                        cc.delayTime(0.5),
                        cc.fadeOut(0.3).easing(cc.fadeOut(2))
                    )
                ),cc.callFunc(
                    ()=>{
                        UI.removeUI(this.node);
                    }
                )
            )
        )
    }
    start () {
        
    }

    // update (dt) {}
}
