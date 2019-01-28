import { SCardInfo } from "./MsgCardSummon";
import { SResInfo, SUserInfo } from "./MsgLogin";
import NetConst from "../NetConst";
import MessageBase from "./MessageBase";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";
import { CONSTANT } from "../../Constant";

//卡牌召唤客户端数据
export class CSCardSummonGuide{
    //消耗灵石（客户端算）
    public stoneCost:number = 0;
}
//卡牌召唤服务器数据,固定抽取2星级卡牌，并返回另一张相同cardId的2星卡牌
export class SCCardSummonGuide{
    //获得的卡牌；
    public newCard:SCardInfo = null;
    //同样星级的另一张相同卡，用于合成
    public upStarCard:SCardInfo = null;
    //最新的res
    public retRes:SResInfo = null;
    //经验等级
    public userInfo:SUserInfo = null;
    //更新灵石抽奖次数
    public stoneSummonNum:number = 0;
    //更新视频抽奖次数
    public videoSummonNum:number = 0;

    public static parse(obj:any):SCCardSummonGuide{
        var data:SCCardSummonGuide = new SCCardSummonGuide();
        data.newCard = SCardInfo.parse(obj.newCard);
        data.upStarCard = SCardInfo.parse(obj.upstarCard);
        data.retRes = SResInfo.parse(obj.retRes);
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.stoneSummonNum = obj.stoneSummonNum;
        data.videoSummonNum = obj.videoSummonNum;
        return data;
    }
}

export default class MsgCardSummonGuide extends MessageBase{
    public param:CSCardSummonGuide;
    public resp:SCCardSummonGuide;

    constructor(){
        super(NetConst.CardSummonGuide);
        // this.isLocal = true;
    }

    public static create(stoneCost){
        var msg = new MsgCardSummonGuide();
        msg.param = new CSCardSummonGuide();
        msg.param.stoneCost = stoneCost;
        return msg;
    }


    public respFromLocal(){
        var cardInfo = MsgCardSummonGuide.randomCardInfo();
        var upStarCard = this.copyCard(cardInfo);
        var retRes:SResInfo = COMMON.resInfo.cloneServerInfo();
        retRes.lifeStone -= this.param.stoneCost;
        // var card:any = CFG.getCfgDataById(ConfigConst.CardInfo,cardInfo.cardId);
        var getExp = CONSTANT.getSummonStoneExpGet();
        var userInfo = COMMON.userInfo.cloneAddExpServerInfo(getExp); //card.summonGetExp
        var json:any ={
            newCard:cardInfo,
            upStarCard:upStarCard,
            retRes:retRes,
            userInfo:userInfo,
            stoneSummonNum:COMMON.stoneSummonNum+1,
            videoSummonNum:COMMON.videoSummonNum
        };
        return this.parse(json);
    }

    public static randomCardInfo(){
        var cardUUid:string = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        var cardId = Card.getSummonCardId();
        var cardInfo = {
            uuid:cardUUid,
            level:1,
            cardId:cardId,
            grade:2,
            skillLevel:1
        }
        return cardInfo;
    }
    private copyCard(card:any){
        var uuid = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        var copy:any = {uuid:uuid,level:1,cardId:card.cardId,grade:card.grade,skillLevel:1}
        return copy;
    }

    private parse(obj:any):MessageBase{
        this.resp = SCCardSummonGuide.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}