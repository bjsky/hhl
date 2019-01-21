import { GAME } from "./GameController";
import { GLOBAL } from "./GlobalData";

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
        var func = window["createGameClubButton"];
        func()
    }

    public getUserInfo(cb){
        var func = window["getUserInfo"];
        func(cb)
    }
}

export var WeiXin = WXInterface.getInstance();