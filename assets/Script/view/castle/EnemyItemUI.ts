import UIBase from "../../component/UIBase";
import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { UI } from "../../manager/UIManager";
import TouchHandler from "../../component/TouchHandler";
import EnemyInfo from "../../model/EnemyInfo";
import PathUtil from "../../utils/PathUtil";
import { NET } from "../../net/core/NetController";
import MsgGetFightRecordList from "../../net/msg/MsgGetFightRecordList";
import { FightRecord } from "../../model/BattleInfo";
import { Battle } from "../../module/battle/BattleAssist";
import { COMMON } from "../../CommonData";
import StringUtil from "../../utils/StringUtil";

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
export default class EnmeyItemUI extends DListItem{

    @property(LoadSprite)
    sprHead: LoadSprite = null;
    @property(cc.Label)
    lblName: cc.Label = null;
    @property(LoadSprite)
    sprSex: LoadSprite = null;
    @property(cc.Label)
    lblTime: cc.Label = null;

    private _enemyInfo:EnemyInfo = null;
    // LIFE-CYCLE CALLBACKS:
    public setData(data:any){
        super.setData(data);
        this._enemyInfo = data as EnemyInfo;
    }

    // onLoad () {}
    onEnable(){
        this.sprHead.node.on(TouchHandler.TOUCH_CLICK,this.onHeadTouch,this);
        this.initView();
    }
    onDisable(){
        this.sprHead.node.off(TouchHandler.TOUCH_CLICK,this.onHeadTouch,this);
    }

    private onHeadTouch(e){
        NET.send(MsgGetFightRecordList.create(this._enemyInfo.enemyUid),(msg:MsgGetFightRecordList)=>{
            if(msg && msg.resp){
                var records = Battle.updateFightRecords(this._enemyInfo.enemyUid,msg.resp.records);
                UI.createPopUp(ResConst.FighterDetailPanel,{info:this._enemyInfo,records:records});
            }
        },this);
    }

    private initView(){
        this.lblName.string = this._enemyInfo.enemyName;
        this.sprHead.load(this._enemyInfo.enemyIcon);
        this.sprSex.load(PathUtil.getSexIconUrl(this._enemyInfo.enemySex));
        var time = this._enemyInfo.enemyLastRabTime;
        time = Math.floor((COMMON.getServerTime() - time)/1000);
        var timeStr:string = StringUtil.formatReadableTime(time,true)+ "前";
        this.lblTime.string = timeStr;
    }
    start () {

    }

    public onShowDetail(){
        this.onHeadTouch(null);
    }

    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_fightRevenge"){
            return this.sprHead.node;
        }else{
            return null;
        }
    }
    // update (dt) {}
}
