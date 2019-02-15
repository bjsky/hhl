import UIBase from "../../component/UIBase";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import LineupInfo from "../../model/LineupInfo";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";

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
export default class CardHead extends UIBase {

    @property(LoadSprite)
    head: LoadSprite = null;
    @property(LoadSprite)
    star: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.star.load("");
        this.head.load("");
    }

    private _lineup:LineupInfo = null
    private _edit:boolean = false;
    public setData(data:any){
        super.setData(data);
        this._lineup = data.lineup as LineupInfo;
        this._edit = data.edit;
    }

    start () {

    }

    onEnable(){
        if(!this._edit){
            this.node.on(cc.Node.EventType.TOUCH_START,this.onTipShow,this);
            this.node.on(cc.Node.EventType.TOUCH_END,this.onTipHide,this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTipHide,this);
        }
        this.star.load(PathUtil.getCardHeadGradeImgPath(this._lineup.grade));
        this.head.load(PathUtil.getCardHeadUrl(this._lineup.headUrl));
    }

    // public updatePower(power){
    //     this._power = power;
    //     this.power.string = this._power.toString();
    // }

    onDisable(){
        if(!this._edit){
            this.node.off(cc.Node.EventType.TOUCH_START,this.onTipShow,this);
            this.node.off(cc.Node.EventType.TOUCH_END,this.onTipHide,this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTipHide,this);
        }

        this.star.load("");
        this.head.load("");
    }

    private onTipShow(e){
        UI.showDetailTip(ResConst.CardHeadTip,{lineup:this._lineup,target:this.node});
    }
    private onTipHide(e){
        UI.hideDetailTip();
    }

    // update (dt) {}
}