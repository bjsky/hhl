import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import TouchHandler from "../../component/TouchHandler";
import EnemyInfo from "../../model/EnemyInfo";
import PathUtil from "../../utils/PathUtil";
import { Battle } from "../../module/battle/BattleAssist";

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
    lblScore: cc.Label = null;
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
        UI.createPopUp(ResConst.FighterDetailPanel,{});
    }
    private onAttackTouch(e){

    }
    start () {

    }

    private _fightScoreCfg:any = null;
    private initView(){
        this.lblScore.string = this._enemyInfo.enemyScore.toString();
        this.lblName.string = this._enemyInfo.enemyName;
        this.lblPower.string = this._enemyInfo.enemyTotalPower.toString();
        this.sprSex.load(PathUtil.getSexIconUrl(this._enemyInfo.enemySex));
        if(this._enemyInfo.isAttacked){
            this.btnAttack.node.active = false;
        }else{
            this.btnAttack.node.active = true;
        }
        this._fightScoreCfg= Battle.getFightScoreCfg(this._enemyInfo.enemyScore);
        this.lblRabDesc.string = this._fightScoreCfg.getCardDesc;
    }

    // update (dt) {}
}
