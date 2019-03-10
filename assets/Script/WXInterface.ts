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
        window["wxOnShow"] = function(res)
        {
            EVENT.emit(GameEvent.Weixin_onShow);
            try {
                if(Share.isShareOnHide){    //分享中
                    Share.shareOnShow();
                }
            }catch (error) {
                console.log(error)
            }
        }
        window["wxOnHide"] = function(res)
        {
            try {
                EVENT.emit(GameEvent.Weixin_onHide);
                console.log("wxOnHide emit");
            } catch (error) {
                console.log(error)
            }
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

    public showVideoAd(cb:Function,type:ResType){
        console.log("观看视频开始："+type);
        if(GLOBAL.serverType == ServerType.Publish){
            var func = window["showVideoAd"];
            func(cb,type);
        }else{
            cb && cb();
        }
    }
}

export var WeiXin = WXInterface.getInstance();