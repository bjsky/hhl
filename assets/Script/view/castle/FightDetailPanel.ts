import PopUpBase from "../../component/PopUpBase";
import LoadSprite from "../../component/LoadSprite";
import LineUpUI from "../battle/LineUpUI";
import EnemyInfo from "../../model/EnemyInfo";
import { SFightRecord } from "../../net/msg/MsgLogin";
import { FightRecord } from "../../model/BattleInfo";
import PathUtil from "../../utils/PathUtil";

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
export default class FightDeailPanel extends PopUpBase {
    @property(LineUpUI)
    lineUpMine:LineUpUI = null;
    @property(LoadSprite)
    sprHead: LoadSprite = null;

    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Label)
    lblName: cc.Label = null;
    @property(cc.Label)
    lblLevel: cc.Label = null;
    @property(LoadSprite)
    sprSex: LoadSprite = null;
    @property(cc.Button)
    btnAttack: cc.Button = null;
    @property(cc.Button)
    btnRevenge: cc.Button = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.RichText)
    textRecords: cc.RichText = null;

    // onLoad () {}
    private _enemyInfo:EnemyInfo =  null;
    private _records:Array<FightRecord> = []
    public setData(data:any){
        super.setData(data);    
        this._enemyInfo = data.info;
        this._records = data.records;
    }

    onEnable(){
        super.onEnable();
        this.lineUpMine.initLineup(this._enemyInfo.enemyLineupMap);
        this.initView();
    }

    onDisable(){
        super.onDisable();

    }

    private initView(){
        this.lblScore.string = this._enemyInfo.enemyScore.toString();
        this.lblName.string = this._enemyInfo.enemyName;
        this.lblLevel.string = this._enemyInfo.enemyLevel.toString();
        this.sprSex.load(PathUtil.getSexIconUrl(this._enemyInfo.enemySex));
        this.sprHead.load(this._enemyInfo.enemyIcon);
        this.initRecordStr();
    }

    private initRecordStr(){
        var str:string ="";
        this._records.forEach((record:FightRecord)=>{
            str +=(record.getDescHtml()+"<br />");
        })
        str = "<color=#7D3F3F>"+str+"</color>"
        this.textRecords.string = str;
    }
    start () {

    }

    // update (dt) {}
}
