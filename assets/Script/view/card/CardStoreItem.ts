import LoadSprite from "../../component/LoadSprite";
import DListItem from "../../component/DListItem";
import CardInfo from "../../model/CardInfo";
import PathUtil from "../../utils/PathUtil";
import { COMMON } from "../../CommonData";
import { UI } from "../../manager/UIManager";
import { NET } from "../../net/core/NetController";
import MsgDiamondBuy from "../../net/msg/MsgDiamondBuy";
import { AlertBtnType } from "../AlertPanel";
import { Card } from "../../module/card/CardAssist";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { CardBigShowType } from "./CardBig";
import { Task, TaskType } from "../../module/TaskAssist";
import ResPanel, { ResPanelType } from "../ResPanel";

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
export default class CardStoreItem extends DListItem{
    @property(cc.Label)
    cardName: cc.Label = null;
    @property(LoadSprite)
    cardRace: LoadSprite = null;
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;
    @property(LoadSprite)
    cardFront: LoadSprite = null;
    @property(cc.Label)
    diamondCost: cc.Label = null;
    @property(cc.Button)
    btnExchange: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    
    onLoad () {
        super.onLoad();
        this.cardSrc.load("");
    }

    start () {

    }
    private _cardCfg:any;
    private _grade:number = 0;
    private _cost:number = 0;

    public setData(data:any){
        super.setData(data);
        this._cardCfg = data.cfg;
        this._grade = data.grade;
        this._cost = data.cost;
    }

    private initView(){
        this.cardName.string = this._cardCfg.name;
        this.cardSrc.load(PathUtil.getCardSamllImgPath(this._cardCfg.simgPath));
        this.cardStar.load(PathUtil.getCardGradeImgPath(this._grade));
        this.cardFront.load(PathUtil.getCardFrontImgPath(this._grade));
        this.cardRace.load(PathUtil.getCardRaceImgPath(this._cardCfg.raceId));
        this.diamondCost.string = this._cost.toString();

    }
    onEnable(){
        super.onEnable();
        this.btnExchange.node.on(cc.Node.EventType.TOUCH_START,this.onExchange,this);
        this.initView();
    }
    onDisable(){
        super.onDisable();
        this.btnExchange.node.off(cc.Node.EventType.TOUCH_START,this.onExchange,this);

    }

    private onExchange(e){
        if(COMMON.resInfo.diamond <this._cost){
            ResPanel.show(ResPanelType.DiamondNotEnough);
            return;
        }
        UI.showAlert("花费"+this._cost+"钻石兑换？",()=>{
            this.diamondBuy();
        },null,AlertBtnType.OKAndCancel);
    }

    private diamondBuy(){
        NET.send(MsgDiamondBuy.create(this._cost,this._cardCfg.id,this._grade),(msg:MsgDiamondBuy)=>{
            if(msg && msg.resp){
                COMMON.updateResInfo(msg.resp.resInfo);
                Card.addNewCard(msg.resp.newCard);
                
                EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.diamond,value:this._cost}]});
                this.showGetCard(msg.resp.newCard.uuid);
                //完成任务 
                Task.finishTask(TaskType.DiamondBuy);
            }
        },this)
    }

    private showGetCard(uuid){
        UI.createPopUp(ResConst.cardBig,{type:CardBigShowType.DiamondGetCard, cardUUid:uuid,fPos:null,tPos:null});
    }
    // update (dt) {}
}
