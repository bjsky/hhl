import { WeiXin } from "./wxInterface";


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

    public serverUrl:string = "";

    public initGameConfig(){
        var gameCfg = WeiXin.getGameConfigData();
        if(gameCfg.serverUrl!=undefined){
            this.serverUrl = gameCfg.serverUrl;
        }
        console.log("initGameConfig:",this.serverType,this.serverUrl)
    }
}


export var GLOBAL = GlobalData.getInstance();