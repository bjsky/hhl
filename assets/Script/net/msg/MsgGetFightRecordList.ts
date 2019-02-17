import MessageBase from "./MessageBase";
import NetConst from "../NetConst";
import { SFightRecord } from "./MsgLogin";
import DemoFightRecord from "../../utils/DemoFightRecord";

export class CSGetFightRecordList{
    //玩家uid
    public uid:string ="";
    //最多显示个数
    public listMaxCount:number = 5;
}
export class SCGetFightRecordList{
    //攻击纪录列表
    public records:Array<SFightRecord> = null;

    public static parse(obj:any){
        var info:SCGetFightRecordList = new SCGetFightRecordList();
        info.records = [];
        obj.records.forEach((record:any) => {
            var sRecord:SFightRecord = SFightRecord.parse(record);
            info.records.push(sRecord);
        });
        return info;
    }
}
//获取uid的攻击纪录
export default class MsgGetFightRecordList extends MessageBase{
    public param:CSGetFightRecordList;
    public resp:SCGetFightRecordList;

    constructor(){
        super(NetConst.GetFightRecordList);
        // this.isLocal = true;
    }

    public static create(uid:string,count:number =30){
        var msg = new MsgGetFightRecordList();
        msg.param = new CSGetFightRecordList();
        msg.param.uid = uid;
        msg.param.listMaxCount = count;
        return msg;
    }

    public respFromLocal(){
        var json:any ={
            records:DemoFightRecord.demo1
        };
        return this.parse(json);
    }
    private parse(obj:any):MessageBase{
        this.resp = SCGetFightRecordList.parse(obj);
        return this;
    }
    public respFromServer(obj:any):MessageBase{
        return this.parse(obj);
    }
}