import UIBase from "./UIBase";
import { UI } from "../manager/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TipBase extends UIBase{
    @property()
    flyX:number = 0;
    @property()
    flyY:number = 0;
    @property()
    during:number = 0.6;

    private _pos:cc.Vec2 = cc.v2(0,0);
    private _complete:Function = null;
    public setData(data:any){
        super.setData(data);
        if(data.pos!=undefined && data.pos!=null){
            this._pos = data.pos;
        }
        if(data.complete != undefined&& data.complete!=null){
            this._complete = data.complete;
        }
    }

    onEnable(){
            
        this.node.position = UI.TipLayer.convertToNodeSpaceAR(this._pos);

        var moveBy:cc.Vec2 = cc.v2(this.flyX,this.flyY);
        this.node.runAction(
            cc.sequence(
                    cc.moveBy(this.during,moveBy).easing(cc.easeOut(1.5)),
                cc.callFunc(
                    ()=>{
                        UI.removeUI(this.node);
                        this._complete && this._complete();
                    }
                )
            )
        )
    }
}