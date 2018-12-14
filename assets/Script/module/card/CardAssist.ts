import { CONSTANT } from "../../Constant";
import NunmberUtil from "../../utils/NumberUtil";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { NET } from "../../net/core/NetController";
import MsgCardSummon, { CardSummonType } from "../../net/msg/MsgCardSummon";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import { COMMON } from "../../CommonData";

export default class CardAssist{
    private static _instance: CardAssist = null;
    public static getInstance(): CardAssist {
        if (CardAssist._instance == null) {
            CardAssist._instance = new CardAssist();
            
        }
        return CardAssist._instance;
    }

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
            COMMON.stoneSummonNum = msg.resp.stoneSummonNum;
            COMMON.videoSummonNum = msg.resp.videoSummonNum;

            EVENT.emit(GameEvent.Card_summon_Complete);
            EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.lifeStone,value:stoneCost}]});
            EVENT.emit(GameEvent.UserInfo_update_Complete);
        },this)
    }
}
export var Card = CardAssist.getInstance();