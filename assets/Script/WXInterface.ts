import { GAME } from "./GameController";
import { GLOBAL, ServerType } from "./GlobalData";

export class WXInterface{
    public static _inst:WXInterface;
    public static getInstance():WXInterface
    {
        return this._inst||(this._inst = new WXInterface())
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

    public getUserInfo(cb){
        var func = window["getUserInfo"];
        func(cb)
    }

    public shareAppMessage(title,imgUrl,query){
        var func = window["shareAppMessage"];
        func(title,imgUrl,query);
    }
}

export var WeiXin = WXInterface.getInstance();