import MessageBase from "./MessageBase";
import NetConst from "../NetConst";


export enum GetRankListType{
    Level = 1,  //等级榜
    Power,      //阵容战力
    Score ,  //积分榜
}
export class CSGetRankList{
    //排行榜的类型
    public type:GetRankListType = 0;
}

export class SCGetRankList{
    //我的位置
    public myOrder:number = 0;
    //玩家列表(按照等级、战力、或积分排序)
    public rankList:Array<SRankInfo> = [];

    public static parse(obj:any){
        var info:SCGetRankList = new SCGetRankList();
        info.myOrder = obj.myOrder;
        info.rankList =[];
        obj.rankList.forEach((rank:any) => {
            info.rankList.push(SRankInfo.parse(rank));
        });
        return info;
    }
}

export class SRankInfo{
    //姓名
    public playerName:string = "";
    //等级
    public playerLevel:Number = 1;
    //性别
    public playerSex:number = 1;
    //头像
    public playerIcon:string = "";
    //阵容战力
    public playerPower:number = 0;
    //积分
    public playerScore:number = 0;

    public static parse(obj:any):SRankInfo{
        var info:SRankInfo = new SRankInfo();
        info.playerName = obj.playerName;
        info.playerLevel = obj.playerLevel;
        info.playerSex = obj.playerSex;
        info.playerIcon = obj.playerIcon;
        info.playerPower = obj.playerPower;
        info.playerScore = obj.playerScore;
        return info;
    }
}

//获取排行榜数据，考虑性能，30分钟更新一次前50，其他时候取静态数据
export default class MsgGetRankList extends MessageBase{
    public param:CSGetRankList;
    public resp:SCGetRankList;

    constructor(){
        super(NetConst.GetRankList);
        this.isLocal = true;
    }

    public static create(type:GetRankListType){
        var msg = new MsgGetRankList();
        msg.param = new CSGetRankList();
        msg.param.type = type;
        return msg;
    }

    public respFromLocal(){
        var json:any= {};
        return this.parse(json);
    }

    private parse(obj:any):MessageBase{
        this.resp = SCGetRankList.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}