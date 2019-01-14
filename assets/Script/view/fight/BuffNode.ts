import LoadSprite from "../../component/LoadSprite";
import UIBase from "../../component/UIBase";
import { BuffType } from "../../module/fight/SkillLogic";
import PathUtil from "../../utils/PathUtil";
import { BuffAction } from "../../module/fight/FightAction";
import { UI } from "../../manager/UIManager";

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
export default class BuffNode extends UIBase {

    @property(LoadSprite)
    spr: LoadSprite= null;

    @property(cc.Label)
    sgin: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _type:BuffType = 0;
    private _sign:string = "";
    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        this._sign = data.sign;
    }

    private _fromPos :cc.Vec2 = null;
    private _toPos:cc.Vec2 = null;
    private _flyCb:Function = null;
    private _index:number = 0;
    private _flyDelay:number = 0.15;
    public showFly(index:number,formPos:cc.Vec2,toPos:cc.Vec2,cb:Function){
        this._index = index;
        this._fromPos = formPos;
        this._toPos = toPos;
        this._flyCb = cb;
        this.playShowFly();
    }

    onEnable(){
        this.spr.load(PathUtil.getBuffIconUrl(this._type));
        this.sgin.string = this._sign;
    }
    onDisable(){
        this.node.stopAllActions();
    }
    start () {

    }
    


    private playShowFly(){
        this.node.position = this._fromPos;
        var seq =cc.sequence(cc.delayTime(this._index * this._flyDelay),
            cc.moveTo(0.6,this._toPos).easing(cc.easeInOut(2)),
            cc.callFunc(()=>{
                UI.removeUI(this.node);
                this._flyCb && this._flyCb();
            })
        )
        this.node.runAction(seq);
    }
    // update (dt) {}
}
