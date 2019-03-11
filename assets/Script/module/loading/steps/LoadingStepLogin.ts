
import LoadStep from "../LoadStep";
import { ServerType, GLOBAL } from "../../../GlobalData";
import { WeiXin } from "../../../wxInterface";
import { EVENT } from "../../../message/EventCenter";
import GameEvent from "../../../message/GameEvent";
import { GAME } from "../../../GameController";
/**
 * 登录平台
 */
export default class LoadingStepLogin extends LoadStep{
    protected onStep(){
        if(GLOBAL.serverType == ServerType.Client){
            this.endStep();
        }else if(GLOBAL.serverType == ServerType.Debug){
            this.endStep();
        }else if(GLOBAL.serverType == ServerType.Publish){
            //微信登录
            WeiXin.wxLogin(this.loginCb.bind(this));
        }
    }

    public loginCb(res){
        console.log("LoadingStepLogin:wxLogin,",JSON.stringify(res));
        GLOBAL.code = res.code;
        if(GAME.isReLogin){
            this.endStep();
        }else{
            WeiXin.getUserInfo((userInfo)=>{
                if(userInfo==null){
                        EVENT.emit(GameEvent.Show_UserInfo_AuthButton);
                }else{
                    GLOBAL.initUserInfo(userInfo);
                    this.endStep();
                }
            })
        }
    }

    public resume(){
        this.endStep();
    }
}