import FightPanel from "../../view/fight/FightPanel";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../loading/steps/LoadingStepRes";
import UIBase from "../../component/UIBase";

export default class FightAssist{
    private static _instance: FightAssist = null;
    public static getInstance(): FightAssist {
        if (FightAssist._instance == null) {
            FightAssist._instance = new FightAssist();
        }
        return FightAssist._instance;
    }

    public _fightPanel:FightPanel = null;

    private _isFighting:boolean = false;

    public showFight(lineupMine:any,lineupAmy:any){
        if(this._isFighting)
            return;
        this._isFighting = true;
        
        UI.createPopUp(ResConst.FightPanel,{},(ui:UIBase)=>{
            this._fightPanel = ui as FightPanel;
            // this._fightPanel.show();
        });
    }

    public endFight(){
        if(!this._isFighting || this._fightPanel==null)
        this._fightPanel = null;
        this._isFighting = false;
        this._fightPanel.hide();
    }
}

export var Fight = FightAssist.getInstance();