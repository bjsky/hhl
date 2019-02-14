import PopUpBase from "../../component/PopUpBase";
import DList, { DListDirection } from "../../component/DList";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import ButtonGroup from "../../component/ButtonGroup";
import MsgGetRankList, { GetRankListType, SRankInfo } from "../../net/msg/MsgGetRankList";
import { NET } from "../../net/core/NetController";

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
export default class RankPanel extends PopUpBase{

    @property(DList)
    rankList: DList = null;
    @property(ButtonGroup)
    btnGroup:ButtonGroup = null;
    @property(cc.Label)
    myOrder:cc.Label = null;

    private _myOrder:number = 0;
    private _ranklistData:RankInfo[] = [];
    onLoad () {
        this.rankList.direction = DListDirection.Horizontal;
        this.initView();
    }

    onShowComplete(){
        this.initRankList();
    }
    onEnable(){
        super.onEnable();
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
    }
    onDisable(){
        super.onDisable();
        this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.rankList.setListData([]);
    }
    private groupSelectChange(e){
        var idx = e.detail.index;
        this.initRankList();
    }

    private initView(){
        this.myOrder.string = this._myOrder.toString();
        this.initListGroup();
    }
    private initListGroup(){
        this.btnGroup.labels = "等级榜;战力榜;积分榜"
        this.btnGroup.selectIndex = 0;
    }

    private initRankList(){
        var curIndex:number = this.btnGroup.selectIndex;
        var curRankType:GetRankListType = curIndex+1;
        NET.send(MsgGetRankList.create(curRankType,30),(msg:MsgGetRankList) =>{
            if(msg && msg.resp){
                this._myOrder = msg.resp.myOrder;
                this.myOrder.string = this._myOrder.toString();
        
                this._ranklistData = [];
                var tempList:SRankInfo[] = msg.resp.rankList;
                var info:RankInfo;
                for(var i:number =0;i<tempList.length;i++){
                    info = new RankInfo();
                    info.initFormServer(tempList[i]);
                    this._ranklistData.push(info);
                }
                this._ranklistData.sort((a:RankInfo,b:RankInfo)=>{
                    if(curRankType == GetRankListType.Level){
                        return b.playerLevel - a.playerLevel;
                    }else if(curRankType == GetRankListType.Power){
                        return b.playerPower - a.playerPower;
                    }else if(curRankType == GetRankListType.Score){
                        return b.playerScore - a.playerScore;
                    }else{
                        return 0;
                    }
                })
                this.rankList.setListData(this._ranklistData);
            }
        },this)
    }

    // update (dt) {}
}

export class RankInfo{
    //姓名
    public playerName:string = "";
    //等级
    public playerLevel:number = 1;
    //性别
    public playerSex:number = 1;
    //头像
    public playerIcon:string = "";
    //阵容战力
    public playerPower:number = 0;
    //积分
    public playerScore:number = 0;

    public initFormServer(sInfo:SRankInfo){
        this.playerName = sInfo.playerName;
        this.playerLevel = sInfo.playerLevel;
        this.playerSex = sInfo.playerSex;
        this.playerIcon = sInfo.playerIcon;
        this.playerPower = sInfo.playerPower;
        this.playerScore = sInfo.playerScore;
    }
}