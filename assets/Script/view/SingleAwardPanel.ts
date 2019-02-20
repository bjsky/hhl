import UIBase from "../component/UIBase";
import PopUpBase from "../component/PopUpBase";
import LoadSprite from "../component/LoadSprite";
import { ResType } from "../model/ResInfo";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import { GetRewardType } from "../net/msg/MsgGetReward";
import PathUtil from "../utils/PathUtil";

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
export default class SingleAwardPanel extends PopUpBase {

    @property(cc.Label)
    numLabel: cc.Label = null;
    @property(LoadSprite)
    resIcon: LoadSprite = null;
    @property(cc.Button)
    btnRecevie: cc.Button = null;


    // LIFE-CYCLE CALLBACKS:
    private _type:GetRewardType = 0;
    private _resType:ResType =0;
    private _num:number = 0;

    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        switch(this._type){
            case GetRewardType.ShareGetDiamond:
            this._resType = ResType.diamond;
            break;
            case GetRewardType.SeeVideoGetGold:
            this._resType = ResType.gold;
            break;
            case GetRewardType.SeeVideoGetStone:
            this._resType = ResType.lifeStone;
            break;
            default:
            this._resType = ResType.gold;
            break;
        }
        this._num = data.num;
    }

    onEnable(){
        super.onEnable();
        this.btnRecevie.node.on(cc.Node.EventType.TOUCH_START,this.onReceive,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnRecevie.node.off(cc.Node.EventType.TOUCH_START,this.onReceive,this);
    }
    // onLoad () {}

    start () {

    }

    private initView(){
        this.numLabel.string = "+" + this._num;
        this.resIcon.load(PathUtil.getResMutiIconUrl(this._resType));
    }

    private onReceive(){
        this.onClose(null);
        EVENT.emit(GameEvent.Show_Res_Add,{types:[{type:this._resType,value:this._num}]});
    }
    // update (dt) {}
}
