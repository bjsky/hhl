import LoadSprite from "../../component/LoadSprite";
import UIBase from "../../component/UIBase";
import CardInfo from "../../model/CardInfo";
import { Card } from "../../module/card/CardAssist";
import { CONSTANT } from "../../Constant";
import StringUtil from "../../utils/StringUtil";
import { COMMON } from "../../CommonData";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { UI } from "../../manager/UIManager";
import PathUtil from "../../utils/PathUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardBig extends UIBase{

    
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
    @property(cc.Label)
    cardLevel: cc.Label = null;
    @property(cc.Label)
    cardPower: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
        this.node.position = cc.v2(0,0)//cc.v2(cc.winSize.width/2,cc.winSize.height/2);
    }
    private _cardUUid:string;
    private _cardInfo:CardInfo;
    private _cardWorldPos:cc.Vec2 = null;
    private _cardToPos:cc.Vec2 = null;

    public setData(data){
        this._cardUUid = data.cardUUid;
        this._cardInfo = Card.getCardByUUid(this._cardUUid);

        this._cardWorldPos = data.fPos;
        this._cardToPos = data.tPos;
    }

    start () {

    }

    onEnable(){
        // this.scheduleOnce(()=>{
            
        //     this.showEffect();
        // },0.05)


        this.initCardView();
        this.showEffect();
        // this._showEffect = true;
    }

    private initEffect(){
        this.node.position = this.node.parent.convertToNodeSpaceAR(this._cardWorldPos);
        console.log(this.node.position.x,this.node.position.y)
        this.node.scaleX = 0.4;
        this.node.scaleY = 0.4;
        this.node.rotation = 0;
    }

    onDisable(){

    }

    private initCardView(){
        this.cardName.string = this._cardInfo.cardInfoCfg.name;
        this.cardRaceName.string = CONSTANT.getRaceNameWithId(this._cardInfo.cardInfoCfg.raceId);
        this.cardStar.load(PathUtil.getCardGradeImgPath(this._cardInfo.grade));
        this.cardSrc.load(PathUtil.getCardImgPath(this._cardInfo.cardInfoCfg.imgPath));
        this.cardLevel.string = "Lv."+this._cardInfo.level;
        this.cardPower.string = "战力：" + StringUtil.formatReadableNumber(this._cardInfo.carUpCfg.power) ;
    }
    
    private _showEffect:boolean =false;
    private _showEffectNextFrame:boolean = false;
    private showEffect(){
        this.initEffect();
        var scaleAct = cc.sequence(cc.spawn(
            cc.moveTo(0.3,cc.v2(0,0)),cc.scaleTo(0.3,1)
        ),cc.callFunc(()=>{
            this.node.on(cc.Node.EventType.TOUCH_START,this.onMaskTouch,this);
        }))
        this.node.runAction(scaleAct)
    }

    private onMaskTouch(e){
        this.node.off(cc.Node.EventType.TOUCH_START,this.onMaskTouch,this);
        var toPos = this.node.convertToNodeSpaceAR(this._cardToPos);
        var fPos = this.node.position;
        var centerPos = cc.v2(fPos.x + (toPos.x - fPos.x) * 0.1, fPos.y - (toPos.y - fPos.y) * 0.7);
        
        var getAct = cc.sequence(
            cc.spawn(
                cc.bezierTo(0.4,[fPos,centerPos,toPos]),
                cc.scaleTo(0.4,0.2),
                cc.rotateBy(0.4,360)
            ),cc.callFunc(()=>{
                UI.closePopUp(this.node);
            })
        )
        this.node.runAction(getAct);
    }
    update (dt) {
        if(this._showEffect){
            this._showEffect = false;
            this._showEffectNextFrame = true;
            return;
        }
        if(this._showEffectNextFrame){
            this._showEffectNextFrame = false;
            this.showEffect();
        }
    }
}
