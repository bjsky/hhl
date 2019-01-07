import LineupInfo from "../../model/LineupInfo";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../loading/steps/LoadingStepConfig";
import { SOwnerLineup } from "../../net/msg/MsgLogin";
import { NET } from "../../net/core/NetController";
import MsgLineupModify from "../../net/msg/MsgLineupModify";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";

export default class LineupAssist{

    private static _instance: LineupAssist = null;
    public static getInstance(): LineupAssist {
        if (LineupAssist._instance == null) {
            LineupAssist._instance = new LineupAssist();
        }
        return LineupAssist._instance;
    }

    constructor(){
        EVENT.on(GameEvent.Card_Remove,this.onCardRemoved,this);
        EVENT.on(GameEvent.Card_update_Complete,this.onCardUpdate,this);
    }

    private onCardRemoved(e){
        var removeUUid = e.detail.uuid;
        for(var key in this.ownerLineupMap){
            var lineup:LineupInfo = this.ownerLineupMap[key];
            if(lineup.uuid == removeUUid){
                this.changeLineUp(Number(key),"");
            }
        }
    }
    private onCardUpdate(e){
        var upUuid = e.detail.uuid;
        for(var key in this.ownerLineupMap){
            var lineup:LineupInfo = this.ownerLineupMap[key];
            if(lineup.uuid == upUuid){
                lineup.updateOwner();
            }
        }
    }
    
    //上阵的卡牌
    public ownerLineupMap:any = {};
    private _ownerSLineup:SOwnerLineup[] = [];

    public initOwnerLineup(lineups:Array<SOwnerLineup>){
        this._ownerSLineup = lineups;
        this.ownerLineupMap = {};
        lineups.forEach((lineup:SOwnerLineup)=>{
            if(lineup.uuid!=""){
                var info:LineupInfo = new LineupInfo();
                info.initOwner(lineup);
                this.ownerLineupMap[lineup.pos] = info;
            }
        })
    }

    public getServerLineup(){
        return this._ownerSLineup.slice();
    }

    public getBossLineupMap(passageId:number):any{
        var lineupBoss:any  = {};
        var passCfg = CFG.getCfgDataById(ConfigConst.Passage,passageId);
        var lineupIds:string = passCfg.amyHero;
        var lineupGradeLevel:string = passCfg.amyHeroGradeLv;
        if(lineupIds!=""){
            var ids:Array<string> = lineupIds.split(";");
            var lineup:LineupInfo;
            var gradeLvs:Array<string> = lineupGradeLevel.split("|");
            var gradelv:string;
            for(var i:number = 0;i<ids.length;i++){
                lineup = new LineupInfo();
                gradelv = gradeLvs[i];
                lineup.initBoss(i,Number(ids[i]),Number(gradelv.split(";")[0]),Number(gradelv.split(";")[1]));
                lineupBoss[i] = lineup;
            }
        }
        return lineupBoss;
    }

    public checkOwnerDuplicate(cardId:number){
        for(var key in this.ownerLineupMap){
            if((this.ownerLineupMap[key] as LineupInfo).cardId == cardId){
                return true;
            }
        }
        return false;
    }

    public changeLineUp(pos:number,uuid:string){
        var str:string = pos +";"+uuid;
        NET.send(MsgLineupModify.create(str),(msg:MsgLineupModify)=>{
            if(msg && msg.resp){
                Lineup.initOwnerLineup(msg.resp.lineUpOwner);
                EVENT.emit(GameEvent.Lineup_Changed);
            }
        },this)
    }

    public exchangeLineup(pos1:number,uuid1:string,pos2:number,uuid2:string){
        var str:string = pos1 +";"+uuid1 + "|"+pos2+";"+uuid2;
        NET.send(MsgLineupModify.create(str),()=>{

        },this)
    }
}

export var Lineup = LineupAssist.getInstance();