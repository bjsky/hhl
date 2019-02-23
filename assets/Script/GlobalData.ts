import { WeiXin } from "./wxInterface";
import { UI } from "./manager/UIManager";


export enum ServerType{
    //客户端测试 
    Client = 0,
    //服务器调试
    Debug ,
    //发布环境
    Publish
}
export default class GlobalData{
    public static _inst:GlobalData;
    public static getInstance():GlobalData
    {
        return this._inst||(this._inst = new GlobalData())
    }


    public serverType:number = ServerType.Client;
    public version:string = "1.0.19";

    public serverUrl:string = "wss://www.xh52.top:8580/websocket";
    // public serverUrl:string = "ws://192.168.0.102:8502/websocket";

    public testAccount:string ="test021"//"test029";

    public code:string ="";//微信登录code
    //是否开通广告流量主
    public isOpenAdId:boolean = true; 

    //登录授权userInfo，未授权为空
    public loginUserInfo:any = null;

    public initGameConfig(){
        var gameCfg = WeiXin.getGameConfigData();
        if(gameCfg.serverUrl!=undefined){
            this.serverUrl = gameCfg.serverUrl;
        }
        console.log("initGameConfig:",this.serverType,this.serverUrl)
    }

    public isIPhoneX:boolean =false;
    public statusBarHeight:number = 0;
    public systemInfo:any =null;
    public initSystemInfo(){
        this.systemInfo = WeiXin.getSystemInfo(); 
        console.log("initSystemInfo:"+JSON.stringify(this.systemInfo) );
        if(this.systemInfo && this.systemInfo.model.indexOf("iPhone X")>=0 )
        {
            this.isIPhoneX = true;
            this.statusBarHeight = Number(this.systemInfo.statusBarHeight);
            UI.adjustHeight();
        }
    }

    public initUserInfo(userInfo){
        this.loginUserInfo = userInfo;
    }
}


export var GLOBAL = GlobalData.getInstance();