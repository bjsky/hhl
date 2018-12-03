import UserInfo from "./model/UserInfo";
import ResInfo from "./model/ResInfo";
import { SCLoginData } from "./net/msg/MsgLogin";
import { GUIDE } from "./manager/GuideManager";
import BuildInfo from "./model/BuildInfo";

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
    // 建筑数据
    public buildInfoMap:any = {};
    //祭坛灵石召唤次数
    public stoneSummonNum:number = 0;
    //祭坛视频召唤次数
    public videoSummonNum:number = 0;

    //服务器数据初始化
    public initFromServer(data:SCLoginData){

        this.isFristLogin = data.firstLogin;
        this.userInfo.initFromServer(data.userInfo);
        this.resInfo.initFromServer(data.resInfo);
        data.buildInfos.forEach(info => {
            var buildInfo:BuildInfo = new BuildInfo();
            buildInfo.initFormServer(info);
            this.buildInfoMap[buildInfo.type] = buildInfo;
        });

        this.stoneSummonNum = data.stoneSummonNum;
        this.videoSummonNum = data.videoSummonNum;

        GUIDE.initGuide(data.guideInfo);
    }

}


export var COMMON = CommonData.getInstance();