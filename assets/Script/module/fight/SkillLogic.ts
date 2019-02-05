import FightObject, { FightTeamObject, SkillInfo } from "./FightObject";
import { BuffAction, SkillAction } from "./FightAction";
import { CardRaceType } from "../card/CardAssist";
import { Fight } from "./FightAssist";


export enum BuffProperty{
    Power = 1,
    Life,
}

export enum BuffType{
    Mine = 1,
    Team ,
    Debuff,
}

export class BuffObject{
    constructor(skill,type,property,value){
        this.skill = skill;
        this.buffType = type;
        this.buffProperty = property;
        this.buffValue = value;
    }
    //技能
    public skill:SkillInfo = null;
    //buff类型
    public buffType:number = 0;
    //buff属性
    public buffProperty:BuffProperty = 0;
    //buff值
    public buffValue:number = 0;
}

export enum SkillProperty{
    AddPower = 1,
    // AddLife,
    Dodge,//闪避
    Absorb, //吸收
    ReturnBlood, //回血
    PowerAttachLife  //攻击附加生命
}

export class SkillObject{
    constructor(skill,property,value){
        this.skill = skill;
        this.skillProperty = property;
        this.skillValue = value;
    }
    //技能
    public skill:SkillInfo = null;
    //buff属性
    public skillProperty:SkillProperty = 0;
    //buff值
    public skillValue:number = 0;
}

export default class SkillLogic{

    public checkSkillReadyBuff(fo:FightObject):BuffAction{
        var buff:BuffAction = null;
        var skillId:number = fo.skill.skillId;
        switch(skillId){

            case 1: //暴虐之力
            case 3: //巨人之躯
            {
                buff = new BuffAction(fo);
                buff.buffType = BuffType.Mine;
                var property:BuffProperty;
                if(skillId == 1){
                    property = BuffProperty.Power;
                }else if(skillId == 3){
                    property  = BuffProperty.Life;
                }
                buff.buffProperty = property;
                buff.buffValue = fo.skill.skillVal;
                buff.buffPos = [fo.lineup.pos];
                buff.fromPos = fo.lineup.pos;
            }break;
            case 6: //魔君统御
            case 9: //十日光辉
            case 13:    //琴瑟之音
            case 19:    //大智若愚
            {
                var pos:number[] = [];
                var hasBuff:boolean =false;
                var team:FightTeamObject = Fight.fight.getTeam(fo.isMyTeam);
                if(skillId == 6 || skillId == 9){
                     pos = team.getRacePos([CardRaceType.WuZu,CardRaceType.YaoZu]);
                     if(pos.length>0){
                         hasBuff=true;
                     }
                }else if(skillId == 13 || skillId == 19){
                    pos = team.getRacePos([CardRaceType.RenJie,CardRaceType.XianJie]);
                    if(pos.length>0){
                        hasBuff=true;
                    }
               }
               if(hasBuff){
                    buff = new BuffAction(fo);
                    buff.buffType = BuffType.Team;
                    if(skillId == 6 || skillId == 19){
                        property = BuffProperty.Power;
                    }else if(skillId == 9 || skillId == 13){
                        property = BuffProperty.Life;
                    }
                    buff.buffProperty = property;
                    buff.buffValue = fo.skill.skillVal;
                    buff.buffPos = pos;
                    buff.fromPos = fo.lineup.pos;
               }
            }break;
        }
        return buff;
    }

    public checkAttackSkill(attack:FightObject,beAttack:FightObject):SkillAction{
        var action:SkillAction = null;
        var hasAction:boolean = false;
        var skillId:number = attack.skill.skillId;
        switch(skillId){
            // case 5: //复仇傀儡
            case 10: //魅惑妖术
            case 12: //诛妖阵法
            // case 18: //河图洛书
            {
                // if( skillId == 5 && beAttack.lineup.raceId == CardRaceType.XianJie){
                //     hasAction = true;
                // }else 
                if( skillId == 10 && (beAttack.lineup.raceId == CardRaceType.RenJie ||
                        beAttack.lineup.raceId == CardRaceType.XianJie)){
                    hasAction = true;
                }else 
                if( skillId == 12 && (beAttack.lineup.raceId == CardRaceType.WuZu ||
                    beAttack.lineup.raceId == CardRaceType.YaoZu)){
                    hasAction = true;
                }
                // else if( skillId == 18 && beAttack.lineup.raceId == CardRaceType.WuZu){
                //     hasAction = true;
                // }
                var rate:number = attack.skill.skillVal;
                if(Math.random()<rate){
                    hasAction = hasAction && true;
                }else{
                    hasAction = false;
                }
                if(hasAction){
                    action = new SkillAction(attack);
                    action.skillProperty = SkillProperty.AddPower;
                    action.skillValue = 2.25;//(1+attack.skill.skillVal);
                }
            }break;
            // case 2: //万箭齐发
            // case 14:    //齐天大圣
            // {
            //     var rate:number = attack.skill.skillVal;
            //     if(Math.random()<rate){
            //         hasAction = true;
            //     }
            //     if(hasAction){
            //         action = new SkillAction(attack);
            //         action.skillProperty = SkillProperty.AddPower;
            //         var buffValue = 1;
            //         if(skillId == 2){
            //             buffValue = 2;
            //         }else if(skillId == 14){
            //             buffValue = 3;
            //         }
            //         action.skillValue = buffValue;
            //     }
            // }break;
            case 17:    //人皇秩序
            {
                var rate:number = attack.skill.skillVal;
                if(Math.random()<rate){
                    hasAction = true;
                }else{
                    hasAction = false;
                }
                if(hasAction){
                    action = new SkillAction(attack);
                    action.skillProperty = SkillProperty.PowerAttachLife;
                    action.skillValue = 0.25;
                }
            }break;
            // case 8: //长生不老
            // {
            //     var rate:number = attack.skill.skillVal;
            //     if(Math.random()<rate){
            //         hasAction = true;
            //     }
            //     if(hasAction){
            //         action = new SkillAction(attack);
            //         action.skillProperty = SkillProperty.ReturnBlood;
            //         action.skillValue = 0.25;
            //     }
            // }break;
        }
        return action;
    }

    public checkBeAttackSill(beAttack:FightObject):SkillAction{
        var action:SkillAction = null;
        var hasAction:boolean = false;
        var skillId:number = beAttack.skill.skillId;
        switch(skillId){
            // case 15: //二郎真君
            case 16: //百毒不侵
            {
                var rate:number = beAttack.skill.skillVal;
                if(Math.random()<rate){
                    hasAction = true;
                }
                if(hasAction){
                    action = new SkillAction(beAttack);
                    // if(skillId == 15){
                    //     action.skillProperty = SkillProperty.Dodge;
                    //     action.skillValue = 0;
                    // }else 
                    if(skillId == 16){
                        action.skillProperty = SkillProperty.Absorb;
                        action.skillValue = 0.5;
                    }
                }
            }break;
        }
        return action;
    }
}