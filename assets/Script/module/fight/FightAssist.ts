import FightPanel from "../../view/fight/FightPanel";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import UIBase from "../../component/UIBase";
import FightInfo, { FightPlayerType } from "../../model/FightInfo";
import FightLogic, { FightResult } from "./FightLogic";
import { BuffAction } from "./FightAction";
import SkillLogic from "./SkillLogic";
import FightOnce from "./FightOnce";
import { Passage } from "../battle/PassageAssist";
import ResInfo, { ResType } from "../../model/ResInfo";

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


    public showFight(infoMine:FightInfo,infoEnemy:FightInfo){
        if(this._isFighting)
            return;
        this._infoMine = infoMine;
        this._infoEnemy = infoEnemy;
        this._isFighting = true;
        
        UI.createPopUp(ResConst.FightPanel,{mine:infoMine,enemy:infoEnemy},(ui:UIBase)=>{
            this._fightPanel = ui as FightPanel;
            // this._fightPanel.show();
        });
    }

    public startFight(){
        this._fight = new FightLogic(this._infoMine.lineup,this._infoEnemy.lineup);
        this._skill = new SkillLogic();
        this._fight.start(this.endFunc.bind(this));
    }


    private endFunc(result:FightResult){
        this._result = result;
        if(this._fightPanel){
            this._fightPanel.initResult(result,this.resultEnd.bind(this));
        }
    }

    private _result:FightResult = null;
    private resultEnd(){
        if(this._infoEnemy.playerType == FightPlayerType.Boss){ 
            if(this._result.victory){//挑战boss成功
                Passage.fightBossSuccess((restAdd:ResInfo,expadd:number)=>{
                    UI.createPopUp(ResConst.FightResult,
                            {result:this._result,
                                fightMine:this._infoMine,
                                fightEnemy:this._infoEnemy,
                                rewards:[{type:ResType.gold,value:restAdd.gold},
                                {type:ResType.lifeStone,value:restAdd.lifeStone},
                                {type:ResType.exp,value:expadd}
                            ]});
                });
            }else{
                UI.createPopUp(ResConst.FightResult,
                    {result:this._result,
                        fightMine:this._infoMine,
                        fightEnemy:this._infoEnemy,
                        rewards:[]});
            }
        }else if(this._infoEnemy.playerType == FightPlayerType.Enemy){  //征战成功

        }
    }

    public endFight(){
        if(!this._isFighting || this._fightPanel==null){
            return;
        }
        this._isFighting = false;
        this._fightPanel.hide(()=>{
            this._fightPanel = null;
        });
    }
}

export var Fight = FightAssist.getInstance();