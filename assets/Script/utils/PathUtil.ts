import { CardRaceType } from "../module/card/CardAssist";
import { ResType } from "../model/ResInfo";
import { SexEnum } from "../CommonData";
import { BuffType } from "../module/fight/SkillLogic";

export default class PathUtil{
    public static getSoundIcon(open:boolean):string{
        return "ui/main/"+(open?"sy_kai":"sy_guan");
    }

    public static getResultRewardTitleUrl(victory:boolean):string{
        return "ui/module/fightResult/"+(victory?"sljl":"sbjl");
    }
    public static getResultEvalUrl(evaluate:number):string{
        return "ui/Common/star"+evaluate;
    }
    public static getMaskBgUrl():string{
        return "ui/Common2/maskbg";
    }
    public static getBuffIconUrl(buffType:BuffType):string{
        var buffImg:string = "";
        if(buffType == BuffType.Team){
            buffImg = "buff_g";
        }else if(buffType == BuffType.Mine){
            buffImg = "buff_y";
        }else if(buffType == BuffType.Debuff){
            buffImg = "buff_r";
        }
        return "ui/module/fight/"+buffImg;
    }
    public static getSkillNameUrl(skill:string):string{
        return "ui/image/skill/"+skill;
    }
    public static getSexIconUrl(sex:number ):string{
        return "ui/Common2/"+(sex == SexEnum.Male?"nan":"nv");
    }
    public static getCardGradeImgPath(grade:number):string{
        return "ui/Common/star"+grade;
    }
    public static getCardHeadGradeImgPath(grade:number):string{
        return "ui/Common/star"+grade+"_m";
    }
    public static getCardImgPath(imgPath:number):string{
        return "ui/image/card/"+imgPath;
    }

    public static getCardHeadUrl(headPath:string):string{
        return "ui/image/head/"+headPath;
    }
    public static getCardRaceImgPath(cardRaceId:number):string{
        var raceImg:string ="";
        if(cardRaceId == CardRaceType.RenJie){
            raceImg = "ren";
        }else if(cardRaceId == CardRaceType.WuZu){
            raceImg = "wu";
        }else if(cardRaceId == CardRaceType.XianJie){
            raceImg = "xian";
        }else if(cardRaceId == CardRaceType.YaoZu){
            raceImg = "yao";
        }
        return "ui/Common2/"+raceImg;
    }

    public static getCardUpstarNeedCard(grade:number):string{
        return "ui/module/cardUp/lbl_kpxj_"+grade;
    }

    public static getResIconUrl(type:ResType):string{
        var url:string = "";
        switch(type){
            case ResType.gold:
            url = "ui/Common2/gold";
            break;
            case ResType.diamond:
            url = "ui/Common2/diamond";
            break;
            case ResType.lifeStone:
            url = "ui/Common2/stone";
            break;
            case ResType.soulStone:
            url = "ui/Common2/stone";
            break;
            case ResType.exp:
            url = "ui/Common2/stone";
            break;
        }
        return url;
    }

    public static getResMutiIconUrl(type:ResType){
        var url:string = "";
        switch(type){
            case ResType.gold:
            url = "ui/Common2/jb_icon";
            break;
            case ResType.diamond:
            url = "ui/Common2/zs_icon";
            break;
            case ResType.lifeStone:
            url = "ui/Common2/ls_icon";
            break;
        }
        return url;
    }

    public static getResTipNameUrl(type:ResType){
        var url:string = "";
        switch(type){
            case ResType.gold:
            url = "ui/module/getRes/dqjb";
            break;
            case ResType.lifeStone:
            url = "ui/module/getRes/dqls";
            break;
        }
        return url;
    }
}