import { GLOBAL, ServerType } from "./GlobalData";
import { EVENT } from "./message/EventCenter";
import GameEvent from "./message/GameEvent";
import { Share } from "./module/share/ShareAssist";
import { SeeVideoResult } from "./view/ResPanel";
import { UI } from "./manager/UIManager";
import { ResType } from "./model/ResInfo";

export class WXInterface{
    public static _inst:WXInterface;
    public static getInstance():WXInterface
    {
        return this._inst||(this._inst = new WXInterface())
    }

    constructor(){
        if(CC_WECHATGAME){
            wx.onShow(function(res)
            {
                EVENT.emit(GameEvent.Weixin_onShow);
                try {
                    if(Share.isShareOnHide){    //分享中
                        Share.shareOnShow();
                    }
                }catch (error) {
                    console.log(error)
                }
            })
            wx.onHide(function(res)
            {
                try {
                    EVENT.emit(GameEvent.Weixin_onHide);
                    console.log("wxOnHide emit");
                } catch (error) {
                    console.log(error)
                }
            })
        }
    }
    
    //获取配置信息
    public getGameConfigData():any{
        var config = {
            serverUrl:window["login_server_url"],
        }
        return config;
    }

    public wxLogin(loginCallback:Function){
        var loginFunc = window["wxlogin"];
        loginFunc(loginCallback);
    }

    public createUserInfoButton(left,top,width,height,cb){
        var func = window["createUserInfoButton"];
        func(left,top,width,height,cb);
    }

    public createGameClubButton(){
        if(GLOBAL.serverType == ServerType.Publish){
            var func = window["createGameClubButton"];
            func()
        }
    }

    public getSystemInfo(){
        return window["systemInfo"];
    }

    public getUserInfo(cb){
        var func = window["getUserInfo"];
        func(cb)
    }

    public shareAppMessage(title,imgUrl,query){
        var func = window["shareAppMessage"];
        func(title,imgUrl,query);
    }

    public showVideoAd(cb:Function,type:SeeVideoType){
        console.log("观看视频开始："+type);
        if(GLOBAL.serverType == ServerType.Publish){
            var func = window["showVideoAd"];
            func(cb,type);
        }else{
            cb && cb();
        }
    }
}

export enum SeeVideoType{
    SeeVideoGetStone = 1,       //看视频得灵石
    SeeVideoGetGold,            //看视频得金币
    SeeVideoGetDiamond,         //看视频得钻石
    SeeVideoGetCard,            //看视频五倍抽卡
    SeeVideoRabAttack           //看视频抢夺攻击
}

export enum ShareType{
    ShareGetDiamond =1,         //分享得钻石
    ShareSevendayDouble,        //分享七日双倍
    ShareFightResultDouble,     //分享双倍领奖

}

export var WeiXin = WXInterface.getInstance();