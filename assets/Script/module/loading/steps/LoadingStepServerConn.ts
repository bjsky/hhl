import LoadingStep from "../loadingStep";
import { NET } from "../../../net/core/NetController";
import { GLOBAL } from "../../../GlobalData";
import { LoadingStepEnum } from "../LoadingStepManager";
/**
 * 加载配置
 */
export default class LoadingStepServerConn extends LoadingStep{

    public doStep(){
        super.doStep();
        console.log("LoadingStepServerConn:start");
        if(this.mgr.isRelogin){
            NET.reConnect(()=>{
                this.setNext(LoadingStepEnum.ServerData);
            })
        }else{
            NET.connect(GLOBAL.serverUrl,(resp)=>{
                console.log("LoadingStepServerConn:Connected")
                this.setNext(LoadingStepEnum.ServerData);
            },this)
        }
    }
}