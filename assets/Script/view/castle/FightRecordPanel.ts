import PopUpBase from "../../component/PopUpBase";
import { FightRecord } from "../../model/BattleInfo";
import { COMMON } from "../../CommonData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightRecordPanel extends PopUpBase {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.RichText)
    textRecords: cc.RichText = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _records:Array<FightRecord> =[];
    setData(data:any){
        super.setData(data);
        this._records = data.records;
    }
    start () {

    }
    onEnable(){
        super.onEnable();
        this.initRecordStr();
    }


    private initRecordStr(){
        var str:string ="";
        this._records.forEach((record:FightRecord)=>{
            var htmlStr = record.getDescHtml(COMMON.accountId);
            if(htmlStr!=""){
                str +=(htmlStr+"<br />");
            }
        })
        // str = "<color=#7D3F3F>"+str+"</color>"
        this.textRecords.string = str;
    }
    // update (dt) {}
}
