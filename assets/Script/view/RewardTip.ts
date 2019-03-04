import UIBase from "../component/UIBase";
import FlowGroup, { FlowGroupLayout } from "../component/FlowGroup";
import { RewardInfo } from "../model/TaskInfo";

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
export default class RewardTip extends UIBase {

    @property(cc.Label)
    lblName: cc.Label = null;

    @property(FlowGroup)
    awardGroup:FlowGroup = null;

    private _reward:RewardInfo = null;
    private _target:cc.Node = null;
    public setData(data:any){
        super.setData(data);
        this._reward = data.reward as RewardInfo;
        this._target = data.target;
    }
    onLoad(){
        this.awardGroup.layout = FlowGroupLayout.Left;
    }

    onEnable(){
        this.initView();

        this.adjustPosition();
    }

    onDisable(){

    }

    private initView(){
        this.lblName.string = this._reward.rewardName;
        var groupdata:any[] = [{type:this._reward.rewardResType,value:this._reward.rewardResNum}]
        this.awardGroup.setGroupData(groupdata);
    }



    public adjustPosition(){
        if (this.node != null) {
            if(this._target != null)
            {
                let tpos = this._target.parent.convertToWorldSpaceAR(this._target.position)
                let pos  = tpos.add(cc.v2(0,(this._target.height+this.node.height)>>1));
                pos = this.node.parent.convertToNodeSpaceAR(pos);
                this.node.position = pos;
                let rect = this.node.getBoundingBoxToWorld();
                // if(nodeRect.y + nodeRect.height<=cc.winSize.height)
                // {
                //     if(nodeRect.x <0)
                //     {
                //         this.node.x += -nodeRect.x;
                //     }else if(nodeRect.x + nodeRect.width>cc.winSize.width)
                //     {
                //         this.node.x += -(nodeRect.x + nodeRect.width-cc.winSize.width)
                //     }
                // }else
                // {
                //     let w = (this._target.width+this.node.width)>>1;
                //     if(pos.x<cc.winSize.width*0.5)
                //     {
                //         pos = tpos.add(cc.v2(w,0));
                //     }else
                //     {
                //         pos = tpos.sub(cc.v2(w,0));
                //     }
                //     this.node.position = pos;
                // }

                if(rect.x<0){
                    this.node.x+= -rect.x;
                }else if(rect.x + rect.width>cc.winSize.width){
                    this.node.x += -(rect.x + rect.width-cc.winSize.width);
                }
            }
            
        }
       
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
