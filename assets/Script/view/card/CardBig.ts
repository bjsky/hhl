import LoadSprite from "../../component/LoadSprite";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { COMMON } from "../../CommonData";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { UI } from "../../manager/UIManager";
import PathUtil from "../../utils/PathUtil";
import { GUIDE } from "../../manager/GuideManager";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import PopUpBase from "../../component/PopUpBase";
import { Share } from "../../module/share/ShareAssist";
import { SOUND } from "../../manager/SoundManager";
import { GAME } from "../../GameController";

const {ccclass, property} = cc._decorator;

export enum CardBigShowType{
    GetCard = 1,  
    ShowCard,
    DiamondGetCard ,
    RabGetCard,
    ActivityGetCard,
}

@ccclass
export default class CardBig extends PopUpBase{

    
    @property(cc.Node)
    cardNode: cc.Node = null;
    @property(cc.Label)
    cardName: cc.Label = null;
    @property(LoadSprite)
    cardRace: LoadSprite = null;
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;
    @property(LoadSprite)
    cardFront: LoadSprite = null;
    @property(cc.Label)
    cardLevel: cc.Label = null;
    @property(cc.Label)
    cardPower: cc.Label = null;

    @property(cc.Node)
    heroNode:cc.Node = null;

    @property(cc.Button)
    btnRecevie:cc.Button = null;

    @property(cc.Sprite)
    sprGet:cc.Sprite = null;
    @property(cc.Sprite)
    sprRabby:cc.Sprite = null;

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.position = cc.v2(0,0)//cc.v2(cc.winSize.width/2,cc.winSize.height/2);
        
    }
    private _type:CardBigShowType = 0;
    private _cardUUid:string;
    private _cardInfo:CardInfo;
    private _cardWorldPos:cc.Vec2 = null;
    private _cardToPos:cc.Vec2 = null;

    private _cardId:number = 0;

    public setData(data){
        this._type = data.type;
        if(this._type == CardBigShowType.GetCard
            || this._type == CardBigShowType.DiamondGetCard
            || this._type == CardBigShowType.RabGetCard
            || this._type == CardBigShowType.ActivityGetCard){
            this._cardUUid = data.cardUUid;
            this._cardInfo = Card.getCardByUUid(this._cardUUid);

            this._cardWorldPos = data.fPos;
            this._cardToPos = data.tPos;
        }else if(this._type == CardBigShowType.ShowCard){
            this._cardId = data.cardId;
        }
    }

    start () {

    }

    onEnable(){
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);

        this.initCardView();
    }


    onDisable(){
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        this._enableGetGuideNode = false;
    }


    private initCardView(){
        this.node.opacity = 0;
        this.heroNode.active = false;
        if(this._type == CardBigShowType.GetCard
            ||this._type == CardBigShowType.DiamondGetCard
            || this._type == CardBigShowType.RabGetCard
            ||this._type == CardBigShowType.ActivityGetCard){
            this.cardName.string = this._cardInfo.cardInfoCfg.name;
            this.cardRace.load(PathUtil.getCardRaceImgPath(this._cardInfo.cardInfoCfg.raceId));
            this.cardStar.load(PathUtil.getCardGradeImgPath(this._cardInfo.grade));
            this.cardFront.load(PathUtil.getCardFrontImgPath(this._cardInfo.grade));
            this.cardSrc.load(PathUtil.getCardImgPath(this._cardInfo.cardInfoCfg.imgPath),null,this.loadCardCb.bind(this));
            this.cardLevel.string = "Lv."+this._cardInfo.level;
            this.cardPower.string = this._cardInfo.carUpCfg.power ;

            SOUND.playGetCardSound();
        }else if(this._type == CardBigShowType.ShowCard){
            var infoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this._cardId);
            this.cardSrc.load(PathUtil.getCardImgPath(infoCfg.imgPath),null,this.loadCardCb.bind(this));
        }
        this.sprGet.node.active = this.sprRabby.node.active = false;
        if(this._type == CardBigShowType.RabGetCard){
            this.sprRabby.node.active = true;
        }else{
            this.sprGet.node.active = true;
        }
    }
    private loadCardCb(){
        this.onShow();
    }
    protected onShowComplete(){
        this.btnRecevie.node.on(cc.Node.EventType.TOUCH_START,this.onNodeTouch,this);
        if(this._type != CardBigShowType.ShowCard){
            this.heroNode.active = true;
        }
        
        this._enableGetGuideNode = true;
    }

    private _enableGetGuideNode:boolean =false;

    private onNodeTouch(e){
        this.btnRecevie.node.off(cc.Node.EventType.TOUCH_START,this.onNodeTouch,this);
        this.heroNode.active = false;
        if(this._type == CardBigShowType.GetCard){
            this.rotationOut();
        }else if(this._type == CardBigShowType.ShowCard
            || this._type == CardBigShowType.DiamondGetCard
            || this._type == CardBigShowType.ActivityGetCard){
            this.onClose(e);
        }else if(this._type == CardBigShowType.RabGetCard){
            this.onClose(e);
            EVENT.emit(GameEvent.Card_RabGet_Close);
        }
    }

    private rotationOut(){
        var toPos = this.node.convertToNodeSpaceAR(this._cardToPos);
        var fPos = this.node.position;
        var centerPos = cc.v2(fPos.x + (toPos.x - fPos.x) * 0.1, fPos.y - (toPos.y - fPos.y) * 0.7);
        var getAct = cc.sequence(
            cc.spawn(
                cc.bezierTo(0.4,[fPos,centerPos,toPos]),
                cc.scaleTo(0.4,0.2),
                cc.rotateBy(0.4,360)
            ),cc.callFunc(()=>{
                this.node.scaleX = 1;
                this.node.scaleY = 1;
                this.node.position = COMMON.ZERO;
                this.node.rotation = 0;
                UI.closePopUp(this.node);
                GAME.showLevelUp();
            })
        )
        this.node.runAction(getAct);
    }

    public getGuideNode(name:string):cc.Node{
        if(name == "popup_cardBig" && this._enableGetGuideNode){
            return this.btnRecevie.node;
        }else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "popup_cardBig"){
            this.onNodeTouch(null);
            GUIDE.nextGuide(guideId);
        }

    }
}
