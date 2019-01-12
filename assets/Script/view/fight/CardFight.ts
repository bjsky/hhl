import UIBase from "../../component/UIBase";
import LineupInfo from "../../model/LineupInfo";
import LineUpUI from "../battle/LineUpUI";
import LoadSprite from "../../component/LoadSprite";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
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
export default class CardFight extends  UIBase {

    @property(cc.Node)
    cardNode: cc.Node = null;
    @property(cc.Node)
    noCardNode: cc.Node = null;
    @property(cc.Node)
    lifeNode: cc.Node = null;
    @property(cc.Node)
    buffNode: cc.Node = null;
    @property(cc.Node)
    debuffNode: cc.Node = null;

    @property(LoadSprite)
    gradeSpr: LoadSprite = null;
    @property(cc.Label)
    cardName: cc.Label = null;
    @property(cc.Label)
    cardLevel: cc.Label = null;
    @property(cc.Label)
    cardPower: cc.Label = null;
    @property(cc.Label)
    cardLife: cc.Label = null;
    @property(cc.ProgressBar)
    cardLiftProgress:cc.ProgressBar = null;
    @property(LoadSprite)
    cardSpr: LoadSprite = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _lineupData:LineupInfo = null;
    private _cardInfoCfg:any = null;

    private _curPower:number = 0;
    private _curLife:number = 0;
    private _totalLife:number = 0;

    public setData(data:any){
        super.setData(data);
        this._lineupData = data.data as LineupInfo;
        if(this._lineupData){
            this._cardInfoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this._lineupData.cardId);
            this._curPower = this._curLife = this._totalLife = this._lineupData.power;
        }
    }

    start () {

    }

    onEnable(){
        this.initView();
    }
    onDisable(){

    }

    private initView(){
        if(this._cardInfoCfg==null){
            this.noCardNode.active = true;
            this.cardNode.active = this.lifeNode.active = this.buffNode.active = this.debuffNode.active = false;
        }else{
            this.noCardNode.active = false;
            this.cardNode.active = this.lifeNode.active = this.buffNode.active = this.debuffNode.active = true;

            this.cardName.string = this._cardInfoCfg.name;
            this.cardLevel.string = this._lineupData.level.toString();
            this.gradeSpr.load(PathUtil.getCardRaceImgPath(this._lineupData.grade));
            this.cardPower.string = this._curPower.toString();
            this.cardLife.string = this._curLife.toString();
            this.cardLiftProgress.progress = this.getLiftPro();
            var headUrl = this._cardInfoCfg.simgPath;
            this.cardSpr.load(PathUtil.getCardImgPath(headUrl));
        }
    }

    private getLiftPro(){
        var pro = this._curLife/this._totalLife;
        if(pro>1)
            pro = 1;
        if(pro<0)
            pro = 0;
        return pro;
    }

    // update (dt) {}
}
