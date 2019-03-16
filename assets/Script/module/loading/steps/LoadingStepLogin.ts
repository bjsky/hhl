
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
            if(GAME.isReLogin){
                this.endStep();
            }else{
                GAME.setLoginEnd(false);
            }
        }else if(GLOBAL.serverType == ServerType.Debug){
            if(GAME.isReLogin){
                this.endStep();
            }else{
                GAME.setLoginEnd(false);
            }
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
                    GAME.setLoginEnd(true);
                }else{
                    GLOBAL.initUserInfo(userInfo);
                    GAME.setLoginEnd(false);
                }
            })
        }
    }

    public resume(){
        this.endStep();
    }
}