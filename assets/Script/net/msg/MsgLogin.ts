
import NetConst from "../NetConst";
import MessageBase from "./MessageBase";
import MsgCardSummon, { SCardInfo, CardSummonType } from "./MsgCardSummon";
import StringUtil from "../../utils/StringUtil";

/**
 * 登录客户端数据
 */
export class CSLoginData {
    public accountId:string;   //账号id
    public code:string;  //微信code
    public adId:string;
    public shareId:string;
    public name:string;
    public icon:string;
    public gender:number;   
}

/**
 * 登录服务器数据
 */
export class SCLoginData {
    public accountId:string //账号id
    //新账户
    public newUser:number = 0;
    //每天首次登录
    public firstLogin:boolean  = false;
    //服务器时间
    public serverTime:number = 0;
    //用户信息
    public userInfo:SUserInfo = null;
    //资源信息
    public resInfo:SResInfo = null;
    //引导数据
    public guideInfo:SGuideInfo = null;
    // 建筑数据
    public buildInfos:Array<SBuildInfo> = [];
    //祭坛灵石召唤次数
    public stoneSummonNum:number = 0;
    //祭坛视频召唤次数
    public videoSummonNum:number = 0;
    //拥有的卡牌
    public ownerCards:Array<SCardInfo> = [];
    //所有卡牌
    public lineUpOwner:Array<SOwnerLineup> = [];
    //挂机关卡数据
    public passageInfo:SPassageInfo = null;
    //今日分享次数
    public todayShareCount:number = 0;
    //战场数据 
    public battleInfo:SBattleInfo = null;
    //离线攻击记录
    public outlineFightRecord:Array<SFightRecord> = []


    public static parse(obj:any):SCLoginData{
        var data:SCLoginData = new SCLoginData();
        data.accountId = obj.accountId;
        data.newUser = obj.newUser;
        data.firstLogin = obj.firstLogin;
        data.serverTime = obj.serverTime;
        data.userInfo = SUserInfo.parse(obj.userInfo);
        data.resInfo = SResInfo.parse(obj.resInfo);
        data.guideInfo = SGuideInfo.parse(obj.guideInfo);
        //解析building
        data.buildInfos = [];
        if(obj.buildInfos!=undefined){
            obj.buildInfos.forEach(info => {
                var buildInfo:SBuildInfo = SBuildInfo.parse(info);
                data.buildInfos.push(buildInfo);
            });
        }
        // data.stoneSummonNum = obj.stoneSummonNum;
        data.videoSummonNum = obj.videoSummonNum;
        obj.ownerCards.forEach(cardObj => {
            data.ownerCards.push(SCardInfo.parse(cardObj));
        });
        if(obj.lineUpOwner){
            obj.lineUpOwner.forEach(lineupObj => {
                data.lineUpOwner.push(SOwnerLineup.parse(lineupObj));
            });
        }
        if(obj.passageInfo){
            data.passageInfo = SPassageInfo.parse(obj.passageInfo);
        }else{
            data.passageInfo = SPassageInfo.parse({
                passId:1,
                passStartTime:new Date().getTime(),
                passUncollectedTime:0,
                passUncollectExp:0,
                passUncollectGold:0,
                passUncollectStone:0
            });
        }
        if(obj.todayShareCount){
            data.todayShareCount = obj.todayShareCount;
        }
        if(obj.battleInfo){
            data.battleInfo = SBattleInfo.parse(obj.battleInfo);
        }
        data.outlineFightRecord = [];
        if(obj.outlineFightRecord){
            obj.outlineFightRecord.forEach((record:any) => {
                data.outlineFightRecord.push(SFightRecord.parse(record));
            });
        }

        return data;
    }
}

export class SUserInfo {
    //用户名
    public name:string = "";
    //头像url
    public icon:string = "";
    //性别
    public gender:number = 0;
    //当前经验
    public exp:number = 0;
    //当前等级
    public level:number = 1;

    public static parse(obj:any):SUserInfo{
        var info:SUserInfo = new SUserInfo();
        info.name = obj.name;
        info.icon = obj.icon;
        info.gender = obj.gender;
        info.exp = obj.exp;
        info.level = obj.level;

        return info;
    }
}

export class SResInfo{
    //金币
    public gold:number = 0;
    //钻石
    public diamond:number = 0;
    //灵石
    public lifeStone:number = 0;
    //魂石 
    public soulStone:number = 0;

    public static parse(obj:any):SResInfo{
        var info:SResInfo = new SResInfo();
        info.gold = obj.gold;
        info.diamond = obj.diamond;
        info.lifeStone = obj.lifeStone;
        info.soulStone = obj.soulStone;
        return info;
    }
}

export class SGuideInfo{
    //引导步骤
    public guideId:number = -1;  //-1:引导完成

    public static parse(obj:any):SGuideInfo{
        var info:SGuideInfo = new SGuideInfo();
        info.guideId = obj.guideId;
        return info;
    }

}
export class SBuildInfo{
    // 建筑type
    public type:number = 0;
    // 建筑等级
    public level:number = 1;
    // 是否锁定——锁定的不产生五彩石
    public locked:boolean = false;
    //五彩石
    public colorStones:Array<SColorStoneInfo> = [];

    public static parse(info:any):SBuildInfo{
        var buildInfo:SBuildInfo = new SBuildInfo();
        buildInfo.type = info.type;
        buildInfo.level = info.level;
        buildInfo.locked = info.locked;
        if(info.colorStones!=undefined){
            buildInfo.colorStones = [];
            info.colorStones.forEach(stone => {
                var stoneInfo:SColorStoneInfo = SColorStoneInfo.parse(stone);
                buildInfo.colorStones.push(stoneInfo);
            });
        }
        return buildInfo;
    }
}

export class SColorStoneInfo{
    //开始产生时间
    public time:number = 0;
    //资源类型
    public resType:number = 0;
    //资源数量
    public resNum:number = 0;

    public static parse(obj:any):SColorStoneInfo{
        var info:SColorStoneInfo = new SColorStoneInfo();
        info.time = obj.time;
        info.resType = obj.resType;
        info.resNum = obj.resNum;
        return info;
    }
}

export class SPassageInfo{
    //当前关卡id
    public passId:number = 0;
    //当前关卡开始的时间（计算当前关卡收益）
    public passStartTime:number = 0;

    public static parse(obj:any):SPassageInfo{
        var info:SPassageInfo = new SPassageInfo();
        info.passId = obj.passId;
        info.passStartTime = obj.passStartTime;
        return info;
    }
}

export class SOwnerLineup{
    //阵容位置
    public pos:number = 0;
    //阵容uuid
    public uuid:string = "";

    public static parse(obj:any):SOwnerLineup{
        var info:SOwnerLineup = new SOwnerLineup();
        info.pos = obj.pos;
        info.uuid = obj.uuid;
        return info;
    }
}

export class SBattleInfo{
    //行动点
    public actionPoint:number = 0;
    //行动点恢复开始时间
    public apStartTime:number = 0;
    //复仇开始时间
    public revengeStartTime:number = 0;
    //积分
    public score:number = 0;

    public static parse(obj:any):SBattleInfo{
        var info:SBattleInfo = new SBattleInfo();
        info.actionPoint = obj.actionPoint;
        info.apStartTime = obj.apStartTime;
        info.revengeStartTime = obj.revengeStartTime;
        info.score = obj.score;
        return info;
    }
}
//攻击纪录
export class SFightRecord{
    //时间;毫秒
    public time:number = 0;
    //攻击者uid
    public fightUid:string = ""
    //攻击者名字
    public fightName:string ="";
    //被攻击者uid
    public befightUid:string = ""
    //被攻击者名字
    public befightName:string = ""
    //积分变动
    public score:number =0;
    //是否抢夺卡牌
    public isRabCard:boolean = false;
    //抢夺卡牌uuid
    public uuid:string = "";
    //抢夺卡牌id
    public rabCardId:number = 0;
    //抢夺卡牌品级
    public rabCardGrade:number = 0;

    public static parse(obj:any):SFightRecord{
        var info:SFightRecord = new SFightRecord();
        info.time = obj.time;
        info.fightUid = obj.fightUid;
        info.fightName = obj.fightName;
        info.befightUid = obj.befightUid;
        info.befightName = obj.befightName;
        info.score = obj.score;
        info.isRabCard = obj.isRabCard;
        info.uuid = obj.uuid;
        info.rabCardId = obj.rabCardId;
        info.rabCardGrade = obj.rabCardGrade;
        return info;
    }
}

export default class MsgLogin
 extends MessageBase {
    public param:CSLoginData;
    public resp:SCLoginData;

    constructor(){
        super(NetConst.Login);
        // this.isLocal = true;
    }

    public static create(accountId:string,code:string,userInfo:any = null
        ,shareId:string="",adId:string=""){
        var msg = new MsgLogin();
        msg.param = new CSLoginData();
        msg.param.accountId = accountId;
        msg.param.code = code;
        console.log("MsgLogin create:",userInfo)
        if(userInfo!=null){
            msg.param.name = userInfo.nickName;
            msg.param.icon = userInfo.avatarUrl;
            msg.param.gender = userInfo.gender;
        }
        msg.param.shareId = shareId;
        msg.param.adId = adId;
        return msg;
    }

    public respFromLocal(){
        var ownerCards:Array<any> = [];
        // [
        //     this.getSkillCard(18),this.getSkillCard(15),this.getSkillCard(13),this.getSkillCard(16),this.getSkillCard(17)
        // ];
        // for(var i:number = 0;i<5;i++){
        //     ownerCards.push(MsgCardSummon.randomCardInfo(CardSummonType.LifeStone));
        // }
        // for(i= 0;i<1;i++){
        //     var copy = this.copyCard(ownerCards[0]);
        //     ownerCards.push(copy);
        // }
        var json:any = {firstLogin:true,
            accountId:StringUtil.getUUidClient(),
            newUser:1,
            serverTime:new Date().getTime(),
            userInfo:{name:"上古战神",icon:"",gender:1,exp:0,level:1},
            resInfo:{gold:200000,diamond:0,lifeStone:200000,soulStone:0},
            guideInfo:{guideId:1},
            buildInfos:[{type:0,level:1,locked:true},
                {type:1,level:1,locked:true},
                {type:2,level:1,locked:true},
                {type:3,level:1,locked:true},],
            stoneSummonNum:0,videoSummonNum:0,
            ownerCards:ownerCards,
            lineUpOwner:[],
            passageInfo:{
                passId:1,
                passStartTime:new Date().getTime(),
                passUncollectedTime:0,
                passUncollectExp:0,
                passUncollectGold:0,
                passUncollectStone:0
            },
            battleInfo:{
                actionPoint:10,
                apStartTime:0,
                revengeStartTime:0,
                score:0
            },
            outlineFightRecord:[]
        };
        return this.parse(json);
    }

    private getSkillCard(cardId:number){
        var uuid = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        var card:any = {uuid:uuid,level:15,cardId:cardId,grade:4,skillLevel:1}
        return card;
    }
    private copyCard(card:any){
        var uuid = new Date().getTime()+ Number(Math.random()*1000000).toFixed(0);
        var copy:any = {uuid:uuid,level:1,cardId:card.cardId,grade:card.grade,skillLevel:1}
        return copy;
    }

    private parse(obj:any):MessageBase{
        var data:SCLoginData = SCLoginData.parse(obj);
        this.resp = data;
        return this;
    }

    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}