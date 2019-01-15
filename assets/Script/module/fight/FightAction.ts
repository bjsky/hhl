import FightObject, { SkillInfo } from "./FightObject";
import { Fight } from "./FightAssist";
import { SkillProperty, SkillObject, BuffProperty, BuffObject } from "./SkillLogic";

export default class FightAction{
    private _desc:string ="";
    public set desc(str:string){
        this._desc = str;
    }

    public get desc():string{
        return this._desc;
    }
}
export class AttackAction extends FightAction{
    //受到伤害
    public attackPower:number = 0;
    //是否阵亡
    public isEnemyDead:boolean = false;
    //回血
    public returnBlood:number = 0;
}

export class BuffAction extends FightAction{
    //是否本队
    public isMyTeam:boolean = false;
    //卡牌名
    public cardName:string = "";
    //技能
    public skill:SkillInfo = null;
 
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

     
    constructor(isMyTeam:boolean,cardName:string,skill:SkillInfo){
        super();
        this.isMyTeam = isMyTeam;
        this.cardName = cardName;
        this.skill = skill;
    }

    public applyBuff(){
        this.buffPos.forEach((pos:number)=>{
            var fo:FightObject = Fight.fight.getFightObj(this.isMyTeam,pos);
            var buff:BuffObject = new BuffObject(this.skill,this.buffType,this.buffProperty,this.buffValue);
            fo.addBuff(buff);
        })
    }

    public get desc():string{
        var desc:string =this.isMyTeam?"［己方］":"［敌方］";
        desc +=(this.cardName + "获得了［"+this.skill.skillName+"］:"+this.skill.skillDesc);
        return desc;
    }
}

export class SkillAction extends FightAction{
    //是否本队
    public isMyTeam:boolean = false;
    //卡牌名
    public cardName:string = "";
    //技能
    public skill:SkillInfo = null;

    public skillProperty:SkillProperty  = 0;
    public skillValue:number = 0;

    constructor(isMyTeam:boolean,cardName:string,skill:SkillInfo){
        super();
        this.isMyTeam = isMyTeam;
        this.cardName = cardName;
        this.skill = skill;
    }

    public applySkill(fightObj:FightObject){
        var skillObj =  new SkillObject(this.skill,this.skillProperty,this.skillValue);
        fightObj.skillObj = skillObj;
    }

    public get desc():string{
        var desc:string =this.isMyTeam?"［己方］":"［敌方］";
        desc +=(this.cardName + "获得了［"+this.skill.skillName+"］:"+this.skill.skillDesc);
        return desc;
    }
}
