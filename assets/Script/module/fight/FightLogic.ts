import FightObject, { FightTeamObject } from "./FightObject";
import { Fight } from "./FightAssist";
import FightReady, { FightOnce } from "./FightReady";

export class FightResult{
    constructor(victory:boolean ,evaluate:number=0){
        this.victory = victory;
        this.evaluate = evaluate;
    }
    //是否胜利
    public victory:boolean = false;
    //评价
    public evaluate:number = 0;
    //准备阶段
    public fightReady:FightReady = new FightReady();
    //战斗
    public fights:Array<FightOnce> = [];
}

export default class FightLogic extends cc.EventTarget{

    private _lineupMine:any = null;
    private _lineupEnemy:any = null;

    private _fightTeamMine:FightTeamObject = null;
    private _fightTeamEnemy:FightTeamObject = null;

    private _isMyTeamfight:boolean  = true;
    private _isEnd:boolean = false;

    private _ready:FightReady = null;
    private _fights:Array<FightOnce>  = [];

    constructor(lineupMine:any,linupEnemy:any){
        super();
        this._lineupMine = lineupMine;
        this._lineupEnemy = linupEnemy;

        //自己队
        var teamMine:FightTeamObject = new FightTeamObject();
        teamMine.fightObjArr = [];
        for (var key in this._lineupMine){
            var foMine:FightObject = new FightObject(this._lineupMine[key],true);
            teamMine.fightObjArr.push(foMine);
        }
        this._fightTeamMine = teamMine;

        //敌队
        var teamEnemy:FightTeamObject = new FightTeamObject();
        teamEnemy.fightObjArr = [];
        for (var key in this._lineupEnemy){
            var foEnemy:FightObject = new FightObject(this._lineupEnemy[key],false);
            teamEnemy.fightObjArr.push(foEnemy);
        }
        this._fightTeamEnemy = teamEnemy;
    }

    private _endCallback:Function = null;
    public start(cb:Function){
        this._isMyTeamfight = true;
        this._isEnd = false;
        this._endCallback = cb;
        this._fights = [];

        this._ready = Fight.skill.checkReady();

        this.attckOnce();
    }

    public attckOnce(){
        var attckObj:FightObject = this.getTeam(this._isMyTeamfight).getFightObj();
        if(attckObj == null){
            this.endFight(false,0)
            return;
        }
        var beAttackTeam:FightTeamObject = this.getTeam(!this._isMyTeamfight);
        var beAttackObj:FightObject = beAttackTeam.getFightObj();
        if(beAttackObj == null){
            this.endFight(true,3);
            return;
        }

        var fightOnce:FightOnce = new FightOnce(attckObj,beAttackObj);
        fightOnce.fight();
        this._fights.push(fightOnce);
        if(fightOnce.isEnemyDead){
            this._isEnd = beAttackTeam.next();
        }
        if(!this._isEnd){
            this._isMyTeamfight = !this._isMyTeamfight;
            this.attckOnce();
        }else{
            this.endFight(this._isMyTeamfight,0);
        }
    }

    public endFight(victory:boolean,evaluate:number){
        var result = new FightResult(victory,evaluate);
        result.fights = this._fights;
        result.fightReady = this._ready;
        this._endCallback && this._endCallback(result);
    }

    //队伍
    public getTeam(isMyTeam:boolean):FightTeamObject{
        return isMyTeam?this._fightTeamMine:this._fightTeamEnemy;
    }
    //战斗对象
    public getFightObj(isMyTeam:boolean,pos:number):FightObject{
        var team = this.getTeam(isMyTeam);
        var fo:FightObject;
        for(var i:number = 0;i<team.fightObjArr.length;i++){
            fo = team.fightObjArr[i] as FightObject;
            if(fo.lineup.pos == pos){
                return fo;
            }
        }
        return null;
    }
}