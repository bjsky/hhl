
import InfoBase from "./InfoBase";

export default class ResInfo extends InfoBase{

    public parse(obj:any){
        this.gold = obj.gold;
        this.diamond = obj.diamond;
        this.lifeStone = obj.lifeStone;
        this.soulStone = obj.soulStone;
        return this;
    }
    //金币
    public gold:number = 0;
    //钻石
    public diamond:number = 0;
    //灵石
    public lifeStone:number = 0;
    //魂石 
    public soulStone:number = 0;
}