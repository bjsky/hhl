import { CONSTANT } from "../../Constant";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { NET } from "../../net/core/NetController";
import MsgCardSummon, { CardSummonType, SCardInfo } from "../../net/msg/MsgCardSummon";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import CommonData, { COMMON } from "../../CommonData";
import CardInfo from "../../model/CardInfo";
import BuildInfo from "../../model/BuildInfo";
import { BUILD } from "../build/BuildAssist";
import { BuildType } from "../../view/BuildPanel";
import MsgCardUpLv from "../../net/msg/MsgCardUpLv";
import MsgCardUpStar from "../../net/msg/MsgCardUpStar";
import MsgCardDestroy from "../../net/msg/MsgCardDestroy";
import { AwardTypeEnum } from "../../view/AwardPanel";
import { SResInfo } from "../../net/msg/MsgLogin";
import MsgCardSummonGuide from "../../net/msg/MsgCardSummonGuide";
import { SOUND } from "../../manager/SoundManager";
import NumberUtil from "../../utils/NumberUtil";
import { GUIDE } from "../../manager/GuideManager";

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
    RabRemove //抢夺移除
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

    /**
     * 获取灵石抽取取得的品级
     */
    public getStoneSummonGuide(){
        var stomeSummonWeight:string[] = CONSTANT.getStoneSummonWeightArr();
        return Number(NumberUtil.getRandomFromWeightArr(stomeSummonWeight));
    }
    /**
     * 获取视频抽取取得的品级
     */
    public getVideoSummonGuide(){
        var videoSummonWeight:string[] = CONSTANT.getVideoSummonWeightArr();
        return Number(NumberUtil.getRandomFromWeightArr(videoSummonWeight));
    }
    /**
     * 获取抽奖获得的卡牌类型
     */
    public getSummonCardId(){
        var usedCards = this.getUsedCardsConfig();
        var weightArr:string[] =[];
        usedCards.forEach((card)=>{
            weightArr.push(card.id + ";1");
        })
        return Number(NumberUtil.getRandomFromWeightArr(weightArr));
    }

    public getUsedCardsConfig():Array<any>{
        return CFG.getCfgByKey(ConfigConst.CardInfo,"use",1);
    }
    
    //是否可召唤卡牌
    public get isCanSummonCard(){
        var cost:number = BUILD.getSummonStoneCostBuffed();
        return (GUIDE.isInGuide)?false:COMMON.resInfo.lifeStone>=cost;
    }
    //是否可以合成卡牌
    public get isCanComposeCard(){
        var cardCfgArr = this.getCardCfgList(0);
        var isCan:boolean  = false;
        for(var i:number = 0;i<cardCfgArr.length;i++){
            var cardId = cardCfgArr[i].id;
            isCan = isCan || this.getCardCanCompose(cardId);
        }
        return (GUIDE.isInGuide)?false:isCan;
    }
    //是否可以购买卡牌
    public get isCanBuyCard(){
        var minPrice:number =10000;
        var cfg:any = CFG.getCfgGroup(ConfigConst.Store);
        for(var key in cfg){
            var grade = Number(cfg[key].grade);
            var price = Number(cfg[key].priceDiamond);
            minPrice = Math.min(minPrice,price);
        }
        return (GUIDE.isInGuide)?false:COMMON.resInfo.diamond>=minPrice;
    }

    public summonCard(summonType:CardSummonType,stoneCost:number=0){
        //召唤卡牌
        NET.send(MsgCardSummon.create(summonType,stoneCost),(msg:MsgCardSummon)=>{
            console.log(JSON.stringify(msg.resp) );

            COMMON.updateResInfo(msg.resp.retRes);
            COMMON.updateUserInfo(msg.resp.userInfo);
            EVENT.emit(GameEvent.Show_Res_Add,{types:[{type:ResType.exp,value:0}]});
            this.addNewCard(msg.resp.newCard);
            COMMON.stoneSummonNum = msg.resp.stoneSummonNum;
            COMMON.videoSummonNum = msg.resp.videoSummonNum;

            EVENT.emit(GameEvent.Card_summon_Complete,{uuid:msg.resp.newCard.uuid});
            EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.lifeStone,value:stoneCost}]});
        },this)
    }
    public summonCardGuide(stoneCost:number = 0){
        //召唤卡牌
        NET.send(MsgCardSummonGuide.create(stoneCost),(msg:MsgCardSummonGuide)=>{
            console.log(JSON.stringify(msg.resp) );

            COMMON.updateResInfo(msg.resp.retRes);
            COMMON.updateUserInfo(msg.resp.userInfo);
            EVENT.emit(GameEvent.Show_Res_Add,{types:[{type:ResType.exp,value:0}]});
            this.addNewCard(msg.resp.newCard);
            this.addNewCard(msg.resp.upStarCard);
            COMMON.stoneSummonNum = msg.resp.stoneSummonNum;
            COMMON.videoSummonNum = msg.resp.videoSummonNum;

            EVENT.emit(GameEvent.Card_summon_Complete,{uuid:msg.resp.newCard.uuid});
            EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.lifeStone,value:stoneCost}]});
        },this)
    }

    //获得一张卡牌
    public addNewCard(card:SCardInfo){
        var newCard:CardInfo = new CardInfo();
        newCard.initFormServer(card);
        this.cardsMap[newCard.uuid] = newCard;
        EVENT.emit(GameEvent.Card_data_change,{});
    }

    //根据uuid查找卡牌
    public getCardByUUid(uuid:string){
        return this.cardsMap[uuid];
    }

    public getCardUUidRandom(){
        var list:Array<CardInfo> = this.getOwnerCardList(0);
        var rd = Math.floor(Math.random()* list.length);
        return list[rd].uuid;
    }
    //移除一张卡牌
    public removeCardByUUid(uuid:string){
        delete this.cardsMap[uuid];
        EVENT.emit(GameEvent.Card_data_change,{});
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
    public getCardSealCfgList(){
        var list:Array<any> = null;
        list = CFG.getCfgByKey(ConfigConst.CardInfo,"seal","1");
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
    public getOwnerMaxlvCardList():Array<CardInfo>{
        var card:CardInfo = null;
        var cardList:Array<CardInfo> = [];
        var cardIdMaps:any = {};
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(cardIdMaps[card.cardId] == undefined){
                cardIdMaps[card.cardId] = [card];
            }else{
                cardIdMaps[card.cardId].push(card);
            }
            // if(type == 0 ||card.cardInfoCfg.raceId == type){
            //     cardList.push(card);
            // }
        }
        for(var key in cardIdMaps){
            var cardArr:CardInfo[] = cardIdMaps[key];
            cardArr.sort((a:CardInfo,b:CardInfo)=>{
                return  b.grade - a.grade;
            })
            cardList.push(cardArr[0]);
        }
        cardList.sort((a:CardInfo,b:CardInfo)=>{
            return  b.grade - a.grade;
        })
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

    //获得合成的卡牌
    public getComposeCardInfos(cardId:number):Array<CardInfo>{
        var cardList:Array<CardInfo> = [];
        var card:CardInfo = null;
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(card.cardId == cardId){
                cardList.push(card);
            }
        }
        cardList.sort((a:CardInfo,b:CardInfo)=>{
            return  b.grade - a.grade;
        })
        return cardList;
    }

    //获取升星同星级卡牌
    // public getUpStarCardOne(info:CardInfo):CardInfo{
    //     var card:CardInfo = null;
    //     for(var uuid in this.cardsMap){
    //         card = this.cardsMap[uuid];
    //         if(card.uuid != info.uuid &&
    //             card.grade == info.grade && card.cardId == info.cardId){
    //             return card;
    //         }
    //     }
    //     return null;
    // }
    //该卡牌是否可以合成
    public getCardCanCompose(cardId:number){
        var map:any = {};
        var card:CardInfo = null;
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(card.cardId == cardId){
                if(map[card.grade]==undefined){
                    map[card.grade] = [card];
                }else{
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取卡牌品级的个数
     * @param grade 、
     */
    public getGradeCardCount(grade:number){
        var count:number = 0;
        var card:CardInfo = null;
        for(var uuid in this.cardsMap){
            card = this.cardsMap[uuid];
            if(card.grade == grade){
                count++;
            }
        }
        return count;
    }

    //初始化卡牌
    public initCard(cards:Array<SCardInfo>){
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
                var cost:SResInfo = COMMON.updateResInfo(msg.resp.resInfo);
                EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.lifeStone,value:cost.lifeStone}]});
                EVENT.emit(GameEvent.Card_update_Complete,{uuid:msg.resp.cardInfo.uuid,type:CardUpType.UpLevel});
            }
        },this);
    }
    //升星卡牌
    public upCardStar(uuid,useUUid){
        NET.send(MsgCardUpStar.create(uuid,useUUid),(msg:MsgCardUpStar)=>{
            if(msg && msg.resp){
                SOUND.playGetCardSound();
                this.updateCardInfo(msg.resp.cardInfo);
                var removeUuid = msg.resp.useCardInfo.uuid;
                this.removeCardByUUid(removeUuid);
                EVENT.emit(GameEvent.Card_update_Complete,{uuid:msg.resp.cardInfo.uuid,type:CardUpType.UpGrade});
                EVENT.emit(GameEvent.Card_Remove,{uuid:removeUuid,type:CardRemoveType.upStarRemove});
                var cost:SResInfo = COMMON.updateResInfo(msg.resp.resInfo);
                EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.gold,value:cost.gold}]});
            }
        },this);
    }
    //回收卡牌
    public destroyCard(uuid){
        NET.send(MsgCardDestroy.create(uuid),(msg:MsgCardDestroy)=>{
            if(msg && msg.resp){
                var removeUuid = msg.resp.cardUuid;
                this.removeCardByUUid(removeUuid);
                EVENT.emit(GameEvent.Card_Remove,{uuid:removeUuid,type:CardRemoveType.destroyRemove});
                var cost:SResInfo = COMMON.updateResInfo(msg.resp.resInfo);
                EVENT.emit(GameEvent.Show_AwardPanel,{type:AwardTypeEnum.CardDestroyAward,arr:[{type:ResType.lifeStone,value:cost.lifeStone}]})
            }
        },this)
    }

    public updateCardInfo(info:SCardInfo){
        var cardInfo:CardInfo = this.getCardByUUid(info.uuid);
        cardInfo.updateInfo(info);
        EVENT.emit(GameEvent.Card_data_change,{});
    }


}
export var Card = CardAssist.getInstance();