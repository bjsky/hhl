import FlowGroup, { FlowGroupLayout } from "../../component/FlowGroup";
import UIBase from "../../component/UIBase";
import { GrowRewardType, GrowthRewardInfo } from "../../model/TaskInfo";
import { Task } from "../../module/TaskAssist";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import ButtonEffect from "../../component/ButtonEffect";

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
    @property(cc.RichText)
    labelCur: cc.RichText = null;
    @property(cc.Button)
    btnLingqu:cc.Button = null;
    @property(FlowGroup)
    awardGroup:FlowGroup = null;
    @property(cc.Node)
    nodeAllFinish: cc.Node = null;
    @property(cc.Node)
    nodeGrowth: cc.Node = null;
    @property(LoadSprite)
    sprType: LoadSprite = null;

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
        this.btnLingqu.node.on(ButtonEffect.CLICK_END,this.onTouchStart,this);
        EVENT.on(GameEvent.TaskGrowthReceived,this.onReceived,this);

        this.initView();
    }
    onDisable(){
        this.btnLingqu.node.off(ButtonEffect.CLICK_END,this.onTouchStart,this);
        EVENT.off(GameEvent.TaskGrowthReceived,this.onReceived,this);
    }


    private initView(){
        this.sprType.load(PathUtil.getGrowthTypeUrl(this._reward.growthType));
        if(this._reward.reward){
            this.nodeGrowth.active = true;
            this.nodeAllFinish.active = false;

            this.labelName.string = this._reward.reward.rewardName;
            if(this._reward.canReceive){
                this.labelCur.string = "<color=#92501B>已完成</c>";
                this.btnLingqu.node.active = true;
            }else{
                this.labelCur.string = "<color=#92501B>完成度：<color=#F3ED4A>"+this._reward.curNum+"</c>/"+this._reward.reward.needScore+"</c>";
                this.btnLingqu.node.active = false;
            }

            var groupdata:any[] = [{type:this._reward.reward.rewardResType,value:this._reward.reward.rewardResNum}]
            this.awardGroup.setGroupData(groupdata);
        }else{
            this.nodeGrowth.active = false;
            this.nodeAllFinish.active = true;
            EVENT.off(GameEvent.TaskGrowthReceived,this.onReceived,this);
        }
    }

    private onTouchStart(e){
        Task.receiveGrowthReward(this._reward.reward);
    }

    private onReceived(e){
        var id :number = e.id;
        if(this._reward.reward && id == this._reward.reward.rewardId){
            this._reward = Task.taskInfo.getGrowthRewardWithType(this._type);
            this.initView();
        }
    }
    start () {

    }

    // update (dt) {}
}
