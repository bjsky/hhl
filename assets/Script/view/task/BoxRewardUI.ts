import UIBase from "../../component/UIBase";
import LoadSprite from "../../component/LoadSprite";
import { RewardInfo } from "../../model/TaskInfo";
import PathUtil from "../../utils/PathUtil";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
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
export default class BoxRewardUI extends UIBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(LoadSprite)
    icon: LoadSprite = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _reward:RewardInfo = null;
    private _isGrowth:boolean = false;
    private _canReceive:boolean = false;
    public get reward(){
        return this._reward;
    }

    public setData(data:any){
        super.setData(data);
        this._reward = data.reward as RewardInfo;
        this._isGrowth = data.isGrowth;
        this._canReceive = data.canReceive;
    }

    onEnable(){
        this.initView();
        EVENT.on(GameEvent.TaskActiveReceived,this.onTaskActiveReceived,this);
        this.icon.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.icon.node.on(cc.Node.EventType.TOUCH_END,this.onTouchCancel,this);
        this.icon.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    }
    onDisable(){
        EVENT.off(GameEvent.TaskActiveReceived,this.onTaskActiveReceived,this);
        this.icon.node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.icon.node.off(cc.Node.EventType.TOUCH_END,this.onTouchCancel,this);
        this.icon.node.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);
    }
    start () {

    }


    private onTaskActiveReceived(e){
        var rewardId = e.id;
        if(rewardId == this.reward.rewardId){
            this.received(rewardId);
        }
    }

    private onTouchStart(e){
        if(this._canReceive){
            if(!this._reward.isReceived){
                Task.receiveTaskReward(this._reward);
            }
        }else{
            UI.showDetailTip(ResConst.RewardTip,{reward:this._reward,target:this.node});
        }
    }

    private onTouchCancel(e){
        UI.hideDetailTip();
    }

    private initView(){
        this.label.string = this._reward.needScore.toString();
        this.label.node.active = !this._isGrowth;
        this.icon.load(PathUtil.getBoxRecevieIcon(this._reward.isReceived));
    }

    private received(rewardId:number){
        this._reward = Task.taskInfo.getTaskReward(rewardId);
        if(this._reward){
            this.initView();
        }
    }

    // update (dt) {}
}
