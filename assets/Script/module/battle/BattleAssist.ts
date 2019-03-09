import { SBattleInfo, SResInfo, SFightRecord } from "../../net/msg/MsgLogin";
import BattleInfo, { FightRecord } from "../../model/BattleInfo";
import { EnemyTypeEnum } from "../../model/EnemyInfo";
import MsgGetEnemyList, { SEnemyInfo } from "../../net/msg/MsgGetEnemyList";
import { NET } from "../../net/core/NetController";
import { CONSTANT } from "../../Constant";
import { COMMON } from "../../CommonData";
import MsgGetPersonalEnemy, { SPersonalEnemyInfo } from "../../net/msg/MsgGetPersonalEnemy";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { Lineup } from "./LineupAssist";
import BuildInfo from "../../model/BuildInfo";
import { BUILD } from "../build/BuildAssist";
import { BuildType } from "../../view/BuildPanel";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { ResType } from "../../model/ResInfo";
import { GLOBAL, ServerType } from "../../GlobalData";
import DemoFightRecord from "../../utils/DemoFightRecord";
import EnemyInfo from "../../model/EnemyInfo";
import MsgFightEnemy from "../../net/msg/MsgFightEnemy";
import CardInfo from "../../model/CardInfo";
import { Card, CardRemoveType } from "../card/CardAssist";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import { BeFightPanelType } from "../../view/castle/BeFightPanel";
import { GUIDE } from "../../manager/GuideManager";
import MsgPushFightCard from "../../net/msg/MsgPushFightCard";
import { Task, TaskType } from "../TaskAssist";

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
    private _enemyListComplete:boolean =false;
    private _personalEnemeyList:Array<EnemyInfo> = [];
    private _personalEnemyListComplete:boolean =false;
    public get battleInfo():BattleInfo{
        return this._battleInfo;
    }
    public get enemyList():Array<EnemyInfo>{
        return this._enemyList;
    }
    public get personalEnemyList():Array<EnemyInfo>{
        return this._personalEnemeyList;
    }

    public initBattle(info:SBattleInfo){
        this._battleInfo.initFromServer(info);
        this.initEnemyList();
        this.initPersonalEnemyList();
        this.initScoreCfg();
    }

    public updateBattleInfo(info:SBattleInfo){
        this._battleInfo.initFromServer(info);
        this.initScoreCfg();
        //更新成长
        Task.updateGrowthReward();
        EVENT.emit(GameEvent.Battle_data_Change);
    }
    //是否可以攻击或者复仇
    public get isCanFightOrRevenge(){
        return this._battleInfo.actionPoint>0 || (this._battleInfo.revengeTime<=0 && this._personalEnemeyList.length>0);
    }

    public initEnemyList(){
        var levelArea:number = CONSTANT.getEnemyListLevelArea();
        var levelMin = COMMON.userInfo.level - levelArea;
        if(levelMin<2) levelMin = 2;
        var levelMax = COMMON.userInfo.level + levelArea;
        if(levelMax>CONSTANT.getMaxPlayerLevel()) levelMax = CONSTANT.getMaxPlayerLevel();
        NET.send(MsgGetEnemyList.create(levelMin,levelMax,0),(msg:MsgGetEnemyList)=>{
            if(msg && msg.resp){
                this._enemyList = this.createEnemyList(msg.resp.enmeyList);
                this._enemyListComplete = true;
            }
        },this)
    }

    public initPersonalEnemyList(){
        NET.send(MsgGetPersonalEnemy.create(),(msg:MsgGetPersonalEnemy)=>{
            if(msg && msg.resp){
                this._personalEnemeyList = this.createPersonalEnemyList(msg.resp.personalEnmeyList);
                this._personalEnemyListComplete = true;
            }
        },this)
    }

    //战场数据初始化完成
    public get battleDataInited():boolean{
        return this._enemyListComplete && this._personalEnemyListComplete;
    }

    private createEnemyList(sList:Array<SEnemyInfo>):Array<EnemyInfo>{
        var enemyArr:Array<EnemyInfo> = [];
        var info:EnemyInfo = null;
        sList.forEach((sInfo:SEnemyInfo)=>{
            info = new EnemyInfo();
            info.initEnemy(sInfo,EnemyTypeEnum.Enemy);
            enemyArr.push(info);
        })
        if(enemyArr.length<5){       //补机器人
            var passIds:number[] = this.getRobotPassageIds();
            var count:number = 5- enemyArr.length;
            while(count>0){
                count--;
                info = new EnemyInfo();
                var passId:number = (passIds.length>0?passIds[Math.floor(Math.random()*passIds.length)]:1);
                info.initRobot(passId);
                enemyArr.push(info);
            }
        }
        // this.addTestEnemy(enemyArr);
        return enemyArr;
    }

    private addTestEnemy(arr:EnemyInfo[]){
        var test:EnemyInfo = new EnemyInfo();
        test.enemyType = EnemyTypeEnum.Enemy;
        test.enemyUid = "10000000100000";
        test.enemyName = "大宝";
        test.enemyLevel = 3;
        test.enemySex = 1;
        test.enemyIcon = "default";
        test.enemyLineupMap = {};
        test.enemyTotalPower = 0;
        test.enemyScore = 0;
        test.isAttacked = false;
        arr.push(test);
    }

    private createPersonalEnemyList(sList:Array<SPersonalEnemyInfo>):Array<EnemyInfo>{
        var enemyArr:Array<EnemyInfo> = [];
        var info:EnemyInfo = null;
        sList.forEach((sInfo:SPersonalEnemyInfo)=>{
            info = new EnemyInfo();
            info.initEnemy(sInfo.enmeyInfo,EnemyTypeEnum.PersonlEnemy,sInfo.lastRabTime);
            enemyArr.push(info);
        })
        return enemyArr;
    }

    private getRobotPassageIds():number[]{
        var powArea:number = CONSTANT.getRobotPowerArea();
        var powerMin:number = Lineup.ownerLineupPower - powArea;
        var powerMax:number = Lineup.ownerLineupPower + powArea;
        var ids:number[] = [];
        var passageCfgs:any = CFG.getCfgGroup(ConfigConst.Passage);
        var passageCfg:any;
        for(var key in passageCfgs){
            passageCfg = passageCfgs[key];
            var needPower = Number(passageCfg.needPower);
            if(needPower<=powerMax && needPower>= powerMin){
                ids.push(Number(passageCfg.id));
            }
        }
        return ids;
    }

    // public getEnemyInfoByUid(uid:string):EnemyInfo{
    //     var info:EnemyInfo = null;
    //     for(var i:number = 0;i<this._enemyList.length;i++){
    //         if(this._enemyList[i].enemyUid == uid){
    //             info = this._enemyList[i];
    //             break;
    //         }
    //     }
    //     if(info==null){
    //         for(var i:number = 0;i<this._personalEnemeyList.length;i++){
    //             if(this._personalEnemeyList[i].enemyUid == uid){
    //                 info = this._personalEnemeyList[i];
    //                 break;
    //             }
    //         }
    //     }
    //     return info;
    // }

    //侦查敌人完成
    public scoutEnemyList(cost:number){
        var levelArea:number = CONSTANT.getEnemyListLevelArea();
        var levelMin = COMMON.userInfo.level - levelArea;
        if(levelMin<2) levelMin = 2;
        var levelMax = COMMON.userInfo.level + levelArea;
        if(levelMax>CONSTANT.getMaxPlayerLevel()) levelMax = CONSTANT.getMaxPlayerLevel();
        NET.send(MsgGetEnemyList.create(levelMin,levelMax,cost),(msg:MsgGetEnemyList)=>{
            if(msg && msg.resp){
                var cost:SResInfo = COMMON.updateResInfo(msg.resp.resInfo);
                this._enemyList = this.createEnemyList(msg.resp.enmeyList);
                // 建筑升级完成
                EVENT.emit(GameEvent.Battle_scout_Complete);
                EVENT.emit(GameEvent.Res_update_Cost_Complete,{types:[{type:ResType.gold,value:cost.gold}]});
            }

            //完成任务
            Task.finishTask(TaskType.RefreshEnemy);
        },this)
    }

    public refreshPersonalEnemy(){
        NET.send(MsgGetPersonalEnemy.create(),(msg:MsgGetPersonalEnemy)=>{
            if(msg && msg.resp){
                if(msg.resp.battleInfo!=null){
                    this._battleInfo.initFromServer(msg.resp.battleInfo);
                }
                this._personalEnemeyList = this.createPersonalEnemyList(msg.resp.personalEnmeyList);
                this._personalEnemyListComplete = true;
                // 刷新仇人
                EVENT.emit(GameEvent.Battle_refresh_personalEnemey);
            }
        },this)
        
    }
    //挑战敌人成功
    public fightEnemeySuccess(enemyInfo:EnemyInfo,victory:boolean,evaluate:number,isGuide:boolean,isDouble:boolean,cb:Function){
        if(victory){
            //挑战配置
            var fightScoreCfg :any= this.getFightScoreCfg(enemyInfo.enemyScore)
            var addExp:number = this.getAddExpBuffed();
            var addDiamond:number = this.getAddDiamondBuffed();
            var addScore = evaluate;
            if(isDouble){
                addExp *= 2;
                addDiamond *=2;
                addScore *=2;
            }
            var costActionPoint = 1;
            var isRevenge = (enemyInfo.enemyType == EnemyTypeEnum.PersonlEnemy);
            var getCardRate = Number(fightScoreCfg.getCardRate);
            if(isRevenge){  //复仇双倍
                getCardRate *=2;
                costActionPoint = 0;
            }
            var isRabCard:boolean = (Math.random()<getCardRate); 
            var rate ="";
            if(isRabCard){  
                rate = fightScoreCfg.getCardRateStr;
            }
        }else{
            addExp = 0;
            addDiamond =0;
            addScore = 0;
            costActionPoint =1;
            isRevenge = (enemyInfo.enemyType == EnemyTypeEnum.PersonlEnemy);
            if(isRevenge){
                costActionPoint = 0;
            }
            isRabCard = false;
            rate ="";
        }

        NET.send(MsgFightEnemy.create(enemyInfo.enemyUid,enemyInfo.enemyName,
            addExp,addDiamond,addScore,costActionPoint,isRevenge,isRabCard,rate,isGuide),(msg:MsgFightEnemy)=>{
            if(msg && msg.resp){
                COMMON.updateUserInfo(msg.resp.userInfo);  //更新用户数据
                COMMON.updateResInfo(msg.resp.resInfo); //更新资源数据
                Battle.updateBattleInfo(msg.resp.battleInfo); //更新战场数据
                EVENT.emit(GameEvent.FightEnemey_Success,{info:enemyInfo});
                var cardInfo:CardInfo = null;
                if(msg.resp.addCard!=null){
                    Card.addNewCard(msg.resp.addCard);
                    cardInfo = Card.getCardByUUid(msg.resp.addCard.uuid);
                }
                cb && cb(addExp,addDiamond,addScore,cardInfo);
            }
        },this)
    }

    public onPushRabCard(msg:MsgPushFightCard){
        if(msg && msg.resp){
            var record = new FightRecord();
            var scoreChange:number = Math.abs(this._battleInfo.score - msg.resp.score);
            record.initFromPush(msg.resp,scoreChange);
            if(scoreChange>0){
                this.battleInfo.score  = msg.resp.score;//-= msg.resp.score;
                EVENT.emit(GameEvent.Battle_data_Change);
                if(record.isRabCard){
                    UI.createPopUp(ResConst.BeFightPanel,{type:BeFightPanelType.BeFight,records:[record]});
                    //移除卡牌
                    Card.removeCardByUUid(record.rabCardUuid);
                    EVENT.emit(GameEvent.Card_Remove,{uuid:record.rabCardUuid,type:CardRemoveType.RabRemove});
                }
            }
            //刷新仇人
            this.refreshPersonalEnemy();
        }
    }

    ////////////////////
    //  积分
    ////////////////////
    private _scoreTypeCfgMap:any = {}
    private _scoreTypeCfg:any = null;
    public get scoreTypeCfgMap(){
        return this._scoreTypeCfgMap;
    }
    private initScoreCfg(){
        var scoreMap:any = CFG.getCfgGroup(ConfigConst.Score);
        var scoreCfg:any = null;
        for(var key in scoreMap){
            scoreCfg = scoreMap[key];
            if(this._scoreTypeCfgMap[scoreCfg.scoreType]==undefined){
                this._scoreTypeCfgMap[scoreCfg.scoreType] = {type:scoreCfg,subs:[scoreCfg]};
            }else{
                this._scoreTypeCfgMap[scoreCfg.scoreType].subs.push(scoreCfg);
            }
        }
        this._scoreTypeCfg = this.getScoreTypeCfg();
    }

    private getScoreTypeCfg(){
        var scoreTypeCfg:any = null;
        for(var key in this._scoreTypeCfgMap){
            var typeObj:any = this._scoreTypeCfgMap[key].type;
            var scoreMin:number = Number(typeObj.scoreMin);
            var scoreMax:number = Number(typeObj.scoreMax);
            if(scoreMax==0){
                if(this._battleInfo.score>=scoreMin){
                    scoreTypeCfg = typeObj;
                    break;
                }
            }if(scoreMin==0){
                if(this._battleInfo.score<scoreMax){
                    scoreTypeCfg = typeObj;
                    break;
                }
            }else{
                if(this._battleInfo.score>=scoreMin && this._battleInfo.score<scoreMax){
                    scoreTypeCfg = typeObj;
                    break;
                }
            }
        }
        return scoreTypeCfg;
    }

    public getFightScoreCfg(enemyScore:number){
        var enemyScoreCompare = enemyScore - this._battleInfo.score;
        var fightScoreArr = CFG.getCfgByKey(ConfigConst.Score,"scoreType",this._scoreTypeCfg.scoreType);
        var retCfg:any = null;
        for(var i:number=0;i<fightScoreArr.length;i++){
            var scorecfg = fightScoreArr[i];
            var scoreMin:number = Number(scorecfg.scoreSubMin);
            var scoreMax:number = Number(scorecfg.scoreSubMax);
            if(scoreMax==0){
                if(enemyScoreCompare>=scoreMin){
                    retCfg = scorecfg;
                    break;
                }
            }if(scoreMin==0){
                if(enemyScoreCompare<scoreMax){
                    retCfg = scorecfg;
                    break;
                }
            }else{
                if(enemyScoreCompare>=scoreMin && enemyScoreCompare<scoreMax){
                    retCfg = scorecfg;
                    break;
                }
            }
        }
        return retCfg;
    }

    public getAddExpBuffed(){
        var build:BuildInfo = BUILD.getBuildInfo(BuildType.Castle);
        var value = Number(this._scoreTypeCfg.getExp);
        if(build){
            var buffedValue = Number(build.buildLevelCfg.addValue);
            value *= (1 + buffedValue)
        }
        return value;
    }
    public getAddDiamondBuffed(){
        var build:BuildInfo = BUILD.getBuildInfo(BuildType.Castle);
        var value = Number(this._scoreTypeCfg.getDiamond);
        if(build){
            var buffedValue = Number(build.buildLevelCfg.addValue);
            value *= (1 + buffedValue)
        }
        return value;
    }


    private _fightRecordsMap:any = {};
    public outlineRecords:FightRecord[] = [];
    public updateFightRecords(uid:string,sRecords:Array<SFightRecord>):Array<FightRecord>{
        var records:Array<FightRecord> = [];
        var record:FightRecord = null;
        sRecords.forEach((sRecord:SFightRecord)=>{
            record = new FightRecord();
            record.initFromServer(sRecord);
            records.push(record);
        })
        this._fightRecordsMap[uid] = records;
        return records;
    }

    public initOutlineFightRecords(sRecords:SFightRecord[]){
        var record:FightRecord = null;
        this.outlineRecords = [];
        if(GLOBAL.serverType == ServerType.Client){
            DemoFightRecord.initDemo();
            DemoFightRecord.demo1.forEach((sRecord:SFightRecord)=>{
                record = new FightRecord();
                record.initFromServer(sRecord);
                this.outlineRecords.push(record);
            })
        }else{
            sRecords.forEach((sRecord:SFightRecord)=>{
                record = new FightRecord();
                record.initFromServer(sRecord);
                this.outlineRecords.push(record);
            })
        }
    }
}

export var Battle:BattleAssist = BattleAssist.getInstance();