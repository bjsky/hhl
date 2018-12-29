import LoadingStep from "../loadingStep";
import { NET } from "../../../net/core/NetController";
import MsgLogin from "../../../net/msg/MsgLogin";
import { COMMON } from "../../../CommonData";
import { CONSTANT } from "../../../Constant";
/**
 * 加载配置
 */
export default class LoadingStepServerData extends LoadingStep{

    public doStep(){
        CONSTANT.initConstant();
        NET.send(MsgLogin.create("123","",""),(msg:MsgLogin)=>{
            if(msg && msg.resp){
                console.log(msg.resp);
            }
            COMMON.initFromServer(msg.resp);
            this.endStep();
        },this)
    }
}