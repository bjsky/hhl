

/**
 * 
 * 登录步骤基类，登录状态机的状态类型，对应一个进度表现和描述
 */
export default class LoadingStep{
    constructor(type){
        this.type = type;
    }
    //枚举类型
    public type:Number = 0;
    //描述
    public desc:String = "";
    //最大进度
    public maxProgress:Number = 0;

    //开始步骤
    public startStep(){

    }

    //完成步骤
    public endStep(){

    }

}