import UIBase from "../../component/UIBase";
import LoadSprite from "../../component/LoadSprite";
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
export default class BoxRewardUI extends UIBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(LoadSprite)
    icon: LoadSprite = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _reward:RewardInfo = null;
    private _isGrowth:boolean = false;
    public get reward(){
        return this._reward;
    }

    public setData(data:any){
        super.setData(data);
        this._reward = data.reward as RewardInfo;
        this._isGrowth = data.isGrowth;
    }

    onEnable(){
        this.initView();
    }
    start () {

    }

    private initView(){
        this.label.string = this._reward.needScore.toString();
        this.label.node.active = !this._isGrowth;
        this.icon.load(PathUtil.getBoxRecevieIcon(this._reward.isReceived));
    }

    // update (dt) {}
}
