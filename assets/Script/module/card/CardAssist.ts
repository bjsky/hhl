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
import BuildInfo from "../../model/BuildInfo";
import { BUILD } from "../build/BuildAssist";
import { BuildType } from "../../view/BuildPanel";
import MsgCardUpLv from "../../net/msg/MsgCardUpLv";
import MsgCardUpStar from "../../net/msg/MsgCardUpStar";

export enum CardRaceType{
    All =0,
    WuZu = 1,   //巫族
    YaoZu,      //妖族
    XianJie,    //仙界
    RenJie      //人界
}

export enum CardUpType{
    UpLevel = 0,    //升级等级
    UpGrade,    //升级星级
}
export enum CardRemoveType{
    upStarRemove = 0,//升星移除
    destroyRemove,//回收移除
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
        NET.send(MsgCardSummon.create(summonType,stoneCost),(msg:MsgCardSummon)=>{
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
    //移除一张卡牌
    private removeCardByUUid(uuid:string){
        delete this.cardsMap[uuid];
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

    //按照类型卡牌列表
    public getOwnerCardListMap():any{
        var map:any ={};
        var card:CardInfo = null;
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(map[card.cardInfoCfg.raceId]== undefined){
                map[card.cardInfoCfg.raceId] = [];
            }
            map[card.cardInfoCfg.raceId].push(card);
        }
        return map;
    }

    //获取升星同星级卡牌
    public getUpStarCardOne(info:CardInfo):CardInfo{
        var card:CardInfo = null;
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(card.uuid != info.uuid &&
                card.grade == info.grade && card.cardId == info.cardId){
                return card;
            }
        }
        return null;
    }

    //初始化卡牌
    public initCard(cards:Array<SCardInfo>,lineupCardsUuid:Array<string>){
        this.lineUpCardsUuid = lineupCardsUuid;
        cards.forEach((card:SCardInfo)=>{
            this.addNewCard(card);
        })
    }

    //获取加成后的升级消耗
    public getUpLvCostBuffed(cost:number){
        var build:BuildInfo = BUILD.getBuildInfo(BuildType.Hero);
        if(build){
            var buffedValue = build.buildLevelCfg.addValue;
            cost *= (1-buffedValue)
        }
        return Number(Math.ceil(cost).toFixed(0));
    }
    
    //升级卡牌
    public upCardLv(uuid,cost){
        NET.send(MsgCardUpLv.create(uuid,cost),(msg:MsgCardUpLv)=>{
            if(msg && msg.resp){
                this.updateCardInfo(msg.resp.cardInfo);
                COMMON.updateResInfo(msg.resp.resInfo);
                EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.lifeStone,value:cost}]});
                EVENT.emit(GameEvent.Card_update_Complete,{uuid:msg.resp.cardInfo.uuid,type:CardUpType.UpLevel});
            }
        },this);
    }
    //升星卡牌
    public upCardStar(uuid,useUUid){
        NET.send(MsgCardUpStar.create(uuid,useUUid),(msg:MsgCardUpStar)=>{
            if(msg && msg.resp){
                this.updateCardInfo(msg.resp.cardInfo);
                var removeUuid = msg.resp.useCardUuid;
                this.removeCardByUUid(removeUuid);
                EVENT.emit(GameEvent.Card_update_Complete,{uuid:msg.resp.cardInfo.uuid,type:CardUpType.UpGrade});
                EVENT.emit(GameEvent.Card_Remove,{uuid:removeUuid,type:CardRemoveType.destroyRemove});
            }
        },this);
    }

    public updateCardInfo(info:SCardInfo){
        var cardInfo:CardInfo = this.getCardByUUid(info.uuid);
        cardInfo.updateInfo(info);
    }


}
export var Card = CardAssist.getInstance();