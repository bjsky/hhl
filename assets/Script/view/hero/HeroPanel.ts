import UIBase from "../../component/UIBase";
import ButtonGroup from "../../component/ButtonGroup";
import DList, { DListDirection } from "../../component/DList";
import { CONSTANT } from "../../Constant";
import { CardRaceType, Card, CardUpType, CardRemoveType } from "../../module/card/CardAssist";
import CardInfo from "../../model/CardInfo";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import { CardSimpleShowType } from "../card/CardSmall";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import { Skill } from "../../module/skill/SkillAssist";
import { GUIDE, GuideTypeEnum } from "../../manager/GuideManager";
import TouchHandler from "../../component/TouchHandler";
import { COMMON } from "../../CommonData";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { AlertBtnType } from "../AlertPanel";
import StringUtil from "../../utils/StringUtil";
import ResPanel, { ResPanelType, SeeVideoResult } from "../ResPanel";
import { Drag, CDragEvent } from "../../manager/DragManager";
import CardComposeUI from "../card/CardComposeUI";
import { WeiXin } from "../../wxInterface";
import { CardMiniType } from "../card/CardMini";

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
export default class HeroPanel extends UIBase {
    
    @property(cc.Label)
    labelName:cc.Label = null;
    @property(LoadSprite)
    cardImg: LoadSprite = null;
    @property(LoadSprite)
    cardGrade: LoadSprite = null;
    @property(LoadSprite)
    cardFront: LoadSprite = null;
    @property(cc.Label)
    labelPower:cc.Label = null;
    @property(LoadSprite)
    raceSpr:LoadSprite = null;

    
    @property(cc.Label)
    labelLv:cc.Label = null;
    @property(cc.Node)
    upLvNode:cc.Node = null;
    // @property(cc.Label)
    // labelPtPower:cc.Label = null;
    @property(cc.RichText)
    labelUpLvPowerAdd:cc.RichText = null;
    @property(cc.Label)
    labelUpLvName:cc.Label = null;
    @property(cc.Label)
    labelUpLvCost:cc.Label = null;
    @property(cc.Label)
    labelTotalPower:cc.Label = null;

    @property(cc.Label)
    labelSkillName:cc.Label = null;
    @property(cc.RichText)
    labelSkillDesc:cc.RichText = null;
    //升星组件
    @property(cc.Node)
    nodeUpStar:cc.Node = null;
    @property(cc.RichText)
    labelUpstarSkillAdd:cc.RichText = null;
    @property(cc.RichText)
    labelUpstarPowerAdd:cc.RichText = null;

    @property(cc.Label)
    labelUpstarNeedLv:cc.Label = null;
    @property(cc.Label)
    labelUpstarName:cc.Label = null;
    @property(DList)
    cardsList:DList = null;

    @property(cc.Node)
    composeGuideNode:cc.Node = null;
    @property([cc.Node])
    composeCards:Array<cc.Node> = [];
    @property(cc.Sprite)
    sprDestory:cc.Sprite = null;
    //升级

    @property(cc.Button)
    btnUpgrade:cc.Button = null;

    onLoad(){
    }
    onEnable(){
        this.cardsList.node.on(DList.ITEM_CLICK,this.onCardClick,this);
        this.btnUpgrade.node.on(cc.Node.EventType.TOUCH_START,this.upgradeHero,this);

        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Card_Drop_UpStar,this.onCardUpStar,this);

        EVENT.on(GameEvent.Card_update_Complete,this.onCardUpdate,this);
        EVENT.on(GameEvent.Card_Remove,this.onCardRemoved,this);

        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.on(GameEvent.Guide_Weak_Touch_Complete,this.onWeakGuideTouch,this);
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);

        Drag.addDragDrop(this.sprDestory.node);
        this.addCardComposeListener();
        this.sprDestory.node.on(CDragEvent.DRAG_DROP,this.onDestroyCard,this);
        this.initView();
    }

    onDisable(){
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);
        this.btnUpgrade.node.off(cc.Node.EventType.TOUCH_START,this.upgradeHero,this);

        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Card_Drop_UpStar,this.onCardUpStar,this);
        EVENT.off(GameEvent.Card_update_Complete,this.onCardUpdate,this);
        EVENT.off(GameEvent.Card_Remove,this.onCardRemoved,this);

        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.off(GameEvent.Guide_Weak_Touch_Complete,this.onWeakGuideTouch,this);
        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);

        Drag.removeDragDrop(this.sprDestory.node);
        this.removeCardComposeListener();
        this.sprDestory.node.off(CDragEvent.DRAG_DROP,this.onDestroyCard,this);

        this.cardsList.setListData([]);
    }

    private onPanelShowComplete(e){
        this.initCardList();
    }

    // private _selectViewIndex:HeroViewSelect = 0;
    // private viewGroupSelectChange(){
    //     if(GUIDE.isInGuide && GUIDE.guideInfo.type == GuideTypeEnum.GuideDrag){
    //         return;
    //     }
    //     this._selectViewIndex = this.viewGroup.selectIndex;
    //     this.upLvViewNode.active =(this._selectViewIndex == HeroViewSelect.Uplevel);
    //     this.composeViewNode.active =(this._selectViewIndex == HeroViewSelect.Compose);

    //     if(this._selectViewIndex == HeroViewSelect.Uplevel){
    //         this.initCard();
    //     }else if(this._selectViewIndex == HeroViewSelect.Compose){
    //         this.initCardCompose();
    //     }
    // }


    private onCardClick(e){
        var index = e.index;
        this.cardsList.selectIndex = index;
        this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
        this.initCard();
        this.initCardCompose();
    }

    public upgradeHero(e){
        if(!this._nextLvCardCfg)
            return;
        if(COMMON.resInfo.lifeStone< this._upLvCost){
            ResPanel.show(ResPanelType.StoneNotEnough);
            return;
        }
        if(COMMON.userInfo.level< this._upLvNeedLv){
            UI.showTip("不能超过角色等级");
            return;
        }
        Card.upCardLv(this._currentCard.uuid,this._upLvCost,false);
    }

    private onCardUpdate(e){
        var uuid = e.uuid;
        var type = e.type;

        if(type == CardUpType.UpLevel){
            this.initCard();
            this.cardsList.updateIndex(this.cardsList.selectIndex,this.cardsList.selectData);
        }else if(type == CardUpType.UpGrade){
            this.updateCardCompose(uuid);
            this.updateCurrentCard(Number(this._currentCard.cardId));
        }
        if(GUIDE.isInGuide && GUIDE.guideInfo.nodeName == "buildPanel_compose"){
            GUIDE.nextGuide(GUIDE.guideInfo.guideId);
        }

    }

    private onCardRemoved(e){
        var uuid = e.uuid;
        var type = e.type;
        
        this.removeCardCompose(uuid);
        if(type == CardRemoveType.destroyRemove){  //回收移除
            this.updateCurrentCard(Number(this._currentCard.cardId));
        }
    }

    private onBuildUpdate(e){
        if(this._currentCard != null){
            this.initCard();
        }
    }


    private initView(){
        this._currentCardList = Card.getOwnerMaxlvCardList();
        this._currentCard = this._currentCardList.length>0?this._currentCardList[0]:null;
        this.initCard();
        this.initCardCompose();
    }

    // LIFE-CYCLE CALLBACKS:
    //当前选择卡牌
    private _currentCard:CardInfo = null;

    private _currentCardList:Array<CardInfo> =[];
    private _cardListData:Array<any> = [];
    private initCardList(){
        this._cardListData = [];
        this._currentCardList.forEach((item:CardInfo) =>{
            this._cardListData.push({type:CardMiniType.Owner,uuid:item.uuid,cardId:item.cardId});
        })
        this.cardsList.direction = DListDirection.Vertical;
        this.cardsList.setListData(this._cardListData);

        for(var i:number = 0;i<this._cardListData.length;i++){
            var data = this._cardListData[i];
            if(data.uuid == this._currentCard.uuid){
                this.cardsList.selectIndex = i;
                break;
            }
        }

    }

    private initCard(){

        if(this._currentCard){
            this.labelName.string = this._currentCard.cardInfoCfg.name;
            this.raceSpr.load(PathUtil.getCardRaceImgPath(this._currentCard.cardInfoCfg.raceId));
            this.cardImg.load(PathUtil.getCardImgPath(this._currentCard.cardInfoCfg.imgPath));
            this.cardGrade.load(PathUtil.getCardGradeImgPath(this._currentCard.grade));
            this.cardFront.load(PathUtil.getCardFrontImgPath(this._currentCard.grade));
            this.labelPower.string = this._currentCard.carUpCfg.power;

            this.initLevel();
            this.initGrade();
        }else{

        }
    }

    private _nextLvCardCfg:any = null;
    private _upLvCost:number = 0;
    private _upLvNeedLv:number = 0;
    private _upstarNeedLv:number = 0;
    private initLevel(){

        this.labelLv.string = this._currentCard.level+"级";
        this.labelTotalPower.string = this._currentCard.carUpCfg.power;
        var cfgs:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade,"level",this._currentCard.level+1);
        if(cfgs.length>0){
            this._nextLvCardCfg = cfgs[0];
            var addPower:number =(this._nextLvCardCfg.power - this._currentCard.carUpCfg.power);
            var addLife:number = (this._nextLvCardCfg.body -this._currentCard.carUpCfg.body);
            this.labelUpLvPowerAdd.node.active = true;
            this.labelUpLvPowerAdd.string = "<color=#D42834>战斗力+"+addPower+"</color>";
            this.labelUpLvName.string = this._nextLvCardCfg.level+"级：";
        }else{
            this._nextLvCardCfg = null;
            this.labelUpLvName.string = "已满级";
            this.labelUpLvPowerAdd.node.active = false;
        }
        
         if(this._nextLvCardCfg){
            this.upLvNode.active = true;
            this._upLvCost =  Card.getUpLvCostBuffed(this._currentCard.carUpCfg.needStore);
            this._upLvNeedLv = this._currentCard.carUpCfg.playerLevel;
            this.labelUpLvCost.string = StringUtil.formatReadableNumber(this._upLvCost);
        }else{
            this.upLvNode.active = false;
        }
    }

    private initGrade(){
        this.labelSkillName.string = this._currentCard.cardSkillCfg[0].name;
        this.labelSkillDesc.string = Skill.getCardSkillDescHtml(this._currentCard,0);
        if(this._currentCard.isMaxGrade){
            this.nodeUpStar.active = false;
        }else{
            this.nodeUpStar.active = true;
            var cfgs:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade+1,"level",this._currentCard.level)[0];
            var addPower:number =(cfgs.power - this._currentCard.carUpCfg.power);
            var addLife:number = (cfgs.body - this._currentCard.carUpCfg.body);
            this.labelUpstarSkillAdd.string = Skill.getCardSkillAddDescHtml(this._currentCard);
            this._upstarNeedLv = Card.getUpstarNeddLv(this._currentCard.grade);
            this.labelUpstarNeedLv.string = "需要卡牌等级"+this._upstarNeedLv;
            if(this._currentCard.level>= this._upstarNeedLv){
                this.labelUpstarNeedLv.node.color = new cc.Color().fromHEX("#29b92f");
            }else{
                this.labelUpstarNeedLv.node.color = new cc.Color().fromHEX("#F10000");
            }
            this.labelUpstarName.string = "合成"+(this._currentCard.grade+1)+"星：";
            this.labelUpstarPowerAdd.string = "<color=#D42834>战斗力+"+addPower+"</color>";
        }
    }

    /////////////////////////
    //  合成
    ////////////////////////
    private addCardComposeListener(){
        this.composeCards.forEach((node:cc.Node) => {
            Drag.addDragDrop(node);
            node.on(CDragEvent.DRAG_DROP,this.onDropNode,this);
        });
    }
    private removeCardComposeListener(){
        this.composeCards.forEach((node:cc.Node) => {
            Drag.addDragDrop(node);
            node.on(CDragEvent.DRAG_DROP,this.onDropNode,this);
        });
    }

    private onDropNode(e){
        var node:cc.Node = e.target as cc.Node;
        if(Drag.dragName== CardComposeUI.Card_Compose_Drag){
            if(node.childrenCount == 0){
                var dropIndex = this.composeCards.indexOf(node);
                if(dropIndex>-1){
                    var info:CardInfo = Drag.dragData as CardInfo;
                    this.removeCardCompose(info.uuid);
                    UI.loadUI(ResConst.CardComposeUI,info,node);
                }
            }
        }
    }

    private _composeCardInfos:Array<CardInfo> = [];
    private initCardCompose(){
        var cfg:any;
        if(this._currentCard){
            this._composeCardInfos = Card.getComposeCardInfos(this._currentCard.cardId);
            this.composeCards.forEach((node:cc.Node) => {
                if(node.childrenCount>0){
                    UI.removeUI(node.children[0]);
                }
            });
            var info:CardInfo;
            for(var i:number = 0;i<this.composeCards.length;i++){
                if(this._composeCardInfos.length>i){
                    info = this._composeCardInfos[i];
                    UI.loadUI(ResConst.CardComposeUI,info,this.composeCards[i]);
                }
            }
        }
    }
    private updateCardCompose(uuid){
        var card:CardInfo = Card.getCardByUUid(uuid);
        var ui:CardComposeUI = this.getCardComposeWithUUid(uuid);
        if(ui){
            ui.updateData(card);
        }
    }

    private removeCardCompose(uuid){
        var ui:CardComposeUI = this.getCardComposeWithUUid(uuid);
        if(ui){
            UI.removeUI(ui.node);
        }
    }

    private getCardComposeWithUUid(uuid:string):CardComposeUI{
        for(var i:number = 0;i<this.composeCards.length;i++){
            if(this.composeCards[i].childrenCount>0){
                var composeCard:CardComposeUI = this.composeCards[i].children[0].getComponent(CardComposeUI);
                if(composeCard.info.uuid == uuid){
                    return composeCard;
                }
            }
        }
    }

    private onCardUpStar(e){
        var from:CardInfo = e.from;
        var to:CardInfo = e.to;
        if(from.isMaxGrade){
            UI.showTip("已经是最高星级");
            return;
        }
        var needLv =Card.getUpstarNeddLv(to.grade);
        if(!GUIDE.isInGuide && this._currentCard.level<needLv){
            UI.showTip("需要卡牌大于"+needLv+"级");
            return;
        }
        var gold:number = COMMON.resInfo.gold;
        var upStarCost = Number(from.carUpCfg.needGold);
        
        if(gold < upStarCost){
            ResPanel.show(ResPanelType.GoldNotEnough);
            return;
        }

        Card.upCardStar(to.uuid,from.uuid);
    }


    public onDestroyCard(e){
        if(Drag.dragName == CardComposeUI.Card_Compose_Drag){
            var cardInfo:CardInfo  = Drag.dragData as CardInfo;
            // if(this._cardListData.length<=1){
            //     UI.showTip("卡牌不能回收");
            //     return;
            // }
            if(cardInfo.grade>=3){
                UI.showAlert("当前为"+cardInfo.grade+"星卡牌，确定回收？",()=>{
                    Card.destroyCard(cardInfo.uuid);
                },null,AlertBtnType.OKAndCancel);
            }else{
                Card.destroyCard(cardInfo.uuid);
            }
        }
        
    }

    //合成或删除后更新当前卡牌
    private updateCurrentCard(cardId:number):void{
        var index:number =-1;
        for(var i:number = 0;i<this._cardListData.length;i++){
            var data = this._cardListData[i];
            if(data.cardId == cardId){
                index = i;
                break;
            }
        }
        var cardArr:Array<CardInfo> = Card.getComposeCardInfos(cardId);
        if(cardArr.length>0){
            var card:CardInfo = cardArr[0];
            var newData = {type:CardMiniType.Owner,uuid:card.uuid,cardId:card.cardId};
            this.cardsList.updateIndex(index,newData);
            this._currentCard = card;
        }else{
            this.cardsList.removeIndex(index);

            if(this._cardListData.length > 0){
                this.cardsList.selectIndex = index;
                this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
            }else{
                this._currentCard = null;
            }
        }
        this.initCard();
        this.initCardCompose();
    }


    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_upgradeCard"){
            return this.btnUpgrade.node;
        }else if(name == "buildPanel_compose"){
            return this.composeGuideNode;
        }
        else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_upgradeCard"){
            this.upgradeHero(null);
            GUIDE.nextGuide(guideId);
        }
    }

    private onWeakGuideTouch(e){
        var guideId = e.id;
        var nodeName = e.name;
        if(nodeName == "buildPanel_upgradeCard"){
            this.upgradeHero(null);
            GUIDE.nextWeakGuide(guideId);
        }
    }
}

export enum HeroViewSelect{
    Uplevel = 0,
    Compose,
}