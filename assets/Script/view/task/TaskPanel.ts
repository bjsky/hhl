import PopUpBase from "../../component/PopUpBase";
import DList, { DListDirection } from "../../component/DList";
import LoadSprite from "../../component/LoadSprite";
import { Task } from "../../module/TaskAssist";
import { RewardInfo } from "../../model/TaskInfo";
import PathUtil from "../../utils/PathUtil";

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
    @property([LoadSprite])
    boxArr:LoadSprite[] = [];
    @property([cc.Label])
    boxLabelArr:cc.Label[] = [];
    @property(cc.Label)
    lblScore:cc.Label = null;


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
        this.lblScore.string = Task.taskInfo.activeScore.toString();
        var box:LoadSprite= null;
        for(var i:number = 0;i<this.boxArr.length;i++){
            box = this.boxArr[i];
            box.node.off(cc.Node.EventType.TOUCH_START,this.onNodeTouch,this);
            box.node.off(cc.Node.EventType.TOUCH_END,this.onNodeCancel,this);
            box.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onNodeCancel,this);
            var boxReward:RewardInfo;
            if(Task.taskInfo.taskRewardArr.length>i){
                boxReward = Task.taskInfo.taskRewardArr[i];
                box.load(PathUtil.getBoxRecevieIcon(boxReward.isReceived));
                this.boxLabelArr[i].string = boxReward.rewardNeedScore.toString();
                if(!boxReward.isReceived){
                    box.node.on(cc.Node.EventType.TOUCH_START,this.onNodeTouch,this);
                    box.node.on(cc.Node.EventType.TOUCH_END,this.onNodeCancel,this);
                    box.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onNodeCancel,this);
                }
            }else{
                box.node.active = false;
                this.boxLabelArr[i].node.active = false;
            }
        }
    }

    private onNodeTouch(e){

    }

    private onNodeCancel(e){

    }

    private initTaskList(){
        this.taskList.setListData(Task.taskInfo.taskProgressArr);
    }

    // update (dt) {}
}
