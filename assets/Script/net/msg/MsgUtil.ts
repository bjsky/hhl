import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MsgLogin from "./MsgLogin";
import MsgGuideUpdate from "./MsgGuideUpdate";
import MsgCardSummon from "./MsgCardSummon";
import MsgBuildUpdate from "./MsgBuildUpdate";
/**
 * 太特么坑了，父类中还不能导入子类
 */
export default class MsgUtil{
    
    //创建response message
    public static createMessage(id:number):MessageBase{
        var message:MessageBase = null;
        switch(id){
            case NetConst.Login:{
                message = new MsgLogin();
            }break;
            case NetConst.GuideUpdate:
                message = new MsgGuideUpdate();
            break;
            case NetConst.CardSummon:{
                message = new MsgCardSummon();
            }break;
            case NetConst.BuildUpdate:
                message = new MsgBuildUpdate();
            break;
            default:
            message = null;
            break;
        }
        return message;
    }
}