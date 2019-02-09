import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import MsgLogin from "./MsgLogin";
import MsgGuideUpdate from "./MsgGuideUpdate";
import MsgCardSummon from "./MsgCardSummon";
import MsgBuildUpdate from "./MsgBuildUpdate";
import MsgCardUpLv from "./MsgCardUpLv";
import MsgCardUpStar from "./MsgCardUpStar";
import MsgCardDestroy from "./MsgCardDestroy";
import MsgLineupModify from "./MsgLineupModify";
import MsgCardSummonGuide from "./MsgCardSummonGuide";
import MsgCollectRes from "./MsgCollectRes";
import MsgFightBoss from "./MsgFightBoss";
import MsgGetReward from "./MsgGetReward";
import MsgDiamondBuy from "./MsgDiamondBuy";
import MsgHeartBeat from "./MsgHeartBeat";
import MsgGetEnemyList from "./MsgGetEnemyList";
import MsgGetPersonalEnemy from "./MsgGetPersonalEnemy";
import MsgFightEnemy from "./MsgFightEnemy";
import MsgPushBeRab from "./MsgPushBeRab";
import MsgGetRankList from "./MsgGetRankList";
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
            case NetConst.CardUpLv:
                message = new MsgCardUpLv();
            break;
            case NetConst.CardUpStar:
                message = new MsgCardUpStar();
            break;
            case NetConst.CardDestroy:
                message = new MsgCardDestroy();
            break;
            case NetConst.LineupModify:
                message = new MsgLineupModify();
            break;
            case NetConst.CardSummonGuide:
                message = new MsgCardSummonGuide();
            break;
            case NetConst.CollectPassageRes:
                message = new MsgCollectRes();
            break;
            case NetConst.FightBoss:
                message = new MsgFightBoss();
            break;
            case NetConst.GetReward:
                message = new MsgGetReward();
            break;
            case NetConst.DiamondBuy:
                message = new MsgDiamondBuy();
            break;
            case NetConst.Heart:
                message = new MsgHeartBeat();
            break;
            case NetConst.GetEnemyList:
                message = new MsgGetEnemyList();
            break;
            case NetConst.GetPersonalEnemy:
                message = new MsgGetPersonalEnemy();
            break;
            case NetConst.FightEnemy:
                message = new MsgFightEnemy();
            break;
            case NetConst.PushBeRab:
                message = new MsgPushBeRab();
            break;
            case NetConst.GetRankList:
                message = new MsgGetRankList();
            break;
            default:
            message = null;
            break;
        }
        return message;
    }
}