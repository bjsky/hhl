import PopUpBase from "../../component/PopUpBase";
import LoadSprite from "../../component/LoadSprite";
import LineUpUI from "../battle/LineUpUI";
import EnemyInfo, { EnemyTypeEnum } from "../../model/EnemyInfo";
import { SFightRecord } from "../../net/msg/MsgLogin";
import { FightRecord } from "../../model/BattleInfo";
import PathUtil from "../../utils/PathUtil";
import { Battle } from "../../module/battle/BattleAssist";
import { UI } from "../../manager/UIManager";
import { Lineup } from "../../module/battle/LineupAssist";
import FightInfo from "../../model/FightInfo";
import { Fight } from "../../module/fight/FightAssist";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { GUIDE } from "../../manager/GuideManager";
import { WeiXin, SeeVideoType } from "../../wxInterface";
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
    btnRabAttack: cc.Button = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.RichText)
    textRecords: cc.RichText = null;

    // onLoad () {}
    private _type:EnemyTypeEnum = 0;
    private _enemyInfo:EnemyInfo =  null;
    private _records:Array<FightRecord> = []
    public setData(data:any){
        super.setData(data);    
        this._enemyInfo = data.info;
        this._type = this._enemyInfo.enemyType;
        this._records = data.records;
    }

    onEnable(){
        super.onEnable();
        this.btnAttack.node.on(cc.Node.EventType.TOUCH_START,this.onFightEnemy,this);
        this.btnRabAttack.node.on(cc.Node.EventType.TOUCH_START,this.onFightEnemyIme,this);
        this.lineUpMine.initLineup(this._enemyInfo.enemyLineupMap);

        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnAttack.node.off(cc.Node.EventType.TOUCH_START,this.onFightEnemy,this);
        this.btnRabAttack.node.off(cc.Node.EventType.TOUCH_START,this.onFightEnemyIme,this);


        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onGuideWeakTouch,this);

    }

    private initView(){
        this.lblScore.string = this._enemyInfo.enemyScore.toString();
        this.lblName.string = this._enemyInfo.enemyName;
        this.lblLevel.string = this._enemyInfo.enemyLevel.toString();
        this.sprSex.load(PathUtil.getSexIconUrl(this._enemyInfo.enemySex));
        this.sprHead.load(this._enemyInfo.enemyIcon);
        this.initRecordStr();
        this.btnAttack.node.active = this.btnRabAttack.node.active = true;
        if(this._type == EnemyTypeEnum.Enemy|| this._type == EnemyTypeEnum.Robit){
            if(this._enemyInfo.isAttacked){
                this.btnAttack.node.active = this.btnRabAttack.node.active = false;
            }
        }
    }

    private initRecordStr(){
        var str:string ="";
        var i:number = 0;
        this._records.forEach((record:FightRecord)=>{
            var htmlStr = record.getDescHtml(this._enemyInfo.enemyUid);
            if(htmlStr!="" && i<5){
                str +=(htmlStr+"<br />");
            }
            i++;
        })
        str = "<color=#7D3F3F>"+str+"</color>"
        this.textRecords.string = str;
    }
    start () {

    }

    private onFightEnemy(e){
        if(Battle.battleInfo.actionPoint<=0){
            UI.showTip("行动力力不足，请过会再来");
            return;
        }
        var foMine:FightInfo = Lineup.getOwnerFightInfo();
        if(foMine.totalPower == 0){
            UI.showAlert("请先上阵英雄");
            return;
        }
        var foEnemey:FightInfo = this._enemyInfo.getFightInfo();

        this.onClose(e);
        Fight.showFight(foMine,foEnemey,false,this._enemyInfo);
    }
    // private onRevenge(e){
    //     var foMine:FightInfo = Lineup.getOwnerFightInfo();
    //     if(foMine.totalPower == 0){
    //         UI.showAlert("请先上阵英雄");
    //         return;
    //     }
    //     var foEnemey:FightInfo = this._enemyInfo.getFightInfo();

    //     this.onClose(e);
    //     Fight.showFight(foMine,foEnemey,false,this._enemyInfo);
    // }

    private onFightEnemyIme(e){
        var foMine:FightInfo = Lineup.getOwnerFightInfo();
        if(foMine.totalPower == 0){
            UI.showAlert("请先上阵英雄");
            return;
        }
        this.onClose(e);
        WeiXin.showVideoAd((result:SeeVideoResult)=>{
            if(result == SeeVideoResult.Complete){
                var foEnemey:FightInfo = this._enemyInfo.getFightInfo();
                Fight.showFight(foMine,foEnemey,true,this._enemyInfo);
            }else if(result == SeeVideoResult.LoadError){
                UI.showTip("视频加载失败！请稍候再来");
            }else if(result == SeeVideoResult.NotComplete){
                UI.showTip("视频观看未完成");
            }
        },SeeVideoType.SeeVideoRabAttack)
    }
    // private onRevengeIme(e){
    //     var foMine:FightInfo = Lineup.getOwnerFightInfo();
    //     if(foMine.totalPower == 0){
    //         UI.showAlert("请先上阵英雄");
    //         return;
    //     }
    //     this.onClose(e);
    //     WeiXin.showVideoAd((result:SeeVideoResult)=>{
    //         if(result == SeeVideoResult.Complete){
    //             var foEnemey:FightInfo = this._enemyInfo.getFightInfo();
    //             Fight.showFight(foMine,foEnemey,true,this._enemyInfo);
    //         }else if(result == SeeVideoResult.LoadError){
    //             UI.showTip("视频加载失败！请稍候再来");
    //         }else if(result == SeeVideoResult.NotComplete){
    //             UI.showTip("视频观看未完成");
    //         }
            
    //     },0)
    // }
    ///////////guide//////////////////
    public getGuideNode(name:string):cc.Node{
        if(name == "popup_revenge" && (Battle.battleInfo.revengeTime<=0)){
            return this.btnAttack.node;
        }
        else{
            return null;
        }
    }

    private onGuideWeakTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "popup_revenge"){
            this.onFightEnemy(null);
            GUIDE.nextWeakGuide(guideId);
        }
    }
    // update (dt) {}
}
