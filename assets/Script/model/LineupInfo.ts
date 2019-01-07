import { SLineupCard } from "../net/msg/MsgLogin";
import CardInfo from "./CardInfo";
import { Card } from "../module/card/CardAssist";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";

export default class LineupInfo{
    //位置
    public pos:number = 0;
    //uuid
    public uuid:string ="";
    //战斗力
    public power:number = 0;
    //品级
    public grade:number = 0;
    //等级
    public level:number = 0;
    //头像
    public headUrl:string ="";

    public initFromServer(info:SLineupCard){
        this.pos = info.pos;
        this.uuid = info.uuid;
        var card:CardInfo = Card.getCardByUUid(this.uuid);
        if(card){
            this.power = card.carUpCfg.power;
            this.grade = card.carUpCfg.grade;
            this.level = card.carUpCfg.level;
            this.headUrl = card.cardInfoCfg.head;
        }
    }

    public initFromCfg(index:number,cardId:number,grade:number,level:number){
        this.pos = index;
        this.grade = grade;
        this.level = level;
        var upCfg = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this.grade,"level",this.level);
        this.power = Number(upCfg[0].power);
        var cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,cardId);
        this.headUrl = cardCfg.head;
    }

    public equalTo(lineup:LineupInfo):boolean{
        if(this.uuid!=""){
            return this.uuid == lineup.uuid;
        }else{
            return this.power == lineup.power && 
            this.grade == lineup.grade && 
            this.level== lineup.level && 
            this.headUrl == lineup.headUrl
        }
    }
}