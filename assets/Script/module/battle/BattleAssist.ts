import { SBattleInfo } from "../../net/msg/MsgLogin";
import BattleInfo from "../../model/BattleInfo";
import EnemyInfo from "../../model/EnemyInfo";
import { SEnemyInfo } from "../../net/msg/MsgGetEnemyList";

export default class BattleAssist{

    private static _instance: BattleAssist = null;
    public static getInstance(): BattleAssist {
        if (BattleAssist._instance == null) {
            BattleAssist._instance = new BattleAssist();
        }
        return BattleAssist._instance;
    }

    private _battleInfo:BattleInfo = new BattleInfo();
    private _enemyList:Array<EnemyInfo> = [];
    private _personalEnemeyList:Array<EnemyInfo> = [];
    public get battleInfo():BattleInfo{
        return this._battleInfo;
    }

    public initBattle(info:SBattleInfo){
        this._battleInfo.initFromServer(info);
    }

    public initEnemyList(enemyList:Array<SEnemyInfo>){

    }

    public initPersonalEnemyList(personalEnemyList:Array<SEnemyInfo>){
        
    }
}

export var Battle:BattleAssist = BattleAssist.getInstance();