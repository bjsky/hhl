import InfoBase from "./InfoBase";
import { SResInfo } from "../net/msg/MsgLogin";

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
}