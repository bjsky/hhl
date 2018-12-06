import InfoBase from "./InfoBase";
import { SResInfo } from "../net/msg/MsgLogin";
import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";

export enum ResType{
    gold = 0,
    diamond,
    lifeStone,
    soulStone
}

export default class ResInfo extends InfoBase{

    //金币
    public gold:number = 0;
    //钻石
    public diamond:number = 0;
    //灵石
    public lifeStone:number = 0;
    //魂石 
    public soulStone:number = 0;

    public initFromServer(data:SResInfo){
        this.gold = data.gold;
        this.diamond = data.diamond;
        this.lifeStone = data.lifeStone;
        this.soulStone = data.soulStone;
    }

    public updateInfo(data:SResInfo){
        this.initFromServer(data);
    }

    public cloneServerInfo():SResInfo{
        var clone:SResInfo = new SResInfo();
        clone.gold = this.gold;
        clone.diamond = this.diamond;
        clone.lifeStone = this.lifeStone;
        clone.soulStone = this.soulStone;
        return clone;
    }
}