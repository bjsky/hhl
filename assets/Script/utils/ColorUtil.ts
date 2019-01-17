import { ResType } from "../model/ResInfo";

export default class ColorUtil{

    public static getResColor(restype:ResType):cc.Color{
        var color:cc.Color;
        switch(restype){
            case ResType.gold:
            color = cc.hexToColor("#D42834");
            break;
            case ResType.lifeStone:
            color = cc.hexToColor("#D43F97");
            break;
            case ResType.exp:
            color = cc.hexToColor("6666K");
            break;
            default:
            color = cc.hexToColor("#D35C21");
            break;
        }
        return color;
    }
}