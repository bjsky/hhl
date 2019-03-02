import { RewardInfo } from "../../model/TaskInfo";
import BoxRewardUI from "./BoxRewardUI";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";

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
export default class RewardProgressUI extends cc.Component {

    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;
    @property(cc.Node)
    boxNode:cc.Node = null;

    @property(Boolean)
    isGrowth:boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    private _boxs:BoxRewardUI[] = [];

    private _totalScore:number = 0;
    private _curScore:number = 0;
    private _rewards:RewardInfo[] = [];

    public setRewards(totalScore:number,curScore:number,rewards:RewardInfo[]){
        this._totalScore = totalScore;
        this._curScore = curScore;
        this._rewards = rewards;
        while(this.boxNode.childrenCount>0){
            UI.removeUI(this.boxNode.children[0]);
        }

        for(var i:number = 0;i<this._rewards.length;i++){
            var reward:RewardInfo = this._rewards[i];
            UI.loadUI(ResConst.BoxReward,{reward:reward,isGrowth:this.isGrowth},this.boxNode,(ui:BoxRewardUI)=>{
                var per:number = ui.reward.needScore /this._totalScore;
                console.log(ui.reward.needScore,this._totalScore)
                ui.node.setPosition(cc.v2(this.boxNode.width*per,10));
            });
        }

        var pro:number = this._curScore/this._totalScore;
        pro = (pro>1)?1:(pro<0?0:pro);
        this.progress.progress = pro;
    }

    // update (dt) {}
}
