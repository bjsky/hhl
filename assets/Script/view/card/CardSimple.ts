import LoadSprite from "../../component/LoadSprite";
import UIBase from "../../component/UIBase";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { CONSTANT } from "../../Constant";

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

export enum CardSimpleShowType{
    Normal = 0,
    Small
}
@ccclass
export default class CardSimple extends UIBase {


    @property(cc.Node)
    cardNode: cc.Node = null;
    @property(cc.Label)
    cardName: cc.Label = null;
    @property(cc.Label)
    cardRaceName: cc.Label = null;
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;

    @property(cc.Node)
    cardSmallNode: cc.Node = null;
    @property(cc.Label)
    cardSmallName: cc.Label = null;
    @property(cc.Label)
    cardSmallRaceName: cc.Label = null;
    @property(LoadSprite)
    cardSmallSrc: LoadSprite = null;
    @property(LoadSprite)
    cardSmallStar: LoadSprite = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _cardUUid:string;
    private _cardInfo:CardInfo;
    private _showType:number = 0;

    public setData(data){
        this._cardUUid = data.uuid;
        this._cardInfo = Card.getCardByUUid(this._cardUUid);
        this._showType = data.type;
    }

    onEnable(){

        if(this._showType == CardSimpleShowType.Normal ){
            this.cardNode.active = true;
            this.cardSmallNode.active = false;
            this.setView();
        }else if(this._showType == CardSimpleShowType.Small){
            this.cardNode.active = false;
            this.cardSmallNode.active = true;
            this.setSmallView();
        }
        
    }

    private setView(){
        this.cardName.string = this._cardInfo.cardInfoCfg.name;
        this.cardRaceName.string = CONSTANT.getRaceNameWithId(this._cardInfo.cardInfoCfg.raceId);
        this.cardStar.load("ui/Common/star"+this._cardInfo.grade);
        this.cardSrc.load("ui/image/card/"+this._cardInfo.cardInfoCfg.imgPath);
    }

    private setSmallView(){
        this.cardSmallName.string = this._cardInfo.cardInfoCfg.name;
        this.cardSmallRaceName.string = CONSTANT.getRaceNameWithId(this._cardInfo.cardInfoCfg.raceId);
        this.cardSmallStar.load("ui/Common/star"+this._cardInfo.grade);
        this.cardSmallSrc.load("ui/image/card/"+this._cardInfo.cardInfoCfg.imgPath);
    }

    onDisable(){

    }

    start () {

    }

    // update (dt) {}
}
