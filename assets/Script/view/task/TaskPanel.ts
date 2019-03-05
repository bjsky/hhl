import PopUpBase from "../../component/PopUpBase";
import DList, { DListDirection } from "../../component/DList";
import { Task } from "../../module/TaskAssist";
import ButtonGroup from "../../component/ButtonGroup";
import RewardProgressUI from "./RewardProgressUI";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import GrowthBoxUI from "./GrowthBoxUI";
import { GrowRewardType } from "../../model/TaskInfo";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { GUIDE } from "../../manager/GuideManager";

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

export enum TaskViewSelect{
    EvenyDayActive = 0,
    GrowthReward
}

@ccclass
export default class TaskPanel extends PopUpBase{
    @property(DList)
    taskList: DList = null;
    @property(RewardProgressUI)
    activeRewardProgress: RewardProgressUI = null;
    @property(cc.Label)
    lblScore:cc.Label = null;

    @property(ButtonGroup)
    viewGroup:ButtonGroup = null;
    @property(cc.Node)
    nodeActive:cc.Node = null;
    @property(cc.Node)
    nodeGrowthReward:cc.Node = null;

    @property(cc.Node)
    nodeGrowthBox:cc.Node = null;
    

    @property(cc.Node)
    nodeActiveRed:cc.Node = null;
    @property(cc.Node)
    nodeGrowthRed:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:


    private _taskListData:Array<any>= [];
    private _growthBoxArr:GrowthBoxUI[] = [];
    start () {

    }
    onLoad () {
        this.taskList.direction = DListDirection.Horizontal;
        this.viewGroup.labelVisible = false;
        
    }

    private _viewType:TaskViewSelect = 0;
    public setData(data:any){
        this._viewType =data.view;
    }

    onShowComplete(){
        this.initTaskList();
    }
    onEnable(){
        super.onEnable();
        this.viewGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.viewGroupSelectChange,this);
        EVENT.on(GameEvent.Guide_Weak_Start,this.onStartWeakGuide,this);
        EVENT.on(GameEvent.TaskActiveReceived,this.onReceived,this);
        EVENT.on(GameEvent.TaskGrowthReceived,this.onReceived,this);
        this.initView();
    }
    onDisable(){
        super.onDisable();
        this.taskList.setListData([]);
        this.viewGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.viewGroupSelectChange,this)
        EVENT.off(GameEvent.Guide_Weak_Start,this.onStartWeakGuide,this);
        EVENT.off(GameEvent.TaskActiveReceived,this.onReceived,this);
        EVENT.off(GameEvent.TaskGrowthReceived,this.onReceived,this);
    }

    private onReceived(e){
        this.showRedPoint();
    }
    private showRedPoint(){
        this.nodeActiveRed.active = Task.canReceiveActive;
        this.nodeGrowthRed.active = Task.canReceiveGrowth;
    }

    private _selectViewIndex:TaskViewSelect = 0;
    private viewGroupSelectChange(){
        this._selectViewIndex = this.viewGroup.selectIndex;
        this.nodeActive.active =(this._selectViewIndex == TaskViewSelect.EvenyDayActive);
        this.nodeGrowthReward.active =(this._selectViewIndex == TaskViewSelect.GrowthReward);

        if(this._selectViewIndex == TaskViewSelect.EvenyDayActive){
            this.initAcitveView();
        }else if(this._selectViewIndex == TaskViewSelect.GrowthReward){
            this.initGrowthView();
        }
    }

    private initView(){
        this.viewGroup.selectIndex = this._viewType;
        this.viewGroupSelectChange();
        this.showRedPoint();
    }
    private initAcitveView(){
        this.lblScore.string = Task.taskInfo.activeScore.toString();
        this.activeRewardProgress.setRewards(Task.taskInfo.totalScore,Task.taskInfo.activeScore,Task.taskInfo.taskRewardArr)
    }

    private initGrowthView(){
        this._growthBoxArr = [];
        while(this.nodeGrowthBox.childrenCount>0){
            UI.removeUI(this.nodeGrowthBox.children[0]);
        }
        for(var i= GrowRewardType.LevelGrowth;i<=GrowRewardType.scoreGrowth;i++){
            UI.loadUI(ResConst.GrowthBox,{type:i},this.nodeGrowthBox,(ui:GrowthBoxUI)=>{
                this._growthBoxArr.push(ui);
                ui.node.setPosition(-2,167-(ui.index*110));
            })
        }

    }
    private _closeCompleStartGuideId:number = 0;
    private onStartWeakGuide(e){
        this._closeCompleStartGuideId = e.detail.guideId;
        this.onClose(e);
    }
    protected onCloseComplete(){
        super.onCloseComplete();
        if(this._closeCompleStartGuideId>0){
            var guideId  = this._closeCompleStartGuideId;
            this._closeCompleStartGuideId = 0;
            GUIDE.startWeakGuide(guideId);
        }
    }

    private initTaskList(){
        this.taskList.setListData(Task.taskInfo.taskProgressArr);
    }

    // update (dt) {}
}
