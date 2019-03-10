import PopUpBase from "../component/PopUpBase";
import SevendayItem from "./SevendayItem";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { CONSTANT } from "../Constant";
import { Activity } from "../module/ActivityAssist";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";
import LoadSprite from "../component/LoadSprite";
import PathUtil from "../utils/PathUtil";
import { Share } from "../module/share/ShareAssist";
import { ResType } from "../model/ResInfo";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

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
export default class SevenDayPanel extends PopUpBase {

    @property([cc.Node])
    nodeDays: cc.Node[]= [];
    @property(cc.Button)
    btnLinqu: cc.Button= null;
    @property(cc.Sprite)
    lblTodayReceived:cc.Sprite= null;
    @property(cc.Sprite)
    doubleIcon:cc.Sprite= null;
    @property(cc.Node)
    doubleNode:cc.Node= null;
    

    // LIFE-CYCLE CALLBACKS:

    private _items:SevendayItem[] = [];
    onLoad () {
        
    }

    onEnable(){
        super.onEnable();
        this.btnLinqu.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        EVENT.on(GameEvent.SevendayReceived,this.onReceived,this);
        this.doubleNode.on(cc.Node.EventType.TOUCH_START,this.onDoubleTouch,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnLinqu.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        EVENT.off(GameEvent.SevendayReceived,this.onReceived,this);
        this.doubleNode.off(cc.Node.EventType.TOUCH_START,this.onDoubleTouch,this);
    }

    private initView(){
        this._items =[];
        for(var i:number = 0;i<7;i++){
            var node:cc.Node = this.nodeDays[i];
            if(node.childrenCount>0){
                UI.removeUI(node.children[0]);
            }
            
            UI.loadUI(ResConst.SevendayItem,{index:i},node,(ui:SevendayItem)=>{
                this._items.push(ui);
            });
        }
        this.btnShow();
    }

    private btnShow(){
        this.btnLinqu.node.active = !Activity.senvendayTodayReward.isReceived;
        this.lblTodayReceived.node.active = Activity.senvendayTodayReward.isReceived;
        if(!Activity.senvendayTodayReward.isReceived){
            var nodeDayRewardResType:ResType = CFG.getCfgDataById(ConfigConst.Reward,(Activity.senvendayTodayReward.rewardId)).resType;
            if(nodeDayRewardResType!=ResType.card){
                this.doubleNode.active = true;
                this.setDoubleSelect(this._doubleSelect);
            }else{
                this.doubleNode.active = false;
            }
        }else{
            this.doubleNode.active = false;
        }
    }

    private onTouchStart(e){
        if(this._doubleSelect){
            Share.shareAppMessage(()=>{
                Activity.receiveSevenday(Activity.senvendayIndex,true);
            },()=>{
                Activity.receiveSevenday(Activity.senvendayIndex,false);
            });
        }else{
            Activity.receiveSevenday(Activity.senvendayIndex,false);
        }
        this.onClose(null);
    }

    private onReceived(e){
        var index:number = e.detail.index;
        this._items[index].recevied();
        this.btnShow();
    }
    start () {

    }

    private _doubleSelect:boolean =true;
    private setDoubleSelect(select:boolean){
        this._doubleSelect = select;
        this.doubleIcon.node.active = select;
    }

    private onDoubleTouch(e){
        this.setDoubleSelect(!this._doubleSelect);
    }

    // update (dt) {}
}
