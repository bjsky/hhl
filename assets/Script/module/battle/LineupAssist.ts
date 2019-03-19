import LineupInfo from "../../model/LineupInfo";
import { SOwnerLineup } from "../../net/msg/MsgLogin";
import { NET } from "../../net/core/NetController";
import MsgLineupModify from "../../net/msg/MsgLineupModify";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import FightInfo, { FightPlayerType } from "../../model/FightInfo";
import { COMMON } from "../../CommonData";
import { SEnemyLineup } from "../../net/msg/MsgGetEnemyList";
import CardInfo from "../../model/CardInfo";
import { Card } from "../card/CardAssist";
import { Task, TaskType } from "../TaskAssist";

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
        var removeUUid = e.uuid;
        for(var key in this.ownerLineupMap){
            var lineup:LineupInfo = this.ownerLineupMap[key];
            if(lineup.uuid == removeUUid){
                this.changeLineUp(Number(key),"");
            }
        }
    }
    private onCardUpdate(e){
        var upUuid = e.uuid;
        for(var key in this.ownerLineupMap){
            var lineup:LineupInfo = this.ownerLineupMap[key];
            var lineupPower:number = lineup.power;
            if(lineup.uuid == upUuid){
                lineup.updateOwner();
                this.ownerLineupPower += (lineup.power-lineupPower);
            }
        }
    }
    
    //上阵的卡牌
    public ownerLineupMap:any = {};
    public ownerLineupPower:number = 0;
    private _ownerSLineup:SOwnerLineup[] = [];

    public initOwnerLineup(lineups:Array<SOwnerLineup>){
        this._ownerSLineup = lineups;
        this.ownerLineupMap = {};
        this.ownerLineupPower = 0;
        lineups.forEach((lineup:SOwnerLineup)=>{
            if(lineup.uuid!=""){
                var info:LineupInfo = new LineupInfo();
                info.initOwner(lineup);
                this.ownerLineupMap[lineup.pos] = info;
                this.ownerLineupPower += Number(info.power);
            }
        })
    }

    public getServerLineup(){
        return this._ownerSLineup.slice();
    }

    public getOwnerFightInfo():FightInfo{
        var info:FightInfo = new FightInfo();
        info.playerType = FightPlayerType.Mine;
        info.playerUid = "";
        info.lineup = this.ownerLineupMap;
        info.totalPower = this.ownerLineupPower;
        info.playerName = COMMON.userInfo.name;
        info.playerLevel = COMMON.userInfo.level;
        info.playerSex = COMMON.userInfo.gender;
        info.playerIcon  = COMMON.userInfo.icon;

        return info;
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
        var power = this.ownerLineupPower;
        if(uuid==""){
            power -= (this.ownerLineupMap[pos] as LineupInfo).power;
        }else{
            var card:CardInfo = Card.getCardByUUid(uuid);
            power += Number(card.carUpCfg.power);
        }
        NET.send(MsgLineupModify.create(str,power),(msg:MsgLineupModify)=>{
            if(msg && msg.resp){
                Lineup.initOwnerLineup(msg.resp.lineUpOwner);
                EVENT.emit(GameEvent.Lineup_Changed);

                //完成任务 
                Task.finishTask(TaskType.ChangeLineup);
            }
        },this)
    }

    public exchangeLineup(pos1:number,uuid1:string,pos2:number,uuid2:string){
        var str:string = pos1 +";"+uuid1 + "|"+pos2+";"+uuid2;
        NET.send(MsgLineupModify.create(str,this.ownerLineupPower),(msg:MsgLineupModify)=>{
            if(msg && msg.resp){
                Lineup.initOwnerLineup(msg.resp.lineUpOwner);
                EVENT.emit(GameEvent.Lineup_Changed);
                //完成任务 
                Task.finishTask(TaskType.ChangeLineup);
            }
        },this)
    }


}

export var Lineup = LineupAssist.getInstance();