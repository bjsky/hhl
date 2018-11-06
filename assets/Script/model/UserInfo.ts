import InfoBase from "./InfoBase";

/**
 * 用户数据
 */
export default class UserInfo extends InfoBase{
    //用户名
    public nickName:string = "";
    //头像url
    public headPic:string = "";
    //当前经验总
    public exp:number = 0;
    //当前等级
    public level:number = 1;
    //引导步骤
    public guideStep:number = 0;
    //金币
    public gold:number = 0;
    //钻石
    public diamond:number = 0;
    //灵石
    public lifeStone:number = 0;
    //魂石 
    public soulStone:number = 0;

}