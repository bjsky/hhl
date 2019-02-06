import PopUpBase from "../../component/PopUpBase";
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
export default class RankPanel extends PopUpBase{

    @property(DList)
    rankList: DList = null;

    @property
    text: string = 'hello';

    private _ranklistData:Array<any> = [];
    onLoad () {
        this.rankList.direction = DListDirection.Horizontal;
        this.initView();
    }

    onShowComplete(){
        this.initRankList();
    }
    onDisable(){
        super.onDisable();
        this.rankList.setListData([]);
    }

    private initView(){

    }

    private initRankList(){
        this._ranklistData = [];
        for(var i:number = 0;i<30;i++){
            this._ranklistData.push({index:i});
        }
        this.rankList.setListData(this._ranklistData);
    }

    // update (dt) {}
}
