import { CardRaceType } from "../module/card/CardAssist";
import { ResType } from "../model/ResInfo";

export default class PathUtil{

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
            url = "ui/Common2/jinbi_icon";
            break;
            case ResType.diamond:
            url = "ui/Common/diamond";
            break;
            case ResType.lifeStone:
            url = "ui/Common2/lingshi_icon";
            break;
            case ResType.soulStone:
            url = "ui/Common2/hunshi_icon";
            break;
            case ResType.exp:
            url = "ui/Common2/jinyan_icon";
            break;
        }
        return url;
    }
}