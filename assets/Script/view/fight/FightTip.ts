import TipBase from "../../component/TipBase";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum FightTipType{
    BeAttack = 1,
    ReturnBlood,
}

const {ccclass, property} = cc._decorator;


@ccclass
export default class FightTip extends TipBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Label)
    labelGreen: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _type:FightTipType = 0;
    private _str:string;
    public setData(data:any){
        super.setData(data);
        this._type = data.data.type;
        this._str = data.data.str;
    }

    onEnable(){
        super.onEnable();
        if(this._type == FightTipType.BeAttack){
            this.label.node.active = true;
            this.labelGreen.node.active = false;
            this.label.string = this._str;
        }else if(this._type == FightTipType.ReturnBlood){
            this.label.node.active = false;
            this.labelGreen.node.active = true;
            this.labelGreen.string = this._str;
        }
        this.bgNode.active = false;
        this.bgNode.width = this.label.node.width + 100;
    }
    start () {

    }

    // update (dt) {}
}
