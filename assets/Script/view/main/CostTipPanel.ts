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
export default class CostTipPanel extends TipBase {


    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    label:cc.Label = null;

    // onLoad () {}
    private _content:string ="";
    public setData(data){
        super.setData(data);
        this._content = data.data as string;
    }
    onEnable(){
        super.onEnable();
        this.initView();
    }

    private initView(){
        this.label.string = this._content;
            
    }
    start () {

    }

    // update (dt) {}
}
