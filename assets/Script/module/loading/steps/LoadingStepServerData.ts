import LoadingStep from "../loadingStep";
import { NET } from "../../../net/core/NetController";
import MsgLogin from "../../../net/msg/MsgLogin";
import NetConst from "../../../net/NetConst";
import { COMMON } from "../../../CommonData";
/**
 * 加载配置
 */
export default class LoadingStepServerData extends LoadingStep{

    public doStep(){
        NET.send(MsgLogin.createLocal(),(msg:MsgLogin)=>{
            if(msg && msg.resp){
                console.log(msg.resp);
            }
            COMMON.initFromServer(msg.resp);
            this.endStep();
        },this)
    }
}