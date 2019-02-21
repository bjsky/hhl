import {SkillAction, AttackAction } from "./FightAction";
import FightObject from "./FightObject";
import { Fight } from "./FightAssist";

//单次攻击
export default class FightOnce{
    constructor(attack,beAttack){
        this.attackObj = attack;
        this.beAttackObj = beAttack;

        this.attackSkill = Fight.skill.checkAttackSkill(this.attackObj,this.beAttackObj);
        if(this.attackSkill!=null){
            this.attackSkill.applySkill(this.attackObj);
        }
        this.beAttackSkill = Fight.skill.checkBeAttackSill(this.beAttackObj);
        if(this.beAttackSkill!=null){
            this.beAttackSkill.applySkill(this.beAttackObj);
        }
    }
    //攻击方
    public attackObj:FightObject = null;
    //被攻击方
    public beAttackObj:FightObject = null;

    //准备攻击
    public attackSkill:SkillAction  = null;
    //攻击
    public attack:AttackAction = null;
    //被攻击
    public beAttackSkill:SkillAction = null;

    public fight(){
        this.attack = this.attackObj.fight(this.beAttackObj);
    }

    public getOnceHtmlDesc():string{
        var str:string ="";
        if(this.attackSkill!=null){
            str += (this.attackSkill.getHtmlDesc()+"<br/>");
        }
        str += (this.attack.getHtmlDesc()+"<br/>");
        if(this.beAttackSkill!=null){
            str += (this.beAttackSkill.getHtmlDesc() +"<br/>");
        }
        str = str.substring(0,str.length - 5);
        return str;
    }
}