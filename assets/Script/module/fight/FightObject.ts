import LineupInfo from "../../model/LineupInfo";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { SkillObject, SkillProperty, BuffProperty, BuffObject } from "./SkillLogic";
import { AttackAction } from "./FightAction";

export class SkillInfo{
    constructor(cardId:number,grade:number){
        this.cardId = cardId;
        this.grade = grade;

        var cfg = CFG.getCfgByKey(ConfigConst.CardSkill,"cardId",this.cardId)[0];
        if(cfg!=null|| cfg!=undefined){
            var num = Number(cfg.value) + (this.grade-1) * Number(cfg.addValue);
            this.skillCfg = cfg;
            this.skillVal = num;
            this.skillId = Number(cfg.id);
            this.skillName = cfg.name;
            var skillDesc = cfg.skillDesc;
            var value = (Math.round(this.skillVal*1000)/10).toString();
            this.skillDesc = skillDesc.replace("#",value);
        }
    }

    public cardId:number = 0;
    public grade:number = 0;
    
    public skillCfg:any = null;
    public skillVal:number = 0;
    public skillId:number = 0;
    public skillName:string = "";
    public skillDesc:string = "";

}
export class FightTeamObject{
    //队伍数组，不包括空队伍
    public fightObjArr:Array<FightObject> = [];
    //当前出战次序
    public fightIndex:number = 0;

    public getFightObj():FightObject{
        if(this.fightIndex<this.fightObjArr.length){
            return this.fightObjArr[this.fightIndex];
        }else{
            return null;
        }
    }

    public next():boolean{
        this.fightIndex ++;
        if(this.fightIndex>=this.fightObjArr.length){
            return true;
        }
        return false;
    }

    //获得种族位置
    public getRacePos(arr:number[]):number[]{
        var pos:number[] = [];
        this.fightObjArr.forEach((info:FightObject)=>{
            if(arr.indexOf(Number(info.lineup.raceId))>-1){
                pos.push(info.lineup.pos);
            }
        })
        return pos;
    }
}


export default class FightObject{
    constructor(lineup:LineupInfo,isMyTeam:boolean){
        this.lineup = lineup;
        this.isMyTeam = isMyTeam;
        this.originalToalLife = this.originalPower = Number(lineup.power);
        this.loseLife = 0;
        this.skill = new SkillInfo(this.lineup.cardId,this.lineup.grade);
    }
    public isMyTeam:boolean =false;
    //阵容
    public lineup:LineupInfo = null;
    //技能info
    public skill:SkillInfo = null;
    //技能obj
    public skillObj:SkillObject = null;
    //加成
    public buff:Array<BuffObject> = [];

    public originalPower:number = 0;
    public originalToalLife:number = 0;
    //丢失生命
    public loseLife:number = 0;

    //是否已阵亡
    public get isDead(){
        return this.curLife <= 0;
    }
    //攻击
    public fight(beAttack:FightObject):AttackAction{
        var attackPower:number = this.buffedPower;
        if(this.skillObj!= null && this.skillObj.skillProperty == SkillProperty.PowerAttachLife){
            attackPower += beAttack.buffedTotalLife*this.skillObj.skillValue;
        }
        if(beAttack.skillObj!=null){
            if(beAttack.skillObj.skillProperty == SkillProperty.Dodge){
                attackPower = 0;
            }else if(beAttack.skillObj.skillProperty == SkillProperty.Absorb){
                attackPower = Number(Number(attackPower*beAttack.skillObj.skillValue).toFixed(0));
            }
        }

        beAttack.loseLife += attackPower;
        var returnLife:number = 0;
        var returnStr:string ="";
        if(this.skillObj!=null && this.skillObj.skillProperty == SkillProperty.ReturnBlood){
            returnLife = this.buffedTotalLife*this.skillObj.skillValue;
            if(this.loseLife - returnLife<0){
                returnLife = this.loseLife;
            }
            this.loseLife -= returnLife;
            returnStr = "\n恢复生命"+returnLife;
        }

        var action:AttackAction = new AttackAction();
        var desc:string =this.isMyTeam?"［己方］":"［敌方］";
        desc += this.lineup.cardName +"对"+ beAttack.lineup.cardName +"造成"+attackPower+"伤害，剩余生命："+beAttack.curLife;
        desc += returnStr;
        action.desc = desc;
        action.attackPower = attackPower;
        action.isEnemyDead = beAttack.isDead;
        action.returnBlood = returnLife;
        return action;
    }

    public get buffedPower(){
        var poweradd:number = 0;
        this.buff.forEach((bo:BuffObject)=>{
            if(bo.buffProperty == BuffProperty.Power){
                poweradd+= bo.buffValue;
            }
        })
        var power = this.originalPower * (1+poweradd);
        if(this.skillObj!=null && this.skillObj.skillProperty == SkillProperty.AddPower){
            power *= this.skillObj.skillValue;
        }
        return power;
    }

    public get buffedTotalLife(){
        var lifeadd:number = 0;
        this.buff.forEach((bo:BuffObject)=>{
            if(bo.buffProperty == BuffProperty.Life){
                lifeadd+= bo.buffValue;
            }
        })
        return this.originalToalLife * (1+lifeadd);
    }

    public get curLife(){
        var cur =  this.buffedTotalLife - this.loseLife
        return cur<0?0:cur;
    }

    public addBuff(buff:BuffObject){
        this.buff.push(buff);
    }
}