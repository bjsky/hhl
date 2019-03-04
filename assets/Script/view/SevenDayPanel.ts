import PopUpBase from "../component/PopUpBase";
import SevendayItem from "./SevendayItem";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { CONSTANT } from "../Constant";
import { Activity } from "../module/ActivityAssist";
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

const {ccclass, property} = cc._decorator;

@ccclass
export default class SevenDayPanel extends PopUpBase {

    @property([cc.Node])
    nodeDays: cc.Node[]= [];
    @property([cc.Button])
    btnLinqu: cc.Button= null;
    @property([cc.Label])
    lblTodayReceived:cc.Label= null;
    

    // LIFE-CYCLE CALLBACKS:

    private _items:SevendayItem[] = [];
    onLoad () {
        
    }

    onEnable(){
        super.onEnable();
        this.btnLinqu.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        EVENT.on(GameEvent.SevendayReceived,this.onReceived,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnLinqu.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        EVENT.off(GameEvent.SevendayReceived,this.onReceived,this);
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
    }

    private onTouchStart(e){
        Activity.receiveSevenday(Activity.senvendayIndex);
    }

    private onReceived(e){
        var index:number = e.detail.index;
        this._items[index].recevied();
        this.btnShow();
    }
    start () {

    }

    // update (dt) {}
}
