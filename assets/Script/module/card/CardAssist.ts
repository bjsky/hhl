import { CONSTANT } from "../../Constant";
import NunmberUtil from "../../utils/NumberUtil";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { NET } from "../../net/core/NetController";
import MsgCardSummon, { CardSummonType, SCardInfo } from "../../net/msg/MsgCardSummon";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import { COMMON } from "../../CommonData";
import CardInfo from "../../model/CardInfo";

export enum CardRaceType{
    All =0,
    WuZu = 1,   //巫族
    YaoZu,      //妖族
    XianJie,    //仙界
    RenJie      //人界
}


export default class CardAssist{
    private static _instance: CardAssist = null;
    public static getInstance(): CardAssist {
        if (CardAssist._instance == null) {
            CardAssist._instance = new CardAssist();
            
        }
        return CardAssist._instance;
    }
    //所有卡牌
    public cardsMap:any = {};
    //上阵的卡牌
    public lineUpCardsUuid:Array<string> = [];

    /**
     * 获取灵石抽取取得的品级
     */
    public getStoneSummonGuide(){
        var stomeSummonWeight:string[] = CONSTANT.getStoneSummonWeightArr();
        return Number(NunmberUtil.getRandomFromWeightArr(stomeSummonWeight));
    }
    /**
     * 获取视频抽取取得的品级
     */
    public getVideoSummonGuide(){
        var videoSummonWeight:string[] = CONSTANT.getVideoSummonWeightArr();
        return Number(NunmberUtil.getRandomFromWeightArr(videoSummonWeight));
    }
    /**
     * 获取抽奖获得的卡牌类型
     */
    public getSummonCardId(){
        var usedCards = this.getUsedCardsConfig();
        var weightArr:string[] =[];
        usedCards.forEach((card)=>{
            weightArr.push(card.id + ",1");
        })
        return Number(NunmberUtil.getRandomFromWeightArr(weightArr));
    }

    public getUsedCardsConfig():Array<any>{
        return CFG.getCfgByKey(ConfigConst.CardInfo,"use",1);
    }

    public summonCard(summonType:CardSummonType,stoneCost:number=0){
        //召唤卡牌
        NET.send(MsgCardSummon.createLocal(summonType,stoneCost),(msg:MsgCardSummon)=>{
            console.log(JSON.stringify(msg.resp) );

            COMMON.updateResInfo(msg.resp.retRes);
            COMMON.updateUserInfo(msg.resp.userInfo);
            this.addNewCard(msg.resp.newCard);
            COMMON.stoneSummonNum = msg.resp.stoneSummonNum;
            COMMON.videoSummonNum = msg.resp.videoSummonNum;

            EVENT.emit(GameEvent.Card_summon_Complete,{uuid:msg.resp.newCard.uuid});
            EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.lifeStone,value:stoneCost}]});
            EVENT.emit(GameEvent.UserInfo_update_Complete);
        },this)
    }

    //获得一张卡牌
    public addNewCard(card:SCardInfo){
        var newCard:CardInfo = new CardInfo();
        newCard.initFormServer(card);
        this.cardsMap[newCard.uuid] = newCard;
    }

    //根据uuid查找卡牌
    public getCardByUUid(uuid:string){
        return this.cardsMap[uuid];
    }

    public getCardCfgList(type:number){
        var list:Array<any> = null;
        if(type == 0){
            list = CFG.getCfgByKey(ConfigConst.CardInfo,"use","1");
        }else{
            list = CFG.getCfgByKey(ConfigConst.CardInfo,"raceId",type,"use",1);
        }
        return list;
    }

    //拥有的卡牌
    public getOwnerCardList(type:number):Array<CardInfo>{
        var card:CardInfo = null;
        var cardList:Array<CardInfo> = [];
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(type == 0 ||card.cardInfoCfg.raceId == type){
                cardList.push(card);
            }
        }
        return cardList;
    }

    //初始化卡牌
    public initCard(cards:Array<SCardInfo>,lineupCardsUuid:Array<string>){
        this.lineUpCardsUuid = lineupCardsUuid;
        cards.forEach((card:SCardInfo)=>{
            this.addNewCard(card);
        })
    }
}
export var Card = CardAssist.getInstance();