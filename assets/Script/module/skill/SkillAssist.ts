
export default class SkillAssist{
    private static _instance: SkillAssist = null;
    public static getInstance(): SkillAssist {
        if (SkillAssist._instance == null) {
            SkillAssist._instance = new SkillAssist();
            
        }
        return SkillAssist._instance;
    }

    public getSkillHelDescHtml(skillCfg:any):string{
        var skillDesc:string = skillCfg.skillDesc;
        var value:string =(Number(skillCfg.value)*100).toString();
        var addValue:string = (Number(skillCfg.addValue)*100).toString();
        var valueStr = "（<color=#29b92f>"+value+"</color>+技能等级*<color=#29b92f>"+addValue+"</color>）";
        return "<color=#D35C21>" + skillDesc.replace("#",valueStr)+"</color>";
    }
}

export var Skill = SkillAssist.getInstance();