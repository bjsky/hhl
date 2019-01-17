import PopUpBase from "../component/PopUpBase";
import { UI } from "../manager/UIManager";
import TouchHandler from "../component/TouchHandler";
import FlowGroup from "../component/FlowGroup";
import { COMMON } from "../CommonData";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export enum AwardTypeEnum{
    CardDestroyAward = 1,
    PassageCollect,
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class AwardPanel extends PopUpBase {

    @property(cc.Label)
    lblDesc: cc.Label = null;

    @property(cc.Node)
    btnShouqu: cc.Node = null;

    @property(FlowGroup)
    awardGroup:FlowGroup = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    public onClose(e){
        var seq = cc.sequence(
            cc.moveBy(0.3,cc.v2(0,500)).easing(cc.easeBackIn()),
            cc.callFunc(()=>{
                this.node.position = COMMON.ZERO;
                UI.closePopUp(this.node);
            })
        )
        this.node.runAction(seq)
    }

    onEnable(){
        super.onEnable();
        this.btnShouqu.on(TouchHandler.TOUCH_CLICK,this.onShouquTouch,this);

        this.showAward();
    }

    onDisable(){
        super.onDisable();
        this.btnShouqu.off(TouchHandler.TOUCH_CLICK,this.onShouquTouch,this);
        this.removeAward();
    }

    private _type:AwardTypeEnum = 0;
    private _resArr:Array<any> =[];
    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        this._resArr = data.arr;
    }
    start () {

    }

    private showAward(){
        if(this._type == AwardTypeEnum.CardDestroyAward){
            this.lblDesc.string ="回收获得："
        }else if(this._type == AwardTypeEnum.PassageCollect){
            this.lblDesc.string = "挂机获得：";
        }
        this.awardGroup.setGroupData(this._resArr);
    }

    private removeAward(){
        this.awardGroup.setGroupData([]);
    }

    private onShouquTouch(e){
        EVENT.emit(GameEvent.Show_Res_Add,{types:this._resArr});
        this.onClose(e);
    }
    // update (dt) {}
}
