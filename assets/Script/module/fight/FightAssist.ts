import FightPanel from "../../view/fight/FightPanel";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import UIBase from "../../component/UIBase";
import FightInfo from "../../model/FightInfo";
import FightLogic, { FightResult } from "./FightLogic";
import FightAction, { BuffAction } from "./FightAction";
import SkillLogic from "./SkillLogic";
import { FightOnce } from "./FightReady";

export default class FightAssist{
    private static _instance: FightAssist = null;
    public static getInstance(): FightAssist {
        if (FightAssist._instance == null) {
            FightAssist._instance = new FightAssist();
        }
        return FightAssist._instance;
    }

    public _fightPanel:FightPanel = null;
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
        result.fightReady.buffs.forEach((action: BuffAction)=> {
            console.log(action.desc);
        });
        result.fights.forEach((fight: FightOnce)=> {
            if(fight.attackSkill)
                console.log(fight.attackSkill.desc);
            if(fight.beAttackSkill)
                console.log(fight.beAttackSkill.desc);
            if(fight.fightAction)
                console.log(fight.fightAction.desc);
        });
        console.log(">>>"+(result.victory?"胜利":"失败"));
        if(this._fightPanel){
            this._fightPanel.playAction(result);
        }
    }

    public endFight(){
        if(!this._isFighting || this._fightPanel==null)
        this._fightPanel = null;
        this._isFighting = false;
        this._fightPanel.hide();
    }
}

export var Fight = FightAssist.getInstance();