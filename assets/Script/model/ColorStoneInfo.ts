import { SColorStoneInfo } from "../net/msg/MsgLogin";

export default class ColorStoneInfo{
    //开始产生时间
    public time:number = 0;
    //资源类型
    public resType:number = 0;
    //资源数量
    public resNum:number = 0;

    public initFromServer(stone:SColorStoneInfo){
        this.time = stone.time;
        this.resType = stone.resType;
        this.resNum = stone.resNum;
    }

    public cloneServerInfo():SColorStoneInfo{
        var sInfo:SColorStoneInfo = new SColorStoneInfo();
        sInfo.time = this.time;
        sInfo.resType = this.resType;
        sInfo.resNum = this.resNum;
        return sInfo;
    }
}