import FlowGroup, { FlowGroupLayout } from "../../component/FlowGroup";
import UIBase from "../../component/UIBase";
import { GrowRewardType, GrowthRewardInfo } from "../../model/TaskInfo";
import { Task } from "../../module/TaskAssist";
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
export default class GrowthBoxUI extends UIBase {

    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Label)
    labelCur: cc.Label = null;
    @property(cc.Button)
    btnLingqu:cc.Button = null;
    @property(FlowGroup)
    awardGroup:FlowGroup = null;
    @property(cc.Node)
    nodeAllFinish: cc.Node = null;
    @property(cc.Node)
    nodeGrowth: cc.Node = null;


    private _type:GrowRewardType = 0;
    public get index(){
        return this._type-1;
    }
    private _reward:GrowthRewardInfo = null;
    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        this._reward = Task.taskInfo.getGrowthRewardWithType(this._type);
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.awardGroup.layout = FlowGroupLayout.Left;
    }

    onEnable(){
        this.initView();
        this.btnLingqu.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        EVENT.on(GameEvent.TaskGrowthReceived,this.onReceived,this);
    }
    onDisable(){
        this.btnLingqu.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        EVENT.off(GameEvent.TaskGrowthReceived,this.onReceived,this);
    }


    private initView(){
        if(this._reward.reward){
            this.nodeGrowth.active = true;
            this.nodeAllFinish.active = false;

            this.labelName.string = this._reward.reward.rewardName;
            if(this._reward.canReceive){
                this.labelCur.string = "完成度：已完成";
                this.btnLingqu.node.active = true;
            }else{
                this.labelCur.string = "完成度："+this._reward.curNum+"/"+this._reward.reward.needScore;
                this.btnLingqu.node.active = false;
            }

            var groupdata:any[] = [{type:this._reward.reward.rewardResType,value:this._reward.reward.rewardResNum}]
            this.awardGroup.setGroupData(groupdata);
        }else{
            this.nodeGrowth.active = false;
            this.nodeAllFinish.active = true;
        }
    }

    private onTouchStart(e){
        Task.receiveGrowthReward(this._reward.reward);
    }

    private onReceived(e){
        var id :number = e.detail.id;
        if(id == this._reward.reward.rewardId){
            this._reward = Task.taskInfo.getGrowthRewardWithType(this._type);
            this.initView();
        }
    }
    start () {

    }

    // update (dt) {}
}
