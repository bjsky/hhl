export default class GlobalData{
    public static _inst:GlobalData;
    public static getInstance():GlobalData
    {
        return this._inst||(this._inst = new GlobalData())
    }

    private constructor() {
        
    }
    //版本号
    public appVersion:string ="1.0.0";
    public serverIP:string ="";
}


export var GLOBAL = GlobalData.getInstance();