import { SBattleInfo, SFightRecord } from "../net/msg/MsgLogin";
import { CONSTANT } from "../Constant";
import { COMMON } from "../CommonData";
import ColorUtil from "../utils/ColorUtil";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import StringUtil from "../utils/StringUtil";
import { SCPushFightCard } from "../net/msg/MsgPushFightCard";

export class FightRecord{
    //时间;毫秒
    public time:number = 0;
    //攻击者id
    public fightUId:string = ""
    //攻击者名字
    public fightName:string ="";
    //被攻击者id
    public befightUId:string = ""
    //被攻击者名字
    public befightName:string = ""
    //积分变动
    public score:number =0;
    //是否抢夺卡牌
    public isRabCard:boolean = false;
    //抢夺卡牌uuid
    public rabCardUuid:string = "";
    //抢夺卡牌id
    public rabCardId:number = 0;
    //抢夺卡牌品级
    public rabCardGrade:number = 0;

    public initFromServer(info:SFightRecord){
        this.time = info.time;
        this.fightUId = info.fightUid;
        this.fightName = info.fightName;
        this.befightUId = info.befightUid;
        this.befightName = info.befightName;
        this.score = info.score;
        this.isRabCard = info.isRabCard;
        this.rabCardUuid = info.uuid;
        this.rabCardId = info.rabCardId;
        this.rabCardGrade = info.rabCardGrade;
    }
    public initFromPush(info:SCPushFightCard,score:number){
        this.time = info.time;
        this.fightUId = info.fightEnemyUid;
        this.fightName = info.fightEnemyName;
        this.befightUId = COMMON.accountId;
        this.befightName = COMMON.userInfo.name;
        this.score = score;
        if(info.rabCard!=null){
            this.isRabCard = true;
            this.rabCardUuid = info.rabCard.uuid;
            this.rabCardId = info.rabCard.cardId;
            this.rabCardGrade = info.rabCard.grade;
        }else{
            this.isRabCard = false;
        }
    }

    public getDescHtml(fighterUid:string):string{
        var time = Math.floor((COMMON.getServerTime() - this.time)/1000);
        var timeStr:string = StringUtil.formatReadableTime(time,true)+ "前";
        var fightName:string = this.fightName;
        var beFightName:string =this.befightName;
        var score:string =this.score.toString();
        var isFight:boolean = (this.fightUId == fighterUid);
        var isRab:boolean = this.isRabCard;
        if(isRab){
            var cardGrade:string = this.rabCardGrade+"星";
            var cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this.rabCardId);
            var cardName:string = cardCfg.name;
            var cardColor:string = ColorUtil.getGradeColorHex(this.rabCardGrade);
        }
        var str = "";
        if(score == "0"){
            return str;
        }
        if(isFight){
            str ="<color=#D35C21>["+timeStr+"]</c> 攻击<color=#1A60DD>"+beFightName+"</c>获得胜利，"+
            "积分<color=#D50336>＋"+score+"</c>";
            if(isRab){
                str+="<br />抢夺了对方的"+cardGrade+"卡牌：<color="+cardColor+">"+cardName+"</c>"
            }
            str = ("<color=#7d7d3f>"+str+"</c>");
        }else{
            str ="<color=#D35C21>["+timeStr+"]</c> 被<color=#1A60DD>"+fightName+"</c>攻击，"+
            "积分<color=#D50336>－"+score+"</c>";
            if(isRab){
                str+="<br />被抢夺了"+cardGrade+"卡牌：<color="+cardColor+">"+cardName+"</c>"
            }
            str = ("<color=#7D3F3F>"+str+"</c>");
        }
        return str;
    }
}
export default class BattleInfo{

    //行动点
    public actionPoint:number = 0;
    //行动点恢复开始时间
    public apStartTime:number = 0;
    //复仇开始时间
    public revengeStartTime:number = 0;
    //积分
    public score:number = 0;
    
    //总行动力
    public totalAP:number = 0;
    //行动力恢复时间
    public apReturnTime:number = 0;
    //复仇恢复时间
    public revengeReturnTime:number = 0;

    //行动力百分比
    public get apPro(){
        var pro = this.actionPoint/this.totalAP;
        return (pro>1)?1:(pro<0?0:pro);
    }
    //复仇时间(毫秒)
    public get revengeTime():number{
        if(this.revengeStartTime<=0){
            return 0;
        }else{
            var time = (this.revengeStartTime+this.revengeReturnTime*1000)-COMMON.getServerTime();
            if(time>0){
                return time;
            }else{
                return 0;
            }
        }
    }
    public get revengeTimePro(){
        var pro = this.revengeTime/(this.revengeReturnTime*1000);
        return (pro>1)?1:(pro<0?0:pro);
    }

    public initFromServer(info:SBattleInfo){
        this.actionPoint = info.actionPoint;
        this.apStartTime = info.apStartTime;
        this.score = info.score;
        this.revengeStartTime = info.revengeStartTime;

        this.totalAP = CONSTANT.getActionPointMax();
        this.apReturnTime = CONSTANT.getActionPointPerTime();
        this.revengeReturnTime = CONSTANT.getRevengeTime();
    }

    public cloneServerInfo():SBattleInfo{
        var info:SBattleInfo = new SBattleInfo();
        info.actionPoint = this.actionPoint;
        info.apStartTime = this.apStartTime;
        info.score = this.score;
        info.revengeStartTime = this.revengeStartTime;
        return info;
    }
}