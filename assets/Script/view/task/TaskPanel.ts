import PopUpBase from "../../component/PopUpBase";
import DList, { DListDirection } from "../../component/DList";
import LoadSprite from "../../component/LoadSprite";
import { Task } from "../../module/TaskAssist";
import { RewardInfo, GrowRewardType } from "../../model/TaskInfo";
import PathUtil from "../../utils/PathUtil";
import ButtonGroup from "../../component/ButtonGroup";
import RewardProgressUI from "./RewardProgressUI";
import { COMMON } from "../../CommonData";
import { Passage } from "../../module/battle/PassageAssist";
import { Card } from "../../module/card/CardAssist";
import { Battle } from "../../module/battle/BattleAssist";

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

    @property(RewardProgressUI)
    levelGrowthRewardPro: RewardProgressUI = null;
    @property(cc.Label)
    levelGrowthLabel: cc.Label = null;
    @property(RewardProgressUI)
    passGrowthRewardPro: RewardProgressUI = null;
    @property(cc.Label)
    passGrowthLabel: cc.Label = null;
    @property(RewardProgressUI)
    card4GrowthRewardPro: RewardProgressUI = null;
    @property(cc.Label)
    card4GrowthLabel: cc.Label = null;
    @property(RewardProgressUI)
    card5GrowthRewardPro: RewardProgressUI = null;
    @property(cc.Label)
    card5GrowthLabel: cc.Label = null;
    @property(RewardProgressUI)
    scoreGrowthRewardPro: RewardProgressUI = null;
    @property(cc.Label)
    scoreGrowthLabel: cc.Label = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _taskListData:Array<any>= [];
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

        this.initView();
    }
    onDisable(){
        super.onDisable();
        this.taskList.setListData([]);
        this.viewGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.viewGroupSelectChange,this)
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
    }
    private initAcitveView(){
        this.lblScore.string = Task.taskInfo.activeScore.toString();
        this.activeRewardProgress.setRewards(Task.taskInfo.totalScore,Task.taskInfo.activeScore,Task.taskInfo.taskRewardArr)
    }

    private initGrowthView(){
        var levelCur:number = COMMON.userInfo.level;
        var levelGrowthArr:RewardInfo[] = Task.taskInfo.getGrowthRewardWithType(GrowRewardType.LevelGrowth);
        var levelMax:number =levelGrowthArr[levelGrowthArr.length-1].needScore;
        this.levelGrowthRewardPro.setRewards(levelMax,levelCur,levelGrowthArr);
        this.levelGrowthLabel.string = "等级："+Task.taskInfo.growthNameArr[0];

        var passCur:number = Passage.passageInfo.passId;
        var passGrowthArr:RewardInfo[] = Task.taskInfo.getGrowthRewardWithType(GrowRewardType.PassGrowth);
        var passMax:number =passGrowthArr[passGrowthArr.length-1].needScore;
        this.passGrowthRewardPro.setRewards(passMax,passCur,passGrowthArr);
        this.passGrowthLabel.string = "试炼："+Task.taskInfo.growthNameArr[1];

        var card4Cur:number = Card.getGradeCardCount(4);
        var card4GrowthArr:RewardInfo[] = Task.taskInfo.getGrowthRewardWithType(GrowRewardType.cardGrowth4);
        var card4Max:number =card4GrowthArr[card4GrowthArr.length-1].needScore;
        this.card4GrowthRewardPro.setRewards(card4Max,card4Cur,card4GrowthArr);
        this.card4GrowthLabel.string = "卡牌："+Task.taskInfo.growthNameArr[2];

        var card5Cur:number = Card.getGradeCardCount(5);
        var card5GrowthArr:RewardInfo[] = Task.taskInfo.getGrowthRewardWithType(GrowRewardType.cardGrowth5);
        var card5Max:number =card5GrowthArr[card5GrowthArr.length-1].needScore;
        this.card5GrowthRewardPro.setRewards(card5Max,card5Cur,card5GrowthArr);
        this.card5GrowthLabel.string = "卡牌："+Task.taskInfo.growthNameArr[3];

        var scoreCur:number =50;// Battle.battleInfo.score;
        var scoreGrowthArr:RewardInfo[] = Task.taskInfo.getGrowthRewardWithType(GrowRewardType.scoreGrowth);
        var scoreMax:number =scoreGrowthArr[scoreGrowthArr.length-1].needScore;
        this.scoreGrowthRewardPro.setRewards(scoreMax,scoreCur,scoreGrowthArr);
        this.scoreGrowthLabel.string = "战场："+Task.taskInfo.growthNameArr[4];

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
