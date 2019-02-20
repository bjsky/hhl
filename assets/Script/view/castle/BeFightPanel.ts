import PopUpBase from "../../component/PopUpBase";
import { FightRecord } from "../../model/BattleInfo";
import { COMMON } from "../../CommonData";
import ColorUtil from "../../utils/ColorUtil";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";

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

export enum BeFightPanelType{
    Outline = 0,    //离线
    BeFight         //被攻击
}

@ccclass
export default class BeFightPanel extends PopUpBase {

    @property(cc.Node)
    nodeOutlineTitle: cc.Node = null;
    @property(cc.Node)
    nodeBeFightTitle: cc.Node = null;
    @property(cc.RichText)
    richText: cc.RichText = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _type:BeFightPanelType = 0;
    private _records:Array<FightRecord> = [];
    public setData(data:any){
        super.setData(data);
        this._type = data.type;
        this._records = data.records;
    }

    onEnable(){
        super.onEnable();
        if(this._type == BeFightPanelType.Outline){
            this.nodeOutlineTitle.active = true;
            this.nodeBeFightTitle.active = false;
            this.richText.string = this.getOutlineText();
        }else if(this._type == BeFightPanelType.BeFight){
            this.nodeOutlineTitle.active = false;
            this.nodeBeFightTitle.active = true;
            this.richText.string = this.getBefightText();
        }
    }

    private getOutlineText():string{
        var beRabArr:FightRecord[] = [];
        // var fightCount:number = 0;
        // var scoreTotal:number = 0;
        var nameArrStr:string = "";
        var cardArrStr:string = "";
        this._records.forEach((record:FightRecord)=>{
            if(record.befightUId == COMMON.accountId ){//&& record.score>0
                // fightCount++;
                // scoreTotal+= record.score;
                if(record.isRabCard){
                    nameArrStr+=(record.fightName+"，");
                    var cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,record.rabCardId);
                    var cardStr = record.rabCardGrade+"星<color="+ColorUtil.getGradeColorHex(record.rabCardGrade)+
                    ">"+cardCfg.name+"</c>";
                    cardArrStr+= cardStr+"，";
                    beRabArr.push(record);
                }
            }
        })
        if(nameArrStr!=""){
            nameArrStr = nameArrStr.substr(0,nameArrStr.length-1);
        }
        if(cardArrStr!=""){
            cardArrStr = cardArrStr.substr(0,cardArrStr.length-1);
        }
        var rabOnlyStr:string = (beRabArr.length>1)?"分别":"";
        // var rabStr:string = (nameArrStr!="")?
        // ("其中<color=#1A60DD>"+nameArrStr+"</c>"+rabOnlyStr+"抢夺了你的卡牌："+cardArrStr+"<br />"):"";
        // var str:string ="<color=#7D3F3F>主人，您不在线期间，有 <color=#29b92f>"+fightCount+"</c> 位玩家攻击了您，"+
        // "您的积分<color=#D50336>－"+scoreTotal+"</c><br />"+ rabStr +"君子报仇，十年不晚，快去提升自己的实力吧！</color>";
        var rabStr = "玩家<color=#1A60DD>"+nameArrStr+"</c>"+rabOnlyStr+"抢夺了你的卡牌："+cardArrStr;
        var str = "<color=#7D3F3F>主人，您不在线期间，"+ rabStr +"<br />君子报仇，十年不晚，快去提升自己的实力吧！</color>"
        return str;
    }
    private getBefightText():string{
        var str="";
        if(this._records.length>0){
            var record = this._records[0];
            var fightName:string = record.fightName;
            var score:string = record.score.toString();
            var cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,record.rabCardId);
            var cardStr = record.rabCardGrade+"星<color="+ColorUtil.getGradeColorHex(record.rabCardGrade)+
                ">"+cardCfg.name+"</c>";
            // str ="<color=#7D3F3F>主人，刚刚玩家 <color=#1A60DD>"+fightName+"</c> 攻击了您，"+
            // "您的积分<color=#D50336>－"+score+"</c><br />敌人抢走了你的卡牌："+cardStr+"<br />"+
            // "复仇抢夺双倍概率，不是不报，时候未到！</color>";

            str = "<color=#7D3F3F>主人，刚刚玩家 <color=#1A60DD>"+fightName+"</c> 抢走了你的卡牌："+cardStr+"<br />"+
            "复仇抢夺双倍概率，不是不报，时候未到！</color>";
        }
        return str;
    }
    onDisable(){
        super.onDisable();

    }
    start () {

    }

    // update (dt) {}
}
