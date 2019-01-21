import LoadSprite from "../component/LoadSprite";
import PopUpBase from "../component/PopUpBase";
import { ResType } from "../model/ResInfo";
import { COMMON } from "../CommonData";
import StringUtil from "../utils/StringUtil";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";

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

export enum ResPanelType{
    GoldNotEnough = 1,    //金币不足
    StoneNotEnough,     //灵石不足
    GoldRes,            //金币
    StoneRes,           //灵石
}
@ccclass
export default class ResPanel extends PopUpBase {

    @property(cc.Label)
    msg: cc.Label = null;
    @property(cc.Label)
    award: cc.Label = null;
    @property(LoadSprite)
    awardIcon: LoadSprite = null;
    @property(cc.Button)
    videoBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _awardType:ResPanelType = 0;
    private _awardContent:string = "";
    public setData(data:any){
        super.setData(data);
        this._awardType = data.type;

    }

    onEnable(){
        super.onEnable();
        this.initView();
        this.videoBtn.node.on(cc.Node.EventType.TOUCH_START,this.onVideoSee,this);
    }

    onDisable(){
        super.onDisable();
        this.videoBtn.node.off(cc.Node.EventType.TOUCH_START,this.onVideoSee,this);
    }

    start () {

    }

    private initView(){
        if(this._awardType == ResPanelType.GoldRes){
            this.msg.string = "当前金币："+StringUtil.formatReadableNumber(COMMON.resInfo.gold);
        }else if(this._awardType == ResPanelType.StoneRes){
            this.msg.string = "当前灵石："+StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
        }else if(this._awardType == ResPanelType.GoldNotEnough){
            this.msg.string = "金币不足！";
        }else if(this._awardType == ResPanelType.StoneNotEnough){
            this.msg.string = "灵石不足！";
        }
    }

    private onVideoSee(){
        if(this._awardType == ResPanelType.GoldRes || this._awardType == ResPanelType.GoldNotEnough){

        }else if(this._awardType == ResPanelType.StoneRes || this._awardType == ResPanelType.StoneNotEnough){

        }
    }

    public static show(type:ResPanelType){
        UI.createPopUp(ResConst.resPanel,{type:type});
    }
    // update (dt) {}
}
