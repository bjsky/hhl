import { EVENT } from "../message/EventCenter";
import GameEvent from "../message/GameEvent";

export default class WXInterface{

    private static _instance: WXInterface = null;
    public static getInstance(): WXInterface {
        if (WXInterface._instance == null) {
            WXInterface._instance = new WXInterface();
        }
        return WXInterface._instance;
    }

    public constructor(){
        window["onGetUserInfo"]=function(res){
            console.log("onGetUserInfo,",res);
            // EVENT.emit(GameEvent.WX_USER_INFO,res);
        };
    }

    private _loginSuccess:Function = null;
    public login(loginSuccess:Function){
        this._loginSuccess = loginSuccess;
        let wxlogin = window['wxlogin'];
        if (wxlogin != undefined) {
            wxlogin((this.onLogin.bind(this)), this.onLoginProgress.bind(this));
        }
    }
    // 设置登陆进度
    onLoginProgress(progress) {
        console.log("微信登陆进度:"+progress);
    }

    onLogin(token, ip)
    {
        this._loginSuccess && this._loginSuccess(token);
    }

    public getUserInfo()
    {
        let getWXUserInfo = window['getWxUserInfo'];
        if (getWXUserInfo != undefined) {
            getWXUserInfo(this.onGetUserInfo.bind(this));
        }
    }
    private onGetUserInfo(res:any)
    {
        console.log("get user info:",res);
        if(res==null){
            let createUserInfoBtn = window['createUserInfoBtn'];
            createUserInfoBtn();
        }else{
            // EVENT.emit(GameEvent.WX_USER_INFO,res);
        }
    }
}
export var WX:WXInterface = WXInterface.getInstance();