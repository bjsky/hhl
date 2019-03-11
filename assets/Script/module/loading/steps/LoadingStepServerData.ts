
import LoadStep from "../LoadStep";
import { ServerType, GLOBAL } from "../../../GlobalData";
import { CONSTANT } from "../../../Constant";
import { NET } from "../../../net/core/NetController";
import MsgLogin from "../../../net/msg/MsgLogin";
import { COMMON } from "../../../CommonData";
/**
 * 加载配置
 */
export default class LoadingStepServerData extends LoadStep{
    protected onStep(){
        CONSTANT.initConstant();
        if(GLOBAL.serverType == ServerType.Client){
            NET.send(MsgLogin.create("",""),(msg:MsgLogin)=>{
                if(msg && msg.resp){
                    console.log(msg.resp);
                }
                COMMON.initFromServer(msg.resp);
                this.endStep();
            },this)
        }else if(GLOBAL.serverType == ServerType.Debug){
            NET.send(MsgLogin.create(GLOBAL.testAccount,"",{name:"测试1"}),(msg:MsgLogin)=>{
                if(msg && msg.resp){
                    console.log(msg.resp);
                }
                COMMON.initFromServer(msg.resp);
                this.endStep();
            },this)
        }else if(GLOBAL.serverType == ServerType.Publish){
            NET.send(MsgLogin.create("",GLOBAL.code,GLOBAL.loginUserInfo),(msg:MsgLogin)=>{
                if(msg && msg.resp){
                    console.log(msg.resp);
                }
                COMMON.initFromServer(msg.resp);
                this.endStep();
            },this)
        }
        
    }
}