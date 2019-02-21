import FightObject, { SkillInfo } from "./FightObject";
import { Fight } from "./FightAssist";
import { SkillProperty, SkillObject, BuffProperty, BuffObject, BuffType } from "./SkillLogic";

export default class FightAction{
    // //是否本队
    // public isMyTeam:boolean = false;
    // //技能
    // public skill:SkillInfo = null;

    // constructor(isMyTeam:boolean,skill:SkillInfo){
    //     this.isMyTeam = isMyTeam;
    //     this.skill = skill;
    // }
    public attackObj:FightObject = null;

    constructor(fo:FightObject){
        this.attackObj = fo;
    }
    protected getTeamHtmlDesc():string{
        return "<color=#530000>"+(this.attackObj.isMyTeam?"［己方］":"［敌方］")+"</color>";
    }
    protected getSkillHtmlDesc():string{
        var skillDesc = this.attackObj.skill.skillCfg.skillDesc;
        var value = "<color=#29b92f>" + (Math.round(this.attackObj.skill.skillVal*1000)/10).toString()+"</color>";
        skillDesc = skillDesc.replace("#",value);
        return "<color=#29b92f>" +this.attackObj.lineup.cardName + "</color>获得了"+
            "<color=#D43F97>［"+this.attackObj.skill.skillName+"］</color>:"+
            skillDesc;
    }
}
export class AttackAction extends FightAction{
    constructor(attack:FightObject,beAttack:FightObject){
        super(attack)
        this.beAttackObj = beAttack;
    }

    public beAttackObj:FightObject = null;
    //不抵抗伤害
    public noDefensePower:number = 0;
    //受到伤害
    public attackPower:number = 0;
    //是否阵亡
    public isEnemyDead:boolean = false;
    //回血
    public returnBlood:number = 0;

    public getHtmlDesc():string{ 
        var str = "<color=#29b92f>"+this.attackObj.lineup.cardName +"</color>对"+
        "<color=#29b92f>"+ this.beAttackObj.lineup.cardName +"</color>造成"+
        "<color=#D42834>"+this.attackPower+"</color>伤害，剩余生命："+
        "<color=#29b92f>"+this.beAttackObj.curLife +"</color>";
        return this.getTeamHtmlDesc() + str;
    }
}

export class BuffAction extends FightAction{
    //buff类型
    public buffType:number = 0;
    //buff属性
    public buffProperty:BuffProperty = 0;
    //buff值
    public buffValue:number = 0;
    //起始位置
    public fromPos:number = 0;
    //buff位置
    public buffPos:number[] = [];
    //叠加次数
    public buffSuperNum:number = 0;
    //持续次数
    public buffLastNum:number = NaN;
    // nodeUUid
    public nodeUuid:string = "";
    public applyBuff(){
        this.buffPos.forEach((pos:number)=>{
            var fo:FightObject = Fight.fight.getFightObj(this.attackObj.isMyTeam,pos);
            var buff:BuffObject = new BuffObject(this.attackObj.skill,this.buffType,this.buffProperty,this.buffValue);
            fo.addBuff(buff);
        })
    }
    
    public getHtmlDesc():string{
        return this.getTeamHtmlDesc() + this.getSkillHtmlDesc();
    }
}

export class SkillAction extends FightAction{
    public skillProperty:SkillProperty  = 0;
    public skillValue:number = 0;

    //攻击提示
    public attackStr:string ="";
    //技能效果
    public skillBuff:BuffAction = null;
    public applySkill(fightObj:FightObject){
        var skillObj =  new SkillObject(this.attackObj.skill,this.skillProperty,this.skillValue);
        fightObj.skillObj = skillObj;
    }

    public updateSkill(attack:AttackAction){
        if(this.skillProperty== SkillProperty.Dodge){
            this.attackStr = "闪避";
        }else if(this.skillProperty == SkillProperty.Revenge 
            &&attack.attackPower!=attack.noDefensePower)
        {
            this.attackStr ="护身";
        }
        if(this.skillProperty == SkillProperty.Revenge){
            var buff:BuffAction = new BuffAction(this.attackObj);
            buff.buffProperty = BuffProperty.PowerValue;
            var buffValue = Math.floor(attack.noDefensePower * this.skillValue);
            buff.buffValue = buffValue;
            buff.buffType = BuffType.Mine;
            buff.buffSuperNum = 1;
            buff.buffLastNum = 1;
            this.skillBuff = buff;
        }
    }
    
    public getHtmlDesc():string{
        return this.getTeamHtmlDesc() + this.getSkillHtmlDesc();
    }
}
