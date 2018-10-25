
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

    public ZERO:cc.Vec2 = cc.v2(0,0);

    // 本地数据服务
    public isLocalData:boolean = true; 
}


export var COMMON = CommonData.getInstance();