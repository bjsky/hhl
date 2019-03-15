import UIBase from "../component/UIBase";
import LoadSprite from "../component/LoadSprite";
import { RewardInfo } from "../model/TaskInfo";
import { Activity } from "../module/ActivityAssist";
import { ResType } from "../model/ResInfo";
import PathUtil from "../utils/PathUtil";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import StringUtil from "../utils/StringUtil";

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
export default class SevendayItem extends UIBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(LoadSprite)
    icon: LoadSprite = null;
    @property(LoadSprite)
    grade: LoadSprite = null;
    @property(cc.Label)
    labelNum: cc.Label = null;
    @property(cc.Label)
    labelLinqu: cc.Label = null;
    @property(cc.Node)
    nodeKuang: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _index:number = 0;
    private _reward:RewardInfo =null;
    public setData(data:any){
        super.setData(data);
        this._index = data.index;
        this._reward = Activity.senvendayRewardArr[this._index];
    }

    onEnable(){

        this.initView();
    }

    private initView(){
        this.grade.node.active = true;
        this.label.string = this._reward.rewardName;
        if(this._reward.rewardResType == ResType.card){
            var cardId:number =this._reward.rewardCardId;
            var cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,cardId);
            this.icon.load(PathUtil.getCardHeadUrl(cardCfg.head))
            this.grade.load(PathUtil.getCardHeadGradeImgPath(this._reward.rewardCardGrade));
            this.labelNum.string = cardCfg.name;
            this.labelNum.node.color = new cc.Color().fromHEX("#c636ea");
            this.nodeKuang.active = true;
        }else{
            this.icon.load(PathUtil.getResMutiIconUrl(this._reward.rewardResType));
            this.grade.node.active = false;
            this.labelNum.string = StringUtil.formatReadableNumber(this._reward.rewardResNum) ;
            this.labelNum.node.color = new cc.Color().fromHEX("#ffffff");
            this.nodeKuang.active = false;
        }
        this.btnShow();
    }

    private btnShow(){

        if(this._reward.isReceived){
            this.labelLinqu.node.active = true;
            this.labelNum.node.active = false;
        }else{
            this.labelLinqu.node.active = false;
            this.labelNum.node.active = true;
        }
    }

    public recevied(){
        this._reward = Activity.senvendayRewardArr[this._index];
        this.btnShow();
    }
    start () {

    }

    // update (dt) {}
}
