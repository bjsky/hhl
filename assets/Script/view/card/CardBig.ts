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
import TouchHandler from "../../component/TouchHandler";
import { WeiXin } from "../../wxInterface";
import { Share } from "../../module/share/ShareAssist";
import { SOUND } from "../../manager/SoundManager";
import { GAME } from "../../GameController";

const {ccclass, property} = cc._decorator;

export enum CardBigShowType{
    GetCard = 1,  
    ShowCard,
    DiamondGetCard ,
    RabGetCard
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
    @property(cc.Button)
    shareBtn:cc.Button = null;

    @property(cc.Node)
    heroNode:cc.Node = null;

    @property(cc.Sprite)
    spr_fxdzs:cc.Sprite = null;
    @property(cc.Sprite)
    spr_fxghy:cc.Sprite = null;
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
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
            || this._type == CardBigShowType.RabGetCard){
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
        EVENT.on(GameEvent.ShareGetReward_Complete,this.checkShareLabel,this);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_START,this.onShare,this);

        this.initCardView();
    }


    onDisable(){
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.off(GameEvent.ShareGetReward_Complete,this.checkShareLabel,this);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_START,this.onShare,this);
    }


    private onShare(e:cc.Event){
        e.stopPropagation();
        this.shareBtn.node.active = false;
        Share.shareAppMessage();
        if(Share.shareGetReward){
            this.scheduleOnce(()=>{
                Share.getShareReward();
            },0.1)
        }
    }
    private initCardView(){
        this.shareBtn.node.active = true;
        this.node.opacity = 0;
        if(this._type == CardBigShowType.GetCard
            ||this._type == CardBigShowType.DiamondGetCard
            || this._type == CardBigShowType.RabGetCard){
            this.heroNode.active = true;
            this.cardName.string = this._cardInfo.cardInfoCfg.name;
            this.cardRace.load(PathUtil.getCardRaceImgPath(this._cardInfo.cardInfoCfg.raceId));
            this.cardStar.load(PathUtil.getCardGradeImgPath(this._cardInfo.grade));
            this.cardFront.load(PathUtil.getCardFrontImgPath(this._cardInfo.grade));
            this.cardSrc.load(PathUtil.getCardImgPath(this._cardInfo.cardInfoCfg.imgPath),null,this.loadCardCb.bind(this));
            this.cardLevel.string = "Lv."+this._cardInfo.level;
            this.cardPower.string = this._cardInfo.carUpCfg.power ;
            
            this.shareBtn.node.active = Share.shareEnable;
            this.checkShareLabel(null);

            SOUND.playGetCardSound();
        }else if(this._type == CardBigShowType.ShowCard){
            this.heroNode.active = false;
            var infoCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this._cardId);
            this.cardSrc.load(PathUtil.getCardImgPath(infoCfg.imgPath),null,this.loadCardCb.bind(this));
        }
    }

    private checkShareLabel(e){
        this.spr_fxdzs.node.active = Share.shareGetReward;
        this.spr_fxghy.node.active = !Share.shareGetReward;
    }

    private loadCardCb(){
        this.onShow();
    }
    protected onShowComplete(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onMaskTouch,this);
    }
    

    private onMaskTouch(e){
        this.node.off(cc.Node.EventType.TOUCH_START,this.onMaskTouch,this);
        if(this._type == CardBigShowType.GetCard){
            this.rotationOut();
        }else if(this._type == CardBigShowType.ShowCard
            || this._type == CardBigShowType.DiamondGetCard
            ){
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
        this.shareBtn.node.active = false;
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
        if(name == "popup_cardBig"){
            return this.node;
        }else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "popup_cardBig"){
            this.onMaskTouch(null);
            GUIDE.nextGuide(guideId);
        }

    }
}
