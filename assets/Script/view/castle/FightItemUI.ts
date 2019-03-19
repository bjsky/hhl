import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import TouchHandler from "../../component/TouchHandler";
import EnemyInfo from "../../model/EnemyInfo";
import PathUtil from "../../utils/PathUtil";
import { Battle } from "../../module/battle/BattleAssist";
import { NET } from "../../net/core/NetController";
import MsgGetFightRecordList from "../../net/msg/MsgGetFightRecordList";
import { FightRecord } from "../../model/BattleInfo";
import { Lineup } from "../../module/battle/LineupAssist";
import FightInfo from "../../model/FightInfo";
import { Fight } from "../../module/fight/FightAssist";
import { WeiXin } from "../../wxInterface";
import { SeeVideoResult } from "../ResPanel";

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
export default class FightItemUI extends DListItem{

    @property(LoadSprite)
    sprHead: LoadSprite = null;

    @property(cc.Label)
    lblName: cc.Label = null;
    @property(cc.Label)
    lblPower: cc.Label = null;
    @property(cc.Label)
    lblRabDesc: cc.Label = null;
    @property(LoadSprite)
    sprSex: LoadSprite = null;

    @property(cc.Button)
    btnAttack: cc.Button = null;
    @property(cc.Sprite)
    sprAttacked: cc.Sprite = null;

    private _enemyInfo:EnemyInfo = null;
    // LIFE-CYCLE CALLBACKS:
    public setData(data:any){
        super.setData(data);
        this._enemyInfo = data as EnemyInfo;
    }

    // onLoad () {}
    onEnable(){
        this.sprHead.node.on(TouchHandler.TOUCH_CLICK,this.onHeadTouch,this);
        this.btnAttack.node.on(TouchHandler.TOUCH_CLICK,this.onAttackTouch,this);
        this.initView();
    }
    onDisable(){
        this.sprHead.node.off(TouchHandler.TOUCH_CLICK,this.onHeadTouch,this);
        this.btnAttack.node.off(TouchHandler.TOUCH_CLICK,this.onAttackTouch,this);
    }

    private onHeadTouch(e){
        NET.send(MsgGetFightRecordList.create(this._enemyInfo.enemyUid),(msg:MsgGetFightRecordList)=>{
            if(msg && msg.resp){
                var records:Array<FightRecord> = Battle.updateFightRecords(this._enemyInfo.enemyUid,msg.resp.records);
                UI.createPopUp(ResConst.FighterDetailPanel,{info:this._enemyInfo,records:records});
            }
        },this)
    }
    private onAttackTouch(e){
        // Battle.testPushRabCard();
        var foMine:FightInfo = Lineup.getOwnerFightInfo();
        if(foMine.totalPower == 0){
            UI.showAlert("请先上阵英雄");
            return;
        }
        var foEnemey:FightInfo = this._enemyInfo.getFightInfo();
        if(Battle.battleInfo.actionPoint<=0){
            this.onHeadTouch(null);
            return;
        }else{
            Fight.showFight(foMine,foEnemey,false,this._enemyInfo);
        }
        
    }

    public onAttackGuide(){
        var foMine:FightInfo = Lineup.getOwnerFightInfo();
        var foEnemey:FightInfo = this._enemyInfo.getFightInfo();
        Fight.showFight(foMine,foEnemey,false,this._enemyInfo);
    }
    public onAttack(){
        this.onAttackTouch(null);
    }
    start () {

    }

    private _fightScoreCfg:any = null;
    private initView(){
        this.lblName.string = this._enemyInfo.enemyName;
        this.lblPower.string = this._enemyInfo.enemyTotalPower.toString();
        this.sprHead.load(this._enemyInfo.enemyIcon);
        this.sprSex.load(PathUtil.getSexIconUrl(this._enemyInfo.enemySex));
        this.btnAttack.node.active = !this._enemyInfo.isAttacked;
        this.sprAttacked.node.active = this._enemyInfo.isAttacked;

        this._fightScoreCfg= Battle.getFightScoreCfg(this._enemyInfo.enemyScore);
        this.lblRabDesc.string = this._fightScoreCfg.getCardDesc;
    }

    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_fightEnemy"){
            return this.btnAttack.node;
        }else{
            return null;
        }
    }
    // update (dt) {}
}
