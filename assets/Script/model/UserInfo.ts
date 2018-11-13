
import InfoBase from "./InfoBase";

/**
 * 用户数据
 */
export default class UserInfo extends InfoBase{


    public parse(obj:any){
        this.nickName = obj.nickName;
        this.headPic = obj.headPic;
        this.exp = obj.exp;
        this.level = obj.level;
        return this;
    }
    //用户名
    public nickName:string = "";
    //头像url
    public headPic:string = "";
    //当前经验
    public exp:number = 0;
    //当前等级
    public level:number = 1;

}