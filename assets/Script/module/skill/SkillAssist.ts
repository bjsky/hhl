import CardInfo from "../../model/CardInfo";
import { CONSTANT } from "../../Constant";

export default class SkillAssist{
    private static _instance: SkillAssist = null;
    public static getInstance(): SkillAssist {
        if (SkillAssist._instance == null) {
            SkillAssist._instance = new SkillAssist();
            
        }
        return SkillAssist._instance;
    }

    private _skillMaxLevel:any = null;

    public getSkillHelDescHtml(skillCfg:any):string{
        var skillDesc:string = skillCfg.skillDesc;
        var value:string =(Number(skillCfg.value)*100).toString();
        var addValue:string = (Number(skillCfg.addValue)*100).toString();
        var valueStr = "（<color=#29b92f>"+value+"</color>+英雄星级*<color=#29b92f>"+addValue+"</color>）";
        return "<color=#D35C21>" + skillDesc.replace("#",valueStr)+"</color>";
    }

    public getCardSkillDescHtml(info:CardInfo,index:number = 0):string{
        var cfg:any = info.cardSkillCfg[index];
        var skillDesc:string = cfg.skillDesc;
        var value:string =(Math.round(info.getSkillValue(index)*1000)/10).toString();
        console.log(value);
        var valueStr = "<color=#29b92f>"+value+"</color>";
        return "<color=#D35C21>" + skillDesc.replace("#",valueStr)+"</color>";
    }

    public getCardSkillAddDescHtml(info:CardInfo,index:number = 0):string{
        var cfg:any = info.cardSkillCfg[index];
        // var addValue:string = "<color=#29b92f>+"+(Math.round(cfg.addValue*1000)/10).toString()+"%</color>";
        // var maxLevel:number = this.getSkillMaxLevel(info.grade);
        // return "<color=#D35C21>（下一级: " + addValue +"  等级上限:"+ maxLevel + "级）</color>";

        if(info.isMaxGrade){
            return "<color=#D35C21>已是最高级技能</color>"
        }else{
            var value:string =(Math.round(info.getSkillNextGradeValue(index)*1000)/10).toString();
            var nextGrade:number = info.grade+1;
            return "<color=#D35C21>"+nextGrade+"星：" + value +"%</color>";
        }
    }

    //获取技能的最大等级
    public getSkillMaxLevel(grade:number):number{
        if(this._skillMaxLevel == null){
            this._skillMaxLevel = {};
            var maxLevelArr =CONSTANT.getSkillMaxLevelArr();
            maxLevelArr.forEach(str => {
                var arr = str.split(";");
                this._skillMaxLevel[arr[0]] = arr[1];
            });
        }
        return this._skillMaxLevel[grade];
    }
}

export var Skill = SkillAssist.getInstance();