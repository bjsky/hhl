import LoadingStep from "../loadingStep";
import { GLOBAL, ServerType } from "../../../GlobalData";
import { LoadingStepEnum } from "../LoadingStepManager";
import { WeiXin } from "../../../wxInterface";
import { EVENT } from "../../../message/EventCenter";
import GameEvent from "../../../message/GameEvent";
/**
 * 登录平台
 */
export default class LoadingStepLogin extends LoadingStep{
    public doStep(){
        if(GLOBAL.serverType == ServerType.Client){
            //客户端直接返回测试数据
            this.setNext(LoadingStepEnum.ServerData);
        }else if(GLOBAL.serverType == ServerType.Debug){
            //连服务器
            this.setNext(LoadingStepEnum.ServerConnect);
            // this.setNext(LoadingStepEnum.ServerData);
        }else if(GLOBAL.serverType == ServerType.Publish){
            //微信登录
            WeiXin.wxLogin(this.loginCb.bind(this));
        }
    }

    public loginCb(res){
        console.log("LoadingStepLogin:wxLogin,",JSON.stringify(res));
        GLOBAL.code = res.code;

        // this.setNext(LoadingStepEnum.ServerConnect);
        WeiXin.getUserInfo((userInfo)=>{
            if(userInfo==null){
                EVENT.emit(GameEvent.Show_UserInfo_AuthButton);
            }else{
                GLOBAL.initUserInfo(userInfo);
                this.setNext(LoadingStepEnum.ServerConnect);
            }
        })
    }
}