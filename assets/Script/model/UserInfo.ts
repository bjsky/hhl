import InfoBase from "./InfoBase";
import { SUserInfo } from "../net/msg/MsgLogin";

/**
 * 用户数据
 */
export default class UserInfo  extends InfoBase{
    //用户名
    public nickName:string = "";
    //头像url
    public headPic:string = "";
    //当前经验
    public exp:number = 0;
    //当前等级
    public level:number = 1;
    

    public initFromServer(data:SUserInfo){
        this.nickName = data.nickName;
        this.headPic = data.headPic;
        this.exp = data.exp;
        this.level = data.level;
        
    }
}