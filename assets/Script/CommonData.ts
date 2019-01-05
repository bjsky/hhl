import UserInfo from "./model/UserInfo";
import ResInfo from "./model/ResInfo";
import { SCLoginData, SResInfo, SUserInfo } from "./net/msg/MsgLogin";
import { GUIDE } from "./manager/GuideManager";
import BuildInfo from "./model/BuildInfo";
import { BUILD } from "./module/build/BuildAssist";
import { Card } from "./module/card/CardAssist";
import PassageInfo from "./model/PassageInfo";
import { Passage } from "./module/battle/PassageAssist";

export enum DirectionEnum{
    Left = 0,       //左
    LeftTop,        //左上
    Top,            //上
    RightTop,       //右上
    Right,          //右
    RightBottom,    //右下
    Bottom,         //下
    LeftBottom      //左下
}
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
    //祭坛灵石召唤次数
    public stoneSummonNum:number = 0;
    //祭坛视频召唤次数
    public videoSummonNum:number = 0;

    private _serverTime: number = 0;
    //获取服务器时间
    public getServerTime(){
        var offset:number = new Date().getTime() - this._loginTime;
        return this._serverTime + offset;
    }

    private _loginTime:number = 0;
    //服务器数据初始化
    public initFromServer(data:SCLoginData){
        this._loginTime = new Date().getTime();

        this.isFristLogin = data.firstLogin;
        this._serverTime = data.serverTime;
        this.userInfo.initFromServer(data.userInfo);
        this.resInfo.initFromServer(data.resInfo);


        this.stoneSummonNum = data.stoneSummonNum;
        this.videoSummonNum = data.videoSummonNum;

        BUILD.initBuilding(data.buildInfos);

        GUIDE.initGuide(data.guideInfo);

        Card.initCard(data.ownerCards,data.lineUpCardsUuid);

        Passage.initPassageInfo(data.passageInfo);
    }

    public updateResInfo(data:SResInfo){
        this.resInfo.updateInfo(data);
    }

    public updateUserInfo(data:SUserInfo){
        this.userInfo.updateInfo(data);
    }
}


export var COMMON = CommonData.getInstance();