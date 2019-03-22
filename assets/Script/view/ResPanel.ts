import LoadSprite from "../component/LoadSprite";
import PopUpBase from "../component/PopUpBase";
import { ResType } from "../model/ResInfo";
import { COMMON } from "../CommonData";
import StringUtil from "../utils/StringUtil";
import { UI } from "../manager/UIManager";
import { ResConst } from "../module/loading/steps/LoadingStepRes";
import { GLOBAL } from "../GlobalData";
import PathUtil from "../utils/PathUtil";
import { CONSTANT } from "../Constant";
import { WeiXin, SeeVideoType } from "../wxInterface";
import MsgGetReward from "../net/msg/MsgGetReward";
import { NET } from "../net/core/NetController";
import { EVENT } from "../message/EventCenter";
import { Task, TaskType } from "../module/TaskAssist";
import GameEvent from "../message/GameEvent";
import { GUIDE } from "../manager/GuideManager";
import ButtonEffect from "../component/ButtonEffect";

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

export enum ResPanelType{
    GoldNotEnough = 1,    //金币不足
    StoneNotEnough,     //灵石不足
    GoldRes,            //金币
    StoneRes,           //灵石
    DiamondNotEnough,
    DiamondRes,
}
export enum SeeVideoResult{
    NotComplete = 0,    //未看完
    Complete ,          //正常看我
    LoadError           //加载失败
}
@ccclass
export default class ResPanel extends PopUpBase {

    @property(cc.Label)
    msg: cc.Label = null;
    @property(cc.Label)
    award: cc.Label = null;
    @property(LoadSprite)
    awardIcon: LoadSprite = null;
    @property(cc.Button)
    videoBtn: cc.Button = null;
    @property(cc.Node)
    adView:cc.Node = null;
    @property(cc.Node)
    resNode:cc.Node = null;
    @property(cc.Label)
    resNum: cc.Label = null;
    @property(LoadSprite)
    resTip: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _awardType:ResPanelType = 0;
    private _resType:ResType = 0;
    private _videoType:SeeVideoType = 0;
    private _awardNum:number = 0;
    public setData(data:any){
        super.setData(data);
        this._awardType = data.type;
        if(this._awardType == ResPanelType.GoldRes || this._awardType == ResPanelType.GoldNotEnough){
            this._resType = ResType.gold;
            this._videoType = SeeVideoType.SeeVideoGetGold;
            this._awardNum = CONSTANT.getSeeVideoGold();
        }else if(this._awardType == ResPanelType.StoneRes || this._awardType == ResPanelType.StoneNotEnough){
            this._resType = ResType.lifeStone;
            this._videoType = SeeVideoType.SeeVideoGetStone;
            this._awardNum = CONSTANT.getSeeVideoStone();
        }else if(this._awardType == ResPanelType.DiamondRes || this._awardType == ResPanelType.DiamondNotEnough){
            this._resType = ResType.diamond;
            this._videoType = SeeVideoType.SeeVideoGetDiamond;
            this._awardNum = CONSTANT.getSeeVideoDiamond();
        }
    }

    onEnable(){
        super.onEnable();
        this.initView();
        this.videoBtn.node.on(ButtonEffect.CLICK_END,this.onVideoSee,this);
        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onWeakGuideTouch,this);
    }

    onDisable(){
        super.onDisable();
        this.videoBtn.node.off(ButtonEffect.CLICK_END,this.onVideoSee,this);
        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onWeakGuideTouch,this);
    }

    start () {

    }

    private initView(){
        if(!GLOBAL.isOpenAdId){
            this.adView.active = false;
            this.resNode.y = this.msg.node.y = 0;
        }else{
            this.adView.active = true;
            this.resNode.y = this.msg.node.y = 77;
            this.initVideoView();
        }
        if(this._awardType == ResPanelType.GoldRes){
            this.resNode.active = true;
            this.msg.node.active = false;
            this.resTip.load(PathUtil.getResTipNameUrl(this._resType));
            this.resNum.string = StringUtil.formatReadableNumber(COMMON.resInfo.gold);
        }else if(this._awardType == ResPanelType.StoneRes){
            this.resNode.active = true;
            this.msg.node.active = false;
            this.resTip.load(PathUtil.getResTipNameUrl(this._resType));
            this.resNum.string = StringUtil.formatReadableNumber(COMMON.resInfo.lifeStone);
        }else if(this._awardType == ResPanelType.DiamondRes){
            this.resNode.active = true;
            this.msg.node.active = false;
            this.resTip.load(PathUtil.getResTipNameUrl(this._resType));
            this.resNum.string = COMMON.resInfo.diamond.toFixed(0);
        }else if(this._awardType == ResPanelType.GoldNotEnough){
            this.resNode.active = false;
            this.msg.node.active = true;
            this.msg.string = "金币不足！";
        }else if(this._awardType == ResPanelType.StoneNotEnough){
            this.resNode.active = false;
            this.msg.node.active = true;
            this.msg.string = "灵石不足！";
        }else if(this._awardType == ResPanelType.DiamondNotEnough){
            this.resNode.active = false;
            this.msg.node.active = true;
            this.msg.string = "钻石不足！";
        }
    }

    private initVideoView(){
        this.awardIcon.load(PathUtil.getResMutiIconUrl(this._resType));
        if(this._awardType == ResPanelType.DiamondRes){
            this.award.string = this._awardNum.toString();
        }else{
            this.award.string = StringUtil.formatReadableNumber(this._awardNum);
        }
    }

    private onVideoSee(){
        // SOUND.pauseMusic();
        this.onClose(null);
        WeiXin.showVideoAd((result:SeeVideoResult)=>{
            if(result == SeeVideoResult.Complete){
                this.getVideoReward(this._resType,this._awardNum,false);
            }else if(result == SeeVideoResult.LoadError){
                UI.showTip("视频加载失败！请稍候再来");
            }else if(result == SeeVideoResult.NotComplete){
                UI.showTip("视频观看未完成");
            }
        },this._videoType)
    }

    //看视频得奖励
    public getVideoReward(type:ResType,num:number,isShare:boolean){
        NET.send(MsgGetReward.create(type,num,isShare),(msg:MsgGetReward)=>{
            if(msg && msg.resp){
                COMMON.updateResInfo(msg.resp.resInfo);
                UI.createPopUp(ResConst.singleAwardPanel,
                    {type:this._resType,num:num})
                
                if(type == ResType.gold){
                    //完成任务 
                    Task.finishTask(TaskType.SeeVideoGetGold);
                }else if(type == ResType.lifeStone){
                    //完成任务 
                    Task.finishTask(TaskType.SeeVideoGetStone);
                }
            }
        },this)
    }

    public static show(type:ResPanelType){
        UI.createPopUp(ResConst.resPanel,{type:type});
    }


    ////////////////Guide//////////////////
    public getGuideNode(name:string):cc.Node{
        if(name == "popup_getBtn"){
            return this.videoBtn.node;
        }else{
            return null;
        }
    }

    public onWeakGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "popup_getBtn"){
            this.onVideoSee();
            GUIDE.nextWeakGuide(guideId);
        }
    }
    // update (dt) {}
}
