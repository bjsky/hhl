import { CardRaceType } from "../module/card/CardAssist";
import { ResType } from "../model/ResInfo";
import { SexEnum } from "../CommonData";
import { BuffType } from "../module/fight/SkillLogic";

export default class PathUtil{

    public static getCardImgPath(imgPath:number):string{
        return "image/card/"+imgPath;
    }
    public static getCardSamllImgPath(imgPath:number):string{
        return "image/cardSmall/"+imgPath;
    }
    public static getCardHeadUrl(headPath:string):string{
        return "image/head/"+headPath;
    }

    public static getRankImgUrl(index:number){
        return "image/ui/rank"+index;
    }

    public static getSkillNameUrl(skill:string):string{
        return "image/skill/"+skill;
    }
    public static getResultEvalUrl(evaluate:number):string{
        return "image/ui/star"+evaluate;
    }
    public static getCardGradeImgPath(grade:number):string{
        return "image/ui/star"+grade;
    }
    public static getCardFrontImgPath(grade:number):string{
        return "image/ui/card_f_"+grade;
    }
    public static getCardHeadGradeImgPath(grade:number):string{
        return "image/ui/star"+grade+"_m";
    }

    public static getSexIconUrl(sex:number ):string{
        return "image/ui/"+(sex == SexEnum.Male?"nan":"nv");
    }
    public static getCardRaceImgPath(cardRaceId:number):string{
        var raceImg:string ="";
        if(cardRaceId == CardRaceType.RenJie){
            raceImg = "race_ren";
        }else if(cardRaceId == CardRaceType.WuZu){
            raceImg = "race_wu";
        }else if(cardRaceId == CardRaceType.XianJie){
            raceImg = "race_xian";
        }else if(cardRaceId == CardRaceType.YaoZu){
            raceImg = "race_yao";
        }
        return "image/ui/"+raceImg;
    }

    public static getResIconUrl(type:ResType):string{
        var url:string = "";
        switch(type){
            case ResType.gold:
            url = "image/ui/res_gold";
            break;
            case ResType.diamond:
            url = "image/ui/res_diamond";
            break;
            case ResType.lifeStone:
            url = "image/ui/res_stone";
            break;
            case ResType.soulStone:
            url = "image/ui/res_stone";
            break;
            case ResType.exp:
            url = "image/ui/res_exp";
            break;
        }
        return url;
    }
    public static getResMutiIconUrl(type:ResType){
        var url:string = "";
        switch(type){
            case ResType.gold:
            url = "image/ui/m_icon_jb";
            break;
            case ResType.diamond:
            url = "image/ui/m_icon_zs";
            break;
            case ResType.lifeStone:
            url = "image/ui/m_icon_ls";
            break;
        }
        return url;
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
        return "image/ui/"+buffImg;
    }

    public static getSoundIcon(open:boolean):string{
        return "image/ui/"+(open?"sy_kai":"sy_guan");
    }
    public static getMaskBgUrl():string{
        return "image/ui/maskbg";
    }

    public static getResTipNameUrl(type:ResType){
        var url:string = "";
        switch(type){
            case ResType.gold:
            url = "image/ui/lbl_dqjb";
            break;
            case ResType.lifeStone:
            url = "image/ui/lbl_dqls";
            break;
        }
        return url;
    }
    public static getCardnextGradeCard(grade:number):string{
        return "image/ui/lbl_hc"+grade+"xkp";
    }

    public static getBoxRecevieIcon(receive:boolean):string{
        return "image/ui/"+(receive?"k_5":"g_5");
    }

}