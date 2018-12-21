import { CardRaceType } from "../module/card/CardAssist";

export default class PathUtil{

    public static getCardGradeImgPath(grade:number):string{
        return "ui/Common/star"+grade;
    }
    public static getCardImgPath(imgPath:number):string{
        return "ui/image/card/"+imgPath;
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
}