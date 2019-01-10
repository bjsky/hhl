import CardInfo from "./CardInfo";
import { Card } from "../module/card/CardAssist";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { SOwnerLineup } from "../net/msg/MsgLogin";

export default class LineupInfo{
    //是否自己的卡牌
    public isOwner:boolean = false;
    //位置
    public pos:number = 0;
    //uuid
    public uuid:string = "";
    //uid
    public cardId:number = 0;
    //品级
    public grade:number = 0;
    //等级
    public level:number = 0;
    //战斗力
    public power:number = 0;
    //头像
    public headUrl:string ="";

    //自己的阵容
    public initOwner(lineup:SOwnerLineup){
        this.isOwner = true;
        this.pos = lineup.pos;
        this.uuid = lineup.uuid;
        var card:CardInfo = Card.getCardByUUid(lineup.uuid);
        if(card){
            this.cardId = card.cardId;
            this.power = card.carUpCfg.power;
            this.grade = card.carUpCfg.grade;
            this.level = card.carUpCfg.level;
            this.headUrl = card.cardInfoCfg.head;
        }
    }

    public updateOwner(){
        var card:CardInfo = Card.getCardByUUid(this.uuid);
        if(card){
            this.cardId = card.cardId;
            this.power = card.carUpCfg.power;
            this.grade = card.carUpCfg.grade;
            this.level = card.carUpCfg.level;
            this.headUrl = card.cardInfoCfg.head;
        }
    }
    //boss阵容
    public initBoss(index:number,cardId:number,grade:number,level:number){
        this.pos = index;
        this.cardId = cardId,
        this.grade = grade;
        this.level = level;
        var upCfg = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this.grade,"level",this.level);
        this.power = Number(upCfg[0].power);
        var cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,cardId);
        this.headUrl = cardCfg.head;
    }
}