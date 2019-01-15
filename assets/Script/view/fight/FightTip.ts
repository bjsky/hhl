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

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightTip extends TipBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    bgNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _str:string;
    public setData(data:any){
        super.setData(data);
        this._str = data.data;
    }

    onEnable(){
        super.onEnable();
        this.label.string = this._str;
        this.bgNode.active = false;
        this.bgNode.width = this.label.node.width + 100;
    }
    start () {

    }

    // update (dt) {}
}
