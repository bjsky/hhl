
import { GLOBAL, ServerType } from "../../../GlobalData";
import LoadStep from "../LoadStep";
import { NET } from "../../../net/core/NetController";
import { GAME } from "../../../GameController";
/**
 * 加载配置
 */
export default class LoadingStepServerConn extends LoadStep{
    protected onStep(){
        console.log("LoadingStepServerConn:start");
        if(GLOBAL.serverType == ServerType.Client){
            this.endStep();
        }else if(GLOBAL.serverType == ServerType.Debug){
            this.doConnect();
        }else if(GLOBAL.serverType == ServerType.Publish){
            this.doConnect();
        }
    }

    private doConnect(){
        if(GAME.isReLogin){
            NET.reConnect(()=>{
                this.endStep();
            })
        }else{
            NET.connect(GLOBAL.serverUrl,(resp)=>{
                console.log("LoadingStepServerConn:Connected")
                this.endStep();
            },this)
        }
    }
}