export enum FightPlayerType{
    Enemy = 1,  //敌人:包括其他玩家和机器人
    Boss,   //挑战boss
    Mine    //自己
}
export default class FightInfo{
    //是否是玩家，包括npc玩家
    public playerType:FightPlayerType = 0;
    //对战玩家uid
    public playerUid:string = "";
    //玩家姓名
    public playerName:string = "";
    //玩家等级
    public playerLevel:Number = 1;
    //玩家性别
    public playerSex:number = 1;
    //玩家头像
    public playerIcon:string = "";
    //玩家阵容map
    public lineup:any ={};
    //总战力
    public totalPower:number = 0;
}