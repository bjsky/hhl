import FightPanel from "../../view/fight/FightPanel";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import UIBase from "../../component/UIBase";
import FightInfo, { FightPlayerType } from "../../model/FightInfo";
import FightLogic, { FightResult } from "./FightLogic";
import SkillLogic from "./SkillLogic";
import { Passage } from "../battle/PassageAssist";
import ResInfo, { ResType } from "../../model/ResInfo";
import { Battle } from "../battle/BattleAssist";
import EnemyInfo, { EnemyTypeEnum } from "../../model/EnemyInfo";
import { SOUND } from "../../manager/SoundManager";
import { GAME } from "../../GameController";
import { GUIDE } from "../../manager/GuideManager";
import LineupInfo from "../../model/LineupInfo";
import { Task, TaskType } from "../TaskAssist";

export default class FightAssist{
    private static _instance: FightAssist = null;
    public static getInstance(): FightAssist {
        if (FightAssist._instance == null) {
            FightAssist._instance = new FightAssist();
        }
        return FightAssist._instance;
    }

    private _fightPanel:FightPanel = null;
    public get panel():FightPanel{
        return this._fightPanel;
    }

    private _infoMine:FightInfo = null;
    private _infoEnemy:FightInfo = null;
    private _fight:FightLogic= null;
    private _skill:SkillLogic = null;

    public get fight():FightLogic{
        return this._fight;
    }
    public get skill():SkillLogic{
        return this._skill;
    }

    private _isFighting:boolean = false;
    public get isFighting(){
        return this._isFighting;
    }

    private _param:any = null;

    private _immediately:boolean =false;
    public showFight(infoMine:FightInfo,infoEnemy:FightInfo,immediately:boolean =false,param?:any){
        if(this._isFighting)
            return;
        var gInfoMine:FightInfo = infoMine;
        var gInfoEnemy:FightInfo = infoEnemy;
        this._immediately = immediately;
        if(GUIDE.isInGuide){
            if(infoEnemy.playerType == FightPlayerType.Boss){  //bos引导
                gInfoMine.lineup = this.getGuideLineup("9;1;3;8;5",5,1,infoMine.lineup[0]);
                gInfoEnemy.lineup = this.getGuideLineup("10;12;13;16;17",5,1)
            }else{  //征战引导
                gInfoMine.lineup = this.getGuideLineup("13;16;17;18;15",5,1,infoMine.lineup[0]);
                gInfoEnemy.lineup = this.getGuideLineup("1;3;9;10;16",5,1)
            }
        }

        this._infoMine = gInfoMine;
        this._infoEnemy = gInfoEnemy;
        this._isFighting = true;
        if(param!=undefined){
            this._param = param;
        }
        
        UI.hidePanelLayer();
        UI.createPopUp(ResConst.FightPanel,{mine:infoMine,enemy:infoEnemy},(ui:UIBase)=>{
            this._fightPanel = ui as FightPanel;
            // this._fightPanel.show();
        });
    }

    public startFight(){
        //增加引导阵容
        
        this._fight = new FightLogic(this._infoMine.lineup,this._infoEnemy.lineup);
        this._skill = new SkillLogic();
        this._fight.start(this.endFunc.bind(this));
    }

    private getGuideLineup(ids:string,grade:number,level:number,mylineup:LineupInfo= null){
        var lineup:any ={};
        var idsArr:string[] = ids.split(";");
        var info:LineupInfo = null
        for(var i:number = 0;i<5;i++){
            if(i== 0 && mylineup!=null){
                info = mylineup;
            }else{
                info = new LineupInfo();
                info.initBoss(i,Number(idsArr[i]),grade,level);
            }
            lineup[i] = info;
        }
        return lineup;
    }

    private endFunc(result:FightResult){
        this._result = result;
        this._result.immediately = this._immediately;
        if(this._fightPanel){
            this._fightPanel.initResult(result,this.resultEnd.bind(this));
        }
    }

    private _result:FightResult = null;
    private resultEnd(){
        var addGold:number = 0;
        var addStone:number = 0;
        var addExp:number = 0;
        var addDiamond:number = 0;
        var addScore:number = 0;
        if(this._infoEnemy.playerType == FightPlayerType.Boss){ 
            if(this._result.victory){//挑战boss成功
                addGold = Number(Passage.passageInfo.passageCfg.firstGold);
                addExp =  Number(Passage.passageInfo.passageCfg.firstExp);
                addStone =  Number(Passage.passageInfo.passageCfg.firstStone);
                UI.createPopUp(ResConst.FightResult,
                        {result:this._result,
                            fightMine:this._infoMine,
                            fightEnemy:this._infoEnemy,
                            rewards:[{type:ResType.gold,value:addGold},
                            {type:ResType.lifeStone,value:addStone},
                            {type:ResType.exp,value:addExp}
                        ]});
            }else{
                UI.createPopUp(ResConst.FightResult,
                    {result:this._result,
                        fightMine:this._infoMine,
                        fightEnemy:this._infoEnemy,
                        rewards:[]});
            }
        }else if(this._infoEnemy.playerType == FightPlayerType.Enemy){  //征战成功

            var enemy:EnemyInfo = this._param as EnemyInfo;
            enemy.isAttacked = true;
            if(this._result.victory){
                addExp = Battle.getAddExpBuffed();
                addDiamond = Battle.getAddDiamondBuffed();
                addScore = this._result.evaluate;
                UI.createPopUp(ResConst.FightResult,
                {
                    result:this._result,
                    fightMine:this._infoMine,
                    fightEnemy:this._infoEnemy,
                    addScore:addScore,
                    // addCard:cardInfo,
                    enemy:enemy,
                    rewards:[
                    {type:ResType.exp,value:addExp},
                    {type:ResType.diamond,value:addDiamond}
                ]});
                if(enemy.enemyType == EnemyTypeEnum.PersonlEnemy){  //复仇
                    //完成任务 
                    Task.finishTask(TaskType.RevengeEnemy);
                }else if(enemy.enemyType == EnemyTypeEnum.Enemy
                    ||enemy.enemyType == EnemyTypeEnum.Robit){
                    //完成任务 
                    Task.finishTask(TaskType.FightEnemy);
                }
            }else{
                UI.createPopUp(ResConst.FightResult,
                    {result:this._result,
                        fightMine:this._infoMine,
                        fightEnemy:this._infoEnemy,
                        enemy:enemy,
                        rewards:[]});
            }
        }
    }

    public endFight(){
        if(!this._isFighting || this._fightPanel==null){
            return;
        }
        this._isFighting = false;
        this._fightPanel.hide(()=>{

            GAME.showLevelUp();
            SOUND.playBgSound();
            UI.showPanelLayer();
            this._fightPanel = null;
        });
    }
}

export var Fight = FightAssist.getInstance();