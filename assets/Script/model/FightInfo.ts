export default class FightInfo{
    //是否是玩家，包括npc玩家
    public isPlayer:boolean = false;
    //玩家姓名
    public playerName:string = "";
    //玩家等级
    public playerLevel:Number = 1;
    //玩家性别
    public playerSex:number = 1;
    //玩家性别
    public playerIcon:string = "";
    //玩家阵容map
    public lineup:any ={};
    //总战力
    public totalPower:number = 0;
}