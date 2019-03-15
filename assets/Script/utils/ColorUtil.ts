import { ResType } from "../model/ResInfo";

export default class ColorUtil{

    public static getResColor(restype:ResType):cc.Color{
        var color:cc.Color = new cc.Color();
        switch(restype){
            case ResType.gold:
            color = color.fromHEX("#D42834");
            break;
            case ResType.lifeStone:
            color = color.fromHEX("#D43F97");
            break;
            case ResType.exp:
            color = color.fromHEX("6666K");
            break;
            default:
            color = color.fromHEX("#D35C21");
            break;
        }
        return color;
    }
    public static getGradeColorHex(grade:number):string{
        if(grade == 1){
            return "#2DBE04";
        }else if(grade == 2){
            return "#346BF7";
        }else if(grade == 3){
            return "#D70AF3";
        }else if(grade == 4){
            return "#F78823";
        }else if(grade == 5){
            return "#E61120";
        }else {
            return "#2DBE04";
        }
    }
}