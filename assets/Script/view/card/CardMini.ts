import UIBase from "../../component/UIBase";
import LoadSprite from "../../component/LoadSprite";
import DListItem from "../../component/DListItem";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import PathUtil from "../../utils/PathUtil";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum CardMiniType{
    Owner = 1,
    Lineup,
}
@ccclass
export default class CardMini extends DListItem{
    @property(cc.Label)
    lblPower: cc.Label = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(cc.Node)
    cardSelect: cc.Node = null;
    @property(cc.Node)
    sprCanCompose: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:


    private _showType:number = 0;
    private _cardUUid:string;
    private _cardId:number;
    private _cardInfo:CardInfo;
    public setData(data){
        super.setData(data)
        this._showType = data.type;
        if(this._showType == CardMiniType.Owner){
            this._cardUUid = data.uuid;
            this._cardId = data.cardId;
            this._cardInfo = Card.getCardByUUid(this._cardUUid);
            
        }else if(this._showType == CardMiniType.Lineup){
            this._cardUUid = data.uuid;
            this._cardInfo = Card.getCardByUUid(this._cardUUid);
        }
    }
    
    onEnable(){
        super.onEnable();
        if(this._showType == CardMiniType.Owner ){
            this.setOwnerView(true);
        }else if(this._showType == CardMiniType.Lineup){
            this.setLineupView();
        }
    }
    onUpdate(){
        if(this._showType == CardMiniType.Owner){
            this._cardInfo = Card.getCardByUUid(this._cardUUid);
            this.setOwnerView();
        }
    }

    onRemove(cb?:Function){
        var act= cc.sequence(
            cc.spawn(
                cc.fadeOut(0.15),
                cc.scaleTo(0.15,0.4,0.4)
            ),
            cc.callFunc(()=>{
                cb && cb();
            })
        );
        this.node.runAction(act);
    }

    onDisable(){
        super.onDisable();
        this.node.scale = 1;
    }

    // onLoad () {}
    private setOwnerView(isInit:boolean = false){

        if(isInit){
            this.cardSrc.load(PathUtil.getCardHeadUrl(this._cardInfo.cardInfoCfg.head));
        }
        this.lblPower.string = this._cardInfo.carUpCfg.power.toString();
        this.cardStar.load(PathUtil.getCardHeadGradeImgPath(this._cardInfo.grade));
        // this.cardLevel.string = "Lv."+this._cardInfo.level;
        this.sprCanCompose.active = Card.getCardCanCompose(this._cardId);
    }

    private setLineupView(){
        this.lblPower.string = this._cardInfo.carUpCfg.power.toString();
        this.cardSrc.load(PathUtil.getCardHeadUrl(this._cardInfo.cardInfoCfg.head));
        this.cardStar.load(PathUtil.getCardHeadGradeImgPath(this._cardInfo.grade));
        this.sprCanCompose.active = false;
        
    }
    protected setSelect(select:boolean){
        if(this._showType == CardMiniType.Owner){
            this.cardSelect.active = select;
        }else{
            this.cardSelect.active = false;
        }
    }
    start () {

    }

    // update (dt) {}
}
