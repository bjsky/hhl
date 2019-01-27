import LoadingStep from "../loadingStep";
import { NET } from "../../../net/core/NetController";
import MsgLogin from "../../../net/msg/MsgLogin";
import { COMMON } from "../../../CommonData";
import { CONSTANT } from "../../../Constant";
import { GLOBAL, ServerType } from "../../../GlobalData";
import { LoadingStepEnum } from "../LoadingStepManager";
/**
 * 加载配置
 */
export default class LoadingStepServerData extends LoadingStep{

    public doStep(){
        super.doStep();
        CONSTANT.initConstant();
        LoadingStepServerData.loginServer(()=>{
            this.endStep();
        })
        
    }

    public static loginServer(cb:Function = null){
        if(GLOBAL.serverType == ServerType.Client){
            NET.send(MsgLogin.create("",""),(msg:MsgLogin)=>{
                if(msg && msg.resp){
                    console.log(msg.resp);
                }
                COMMON.initFromServer(msg.resp);
                cb && cb();
            },this)
        }else if(GLOBAL.serverType == ServerType.Debug){
            NET.send(MsgLogin.create(GLOBAL.testAccount,"",{name:"测试1"}),(msg:MsgLogin)=>{
                if(msg && msg.resp){
                    console.log(msg.resp);
                }
                COMMON.initFromServer(msg.resp);
                cb && cb();
            },this)
        }else if(GLOBAL.serverType == ServerType.Publish){
            NET.send(MsgLogin.create("",GLOBAL.code,GLOBAL.loginUserInfo),(msg:MsgLogin)=>{
                if(msg && msg.resp){
                    console.log(msg.resp);
                }
                COMMON.initFromServer(msg.resp);
                cb && cb();;
            },this)
        }
    }
}