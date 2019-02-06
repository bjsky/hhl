import UIBase from "../../component/UIBase";
import DList, { DListDirection } from "../../component/DList";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";

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
export default class CastlePanel extends UIBase {

    @property(DList)
    fighterList: DList= null;

    @property(DList)
    enemyList: DList= null;
    // LIFE-CYCLE CALLBACKS:

    private _fighterListData:Array<any> = [];
    private _enemyListData:Array<any> = [];
    
    onLoad () {
        this.fighterList.direction = DListDirection.Horizontal;
        this.enemyList.direction = DListDirection.Horizontal;
        this.initView();
    }

    onEnable(){
        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
    }

    onDisable(){
        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);

        this.fighterList.setListData([]);
        this.enemyList.setListData([]);
    }
    private onPanelShowComplete(e){
        this.initFighterList();
        this.initEnemyList();
    }

    private initView(){

    }

    private initFighterList(){
        this._fighterListData = [];
        for(var i:number = 0;i<5;i++){
            this._fighterListData.push({});
        }
        this.fighterList.setListData(this._fighterListData);
    }

    private initEnemyList(){
        this._enemyListData = [];
        for(var i:number = 0;i<5;i++){
            this._enemyListData.push({});
        }
        this.enemyList.setListData(this._enemyListData);
    }
    start () {

    }

    // update (dt) {}
}
