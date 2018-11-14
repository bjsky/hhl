import UserInfo from "./model/UserInfo";
import GuideInfo from "./model/GuideInfo";
import ResInfo from "./model/ResInfo";
import { SCLoginData } from "./net/msg/MsgLogin";
import { GUIDE } from "./module/guide/GuideManager";

/**
 *  全局的游戏数据，
 * 
 */
export default class CommonData{
    public static _inst:CommonData;
    public static getInstance():CommonData
    {
        return this._inst||(this._inst = new CommonData())
    }

    private constructor() {
        
    }

    public ZERO:cc.Vec2 = cc.v2(0,0);

    public isFristLogin:boolean  = false;

    //用户数据
    public userInfo:UserInfo = new UserInfo();
    //资源数据
    public resInfo:ResInfo = new ResInfo();

    //服务器数据初始化
    public initFromServer(data:SCLoginData){

        this.isFristLogin = data.firstLogin;
        this.userInfo.initFromServer(data.userInfo);
        this.resInfo.initFromServer(data.resInfo);

        GUIDE.initGuide(data.guideInfo);
    }

}


export var COMMON = CommonData.getInstance();