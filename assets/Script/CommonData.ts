import UserInfo from "./model/UserInfo";
import ResInfo from "./model/ResInfo";
import { SCLoginData, SResInfo, SUserInfo } from "./net/msg/MsgLogin";
import { GUIDE } from "./manager/GuideManager";
import { BUILD } from "./module/build/BuildAssist";
import { Card } from "./module/card/CardAssist";
import { Passage } from "./module/battle/PassageAssist";
import { Lineup } from "./module/battle/LineupAssist";
import { Share } from "./module/share/ShareAssist";
import { Battle } from "./module/battle/BattleAssist";
import { EVENT } from "./message/EventCenter";
import GameEvent from "./message/GameEvent";
import { Task } from "./module/TaskAssist";
import { Activity } from "./module/ActivityAssist";
import TaskInfo from "./model/TaskInfo";

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

export enum SexEnum{
    Male = 1,
    Female,
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

    public get isNewUser():boolean{
        return this.newUser == 1;
    }
    public ZERO:cc.Vec2 = cc.v2(0,0);

    public isFristLogin:boolean  = false;
    public newUser:number = 0;

    public accountId:string ="";
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

        this.accountId = data.accountId;
        this.isFristLogin = data.firstLogin;
        this.newUser = data.newUser;
        this._serverTime = data.serverTime;
        this.userInfo.initFromServer(data.userInfo);
        this.resInfo.initFromServer(data.resInfo);


        this.stoneSummonNum = data.stoneSummonNum;
        this.videoSummonNum = data.videoSummonNum;

        BUILD.initBuilding(data.buildInfos);

        GUIDE.initGuide(data.guideInfo,data.newUser);

        Card.initCard(data.ownerCards);

        Lineup.initOwnerLineup(data.lineUpOwner);

        Passage.initPassageInfo(data.passageInfo);

        Share.initShare(data.todayShareCount);

        Battle.initBattle(data.battleInfo);

        Battle.initOutlineFightRecords(data.outlineFightRecord);

        Task.initTask(data.taskInfo);

        Activity.initSenvenday(data.senvenDayInfo);
    }

    public updateResInfo(data:SResInfo):SResInfo{
        return this.resInfo.updateInfo(data);
    }

    public updateUserInfo(data:SUserInfo){
        var levelPrev = this.userInfo.level;
        this.userInfo.updateInfo(data);
        var levelup = this.userInfo.level - levelPrev>0;
        if(levelup){
            this.onUserLevelUp();
            Task.updateGrowthReward();
            //升级
            EVENT.emit(GameEvent.User_Level_UP,{});
        }
    }

    private onUserLevelUp(){
        //刷新战场数据
        Battle.initEnemyList();
    }
}


export var COMMON = CommonData.getInstance();