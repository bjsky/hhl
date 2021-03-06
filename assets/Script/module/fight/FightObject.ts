import LineupInfo from "../../model/LineupInfo";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { SkillObject, SkillProperty, BuffProperty, BuffObject, BuffType } from "./SkillLogic";
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
        }
    }

    public cardId:number = 0;
    public grade:number = 0;
    
    public skillCfg:any = null;
    public skillVal:number = 0;
    public skillId:number = 0;
    public skillName:string = "";


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
        this.originalPower = Number(lineup.power);
        this.originalToalLife = Number(lineup.life);
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
    //攻击buff
    public fightBuff:Array<BuffObject> = [];

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
        if(this.fightBuff.length>0){
            var tmp:BuffObject[] = [];
            for(var i:number = 0;i<this.fightBuff.length;i++){
                var buff:BuffObject = this.fightBuff[i];
                if(buff.buffProperty == BuffProperty.PowerValue){ //附加攻击
                    attackPower += buff.buffValue;
                }
                if(!isNaN(buff.buffLastNum)){
                    buff.buffLastNum -= 1;
                    if(buff.buffLastNum >0){
                        tmp.push(buff);
                    }
                }else{
                    tmp.push(buff);
                }
            }
            this.fightBuff = tmp;
        }
        var noDefensePower = attackPower;
        if(beAttack.skillObj!=null){
            if(beAttack.skillObj.skillProperty == SkillProperty.Dodge){
                attackPower = 0;
            }else if(beAttack.skillObj.skillProperty == SkillProperty.Absorb){
                attackPower = attackPower*(1-beAttack.skillObj.skillValue);
            }else if(beAttack.skillObj.skillProperty == SkillProperty.Revenge){
                if(attackPower>=beAttack.curLife){ //保命
                    attackPower = beAttack.curLife -1;
                }
                var buffValue = Math.floor(noDefensePower * beAttack.skillObj.skillValue);
                var addbuff:BuffObject = new BuffObject(beAttack.skillObj.skill,BuffType.Mine,BuffProperty.PowerValue,buffValue);
                beAttack.addFightBuff(addbuff,1,1);
            }
        }

        beAttack.loseLife += attackPower;
        var returnLife:number = 0;
        // var returnStr:string ="";
        if(this.skillObj!=null && this.skillObj.skillProperty == SkillProperty.ReturnBlood){
            returnLife = Math.floor(attackPower * this.skillObj.skillValue);
            if(this.loseLife - returnLife<0){
                returnLife = this.loseLife;
            }
            this.loseLife -= returnLife;
            // returnStr = "\n恢复生命"+returnLife;
        }

        this.skillObj = null;
        var action:AttackAction = new AttackAction(this,beAttack);
        action.noDefensePower  = noDefensePower;
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
        if(this.skillObj!=null ){
            if(this.skillObj.skillProperty == SkillProperty.AddPower){
                power *= this.skillObj.skillValue;
            }
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
    public addFightBuff(buff:BuffObject,superNum:number,lastNum:number){
        buff.buffSuperNum = superNum;
        buff.buffLastNum = lastNum;
        this.fightBuff.push(buff);
    }
}