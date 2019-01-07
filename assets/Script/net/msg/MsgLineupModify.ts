import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SOwnerLineup } from "./MsgLogin";
import { Lineup } from "../../module/battle/LineupAssist";

/**
 * 更新阵容
 */
export class CSLineupModify{
    //修改阵容参数 位置；uuid｜位置；uuid
    public lineupStr:string ="";  //pos;uuid|pos;uuid
}

export class SCLineupModify{

    //阵容卡牌
    public lineUpOwner:Array<SOwnerLineup> = [];

    public static parse(obj:any):SCLineupModify{
        var data:SCLineupModify = new SCLineupModify();
        if(obj.lineUpOwner){
            obj.lineUpOwner.forEach(lineupObj => {
                data.lineUpOwner.push(SOwnerLineup.parse(lineupObj));
            });
        }
        return data;
    }
}

export default class MsgLineupModify extends MessageBase{
    public param:CSLineupModify;
    public resp:SCLineupModify;

    constructor(){
        super(NetConst.LineupModify);
        this.isLocal = true;
    }

    public static create(str:string){
        var msg = new MsgLineupModify();
        msg.param = new CSLineupModify();
        msg.param.lineupStr = str;
        return msg;
    }

    public respFromLocal(){
        var lineupStr:string = this.param.lineupStr;
        var arrLineup :string [] = lineupStr.split("|");
        var lineups:SOwnerLineup[] = Lineup.getServerLineup();
        arrLineup.forEach((str)=>{
            var arr = str.split(";");
            var lineup = this.getPosLineup(Number(arr[0]),lineups);
            if(lineup!=null){
                lineup.uuid = arr[1];
            }else{
                var newObj:SOwnerLineup = new SOwnerLineup();
                newObj.pos = Number(arr[0]);
                newObj.uuid = arr[1];
                lineups.push(newObj);
            }
        })
        
        var json:any;
        json = {lineUpOwner:lineups
        };
        return this.parse(json);
    }

    private getPosLineup(pos:number,lineups:SOwnerLineup[]){
        var ret:SOwnerLineup = null;
        lineups.forEach((lineup:SOwnerLineup)=>{
            if(lineup.pos == pos){
                ret = lineup;
            }
        });
        return ret;
    }

    private parse(obj:any):MessageBase{
        this.resp = SCLineupModify.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}