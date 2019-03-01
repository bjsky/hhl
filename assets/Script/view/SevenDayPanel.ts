import PopUpBase from "../component/PopUpBase";
import SevendayItem from "./SevendayItem";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { CONSTANT } from "../Constant";
import { Activity } from "../module/ActivityAssist";

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
    

    // LIFE-CYCLE CALLBACKS:

    private _items:SevendayItem[] = [];
    onLoad () {
        
    }

    onEnable(){
        super.onEnable();
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
        this.btnLinqu.node.active = !Activity.senvendayTodayReward.isReceived;
    }

    start () {

    }

    // update (dt) {}
}
