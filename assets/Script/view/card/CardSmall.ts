import LoadSprite from "../../component/LoadSprite";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { CONSTANT } from "../../Constant";
import StringUtil from "../../utils/StringUtil";
import DListItem from "../../component/DListItem";

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
    Owner = 0,
    Hero
}
@ccclass
export default class CardSmall extends DListItem {
    @property(cc.Node)
    ownerNode: cc.Node = null;
    @property(cc.Node)
    heorNode: cc.Node = null;

    @property(cc.Label)
    cardName: cc.Label = null;
    @property(cc.Label)
    cardRaceName: cc.Label = null;
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;
    @property(cc.Label)
    cardLevel: cc.Label = null;
    @property(cc.Label)
    cardPower: cc.Label = null;
    @property(cc.Label)
    cardHeroName: cc.Label = null;
    @property(cc.Label)
    cardHeroRaceName: cc.Label = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _cardUUid:string;
    private _cardInfo:CardInfo;
    private _showType:number = 0;
    private _cardCfg:any;

    public setData(data){
        this._showType = data.type;
        if(this._showType == CardSimpleShowType.Owner){
            this._cardUUid = data.uuid;
            this._cardInfo = Card.getCardByUUid(this._cardUUid);
            
        }else if(this._showType == CardSimpleShowType.Hero){
            this._cardCfg = data.cfg;
        }
    }

    onEnable(){
        if(this._showType == CardSimpleShowType.Hero ){
            this.heorNode.active = true;
            this.ownerNode.active = false;
            this.setHeroView();
        }else if(this._showType == CardSimpleShowType.Owner){

            this.heorNode.active = false;
            this.ownerNode.active = true;
            this.setOwnerView();
        }
        
    }

    private setHeroView(){
        this.cardHeroName.string = this._cardCfg.name;
        this.cardHeroRaceName.string = CONSTANT.getRaceNameWithId(this._cardCfg.raceId);
        this.cardSrc.load("ui/image/card/card1");//+this._cardCfg.imgPath);
    }

    private setOwnerView(){
        this.cardName.string = this._cardInfo.cardInfoCfg.name;
        this.cardRaceName.string = CONSTANT.getRaceNameWithId(this._cardInfo.cardInfoCfg.raceId);
        this.cardStar.load("ui/Common/star"+this._cardInfo.grade);
        this.cardSrc.load("ui/image/card/card1")//+this._cardInfo.cardInfoCfg.imgPath);
        this.cardLevel.string = "Lv."+this._cardInfo.level;
        this.cardPower.string = "战力：" + StringUtil.formatReadableNumber(this._cardInfo.carUpCfg.power) ;
    }

    onDisable(){

    }

    start () {

    }

    // update (dt) {}
}
