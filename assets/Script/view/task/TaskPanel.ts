import PopUpBase from "../../component/PopUpBase";
import DList, { DListDirection } from "../../component/DList";

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
export default class TaskPanel extends PopUpBase{
    @property(DList)
    taskList: DList = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _taskListData:Array<any>= [];
    start () {

    }
    onLoad () {
        this.taskList.direction = DListDirection.Horizontal;
        this.initView();
    }

    onShowComplete(){
        this.initTaskList();
    }
    onEnable(){
        super.onEnable();
    }
    onDisable(){
        super.onDisable();
        this.taskList.setListData([]);
    }

    private initView(){

    }
    private initTaskList(){
        this._taskListData = [];
        for(var i:number = 0;i<13;i++){
            this._taskListData.push({});
        }
        this.taskList.setListData(this._taskListData);
    }

    // update (dt) {}
}
