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
import { GUIDE } from "../../manager/GuideManager";
import TouchHandler from "../../component/TouchHandler";
import { COMMON } from "../../CommonData";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import { AlertBtnType } from "../AlertPanel";
import StringUtil from "../../utils/StringUtil";
import CardHead from "../card/CardHead";
import { CardBigShowType } from "../card/CardBig";
import ResPanel, { ResPanelType } from "../ResPanel";
import CardComposeUI, { CardComposeData } from "../card/CardComposeUI";
import { Drag, CDragEvent } from "../../manager/DragManager";

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



    
    // @property(cc.Node)
    // cardNode:cc.Node = null;
    // @property(cc.Node)
    // nameNode:cc.Node = null;
    // @property(cc.Node)
    // propertyNode:cc.Node = null;
    
    // @property(cc.Node)
    // skillNode:cc.Node = null;
    // @property(cc.Node)
    // destroyNode:cc.Node = null;

    
    
    // @property(cc.Label)
    // labelDestoryGet:cc.Label = null;
    
    // @property(cc.Button)
    // btnUpgrade:cc.Button = null;
    // @property(cc.Button)
    // btnSkillUpgrade:cc.Button = null;
    // @property(cc.Button)
    // btnUpStar:cc.Button = null;
    // @property(cc.Button)
    // btnDestroy:cc.Button = null;

    // @property(cc.Label)
    // labelUpstarCost:cc.Label = null;

    // @property(cc.Node)
    // upstarCostNode:cc.Node = null;
    

    
    // @property(cc.Node)
    // cardHeadFromNode:cc.Node = null;
    // @property(cc.Node)
    // cardHeadToNode:cc.Node = null;




    // private _cardListMap:any = {};
    // private _groupListDatas:Array<any> =[];


    // onLoad () {
        
    // }

    // onEnable(){
    //     this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
    //     this.btnUpgrade.node.on(cc.Node.EventType.TOUCH_START,this.upgradeHero,this);
    //     // this.btnSkillUpgrade.node.on(TouchHandler.TOUCH_CLICK,this.upgradeHeroSkill,this);
    //     this.btnDestroy.node.on(TouchHandler.TOUCH_CLICK,this.destroyHero,this);
    //     this.btnUpStar.node.on(TouchHandler.TOUCH_CLICK,this.onCardUpStar,this);
    //     this.cardImg.node.on(cc.Node.EventType.TOUCH_START,this.showCardBig,this);

    //     EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
    //     EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);

    //     this.initView(true);
    // }

    // onDisable(){
    //     this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
    //     this.btnUpgrade.node.off(cc.Node.EventType.TOUCH_START,this.upgradeHero,this);
    //     // this.btnSkillUpgrade.node.off(TouchHandler.TOUCH_CLICK,this.upgradeHeroSkill,this);
    //     this.btnDestroy.node.off(TouchHandler.TOUCH_CLICK,this.destroyHero,this);
    //     this.btnUpStar.node.off(TouchHandler.TOUCH_CLICK,this.onCardUpStar,this);
    //     this.cardImg.node.off(cc.Node.EventType.TOUCH_START,this.showCardBig,this);

    //     EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
    //     EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);

    //     this.cardsList.setListData([]);
    // }
    // private showCardBig(e){
    //     UI.createPopUp(ResConst.cardBig,{type:CardBigShowType.ShowCard, cardId:this._currentCard.cardId})
    // }


    // private groupSelectChange(e){
    //     var idx = e.detail.index;
    //     this.listGroupSelected();
    // }


    // private onBuildUpdate(e){
    //     if(this._currentCard != null){
    //         this.initProperty();
    //     }
    // }

    

    

    



    


    

    // start () {

    // }

    // public upgradeHero(e){
    //     if(!this._nextLvCardCfg)
    //         return;
    //     if(COMMON.resInfo.lifeStone< this._upLvCost){
    //         ResPanel.show(ResPanelType.StoneNotEnough);
    //         return;
    //     }
    //     if(COMMON.userInfo.level< this._upLvNeedLv){
    //         UI.showTip("不能超过角色等级");
    //         return;
    //     }
    //     Card.upCardLv(this._currentCard.uuid,this._upLvCost);
    // }

    

    // public upgradeHeroSkill(e){

    // }

    // public getGuideNode(name:string):cc.Node{
    //     if(name == "buildPanel_upgradeCard"){
    //         return this.btnUpgrade.node;
    //     }else if(name == "buildPanel_upStar"){
    //         return this.btnUpStar.node;
    //     }
    //     else{
    //         return null;
    //     }
    // }

    // private onGuideTouch(e){
    //     var guideId = e.detail.id;
    //     var nodeName = e.detail.name;
    //     if(nodeName == "buildPanel_upgradeCard"){
    //         this.upgradeHero(null);
    //         GUIDE.nextGuide(guideId);
    //     }else if(nodeName == "buildPanel_upStar"){
    //         this.onCardUpStar(null);
    //         GUIDE.nextGuide(guideId);
    //     }

    // }
    // update (dt) {}

    @property(ButtonGroup)
    viewGroup:ButtonGroup = null;
    @property(cc.Node)
    upLvViewNode:cc.Node = null;
    @property(cc.Node)
    composeViewNode:cc.Node = null;

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
    labelPtPowerAdd:cc.RichText = null;
    @property(cc.Label)
    labelUpLvCost:cc.Label = null;

    @property(cc.Label)
    labelSkillName:cc.Label = null;
    @property(cc.RichText)
    labelSkillDesc:cc.RichText = null;
    //升星组件
    @property(cc.Node)
    nodeUpStar:cc.Node = null;
    @property(LoadSprite)
    sprNextCardGrade:LoadSprite = null;
    @property(cc.RichText)
    labelUpstarSkillAdd:cc.RichText = null;
    @property(cc.RichText)
    labelUpstarPowerAdd:cc.RichText = null;

    @property(DList)
    cardsList:DList = null;

    @property([cc.Node])
    composeCards:Array<cc.Node> = [];
    @property([cc.Label])
    destoryGradeLabel:Array<cc.Label> = [];
    @property(cc.Sprite)
    sprDestory:cc.Sprite = null;

    onLoad(){
        this.viewGroup.labelVisible = false;
    }
    onEnable(){
        this.viewGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.viewGroupSelectChange,this)
        this.cardsList.node.on(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Card_Drop_UpStar,this.onCardUpStar,this);

        EVENT.on(GameEvent.Card_update_Complete,this.onCardUpdate,this);
        EVENT.on(GameEvent.Card_Remove,this.onCardRemoved,this);

        Drag.addDragDrop(this.sprDestory.node);
        this.sprDestory.node.on(CDragEvent.DRAG_DROP,this.onDestroyCard,this);
        this.initView(true);
    }

    onDisable(){
        this.viewGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.viewGroupSelectChange,this)
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Card_Drop_UpStar,this.onCardUpStar,this);
        EVENT.off(GameEvent.Card_update_Complete,this.onCardUpdate,this);
        EVENT.off(GameEvent.Card_Remove,this.onCardRemoved,this);

        Drag.removeDragDrop(this.sprDestory.node);
        this.sprDestory.node.off(CDragEvent.DRAG_DROP,this.onDestroyCard,this);

        this.cardsList.setListData([]);
    }

    private onPanelShowComplete(e){
        this.initCardList();
    }

    private _selectViewIndex:HeroViewSelect = 0;
    private viewGroupSelectChange(){
        this._selectViewIndex = this.viewGroup.selectIndex;
        this.upLvViewNode.active =(this._selectViewIndex == HeroViewSelect.Uplevel);
        this.composeViewNode.active =(this._selectViewIndex == HeroViewSelect.Compose);

        if(this._selectViewIndex == HeroViewSelect.Uplevel){
            this.initCard();
        }else if(this._selectViewIndex == HeroViewSelect.Compose){
            this.initCardCompose();
        }
    }


    private onCardClick(e){
        var index = e.detail.index;
        this.cardsList.selectIndex = index;
        this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
        if(this._selectViewIndex == HeroViewSelect.Uplevel){
            this.initCard();
        }else if(this._selectViewIndex == HeroViewSelect.Compose){
            this.initCardCompose();
        }
    }

    private onCardUpdate(e){
        var cardUUid = e.detail.uuid;
        var type = e.detail.type;
        // if(cardUUid != this._currentCard.uuid){
        //     return;
        // }
        // this._currentCard = Card.getCardByUUid(cardUUid);

        var card:CardInfo =  Card.getCardByUUid(cardUUid);
        if(!card){
            return;
        }
        if(type == CardUpType.UpLevel){
            // this.labelPower.string = this._currentCard.carUpCfg.power;
            // this.labelLv.string = "Lv."+this._currentCard.level;
            // this.initProperty();
            // if(this.cardHeadToNode.childrenCount>0){
            //     var cardHead :CardHead = this.cardHeadToNode.children[0].getComponent(CardHead);
            //     if(cardHead){
            //         var cardUpInfo = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade +1 ,"level",this._currentCard.level)[0];
            //         var nextPower:number = cardUpInfo.power;
            //         cardHead.updatePower(nextPower);
            //     }
            // }
        }else if(type == CardUpType.UpGrade){
            // this.labelPower.string = this._currentCard.carUpCfg.power;
            // this.cardGrade.load(PathUtil.getCardGradeImgPath(this._currentCard.grade));
            // this.cardFront.load(PathUtil.getCardFrontImgPath(this._currentCard.grade));
            // this.initGrade();
            this.updateCardCompose(card,true);
            
            this.updateCardListWithCardId(Number(this._currentCard.cardId));
        }
    }

    private onCardRemoved(e){
        var uuid = e.detail.uuid;
        var type = e.detail.type;
        this.removeCardCompose();
        if(type == CardRemoveType.destroyRemove){  //直接移除
            this.updateCardListWithCardId(Number(this._currentCard.cardId));
        }
        
    }


    private initView(nolist:boolean = false){
        this.viewGroup.selectIndex = HeroViewSelect.Uplevel;
        this.viewGroupSelectChange();
        // this.initListGroup();
        this.listGroupSelected(nolist);
    }


    // private initListGroup(){
    //     this._cardListMap = Card.getOwnerCardListMap();
    //     var labels:string ="";
    //     this._groupListDatas = [];

    //     for(var key in CardRaceType){
    //         if(this._cardListMap[key]!=undefined &&this._cardListMap[key].length>0){
    //             var label:string = CONSTANT.getRaceNameWithId(Number(key));
    //             this._groupListDatas.push({raceId:Number(key)})
    //             labels +=(label)+";";
    //         }
    //     }
    //     labels = labels.substr(0,labels.length-1);
    //     this.btnGroup.labels = labels;
    //     this.btnGroup.selectIndex = 0;
    // }


    private listGroupSelected(nolist:boolean = false){
        // var cardRace = this._groupListDatas[this.btnGroup.selectIndex];
        // var sortList = Card.getOwnerCardList(cardRace.raceId);
        // //排序，按星级倒序，等级倒序，id正序
        // sortList.sort((a:CardInfo,b:CardInfo)=>{
        //     if(a.grade == b.grade){
        //         if(a.level == b.level){
        //             return a.cardId - b.cardId;
        //         }else{
        //             return b.level - a.level;
        //         }
        //     }else{
        //         return  b.grade - a.grade;
        //     }
        // })
        this._currentCardList = Card.getOwnerMaxlvCardList();
        this._currentCard = this._currentCardList.length>0?this._currentCardList[0]:null;

        if(this._selectViewIndex == HeroViewSelect.Uplevel){
            this.initCard();
        }else if(this._selectViewIndex == HeroViewSelect.Compose){
            this.initCardCompose();
        }
        if(!nolist){
            this.initCardList();
        }
    }

    // LIFE-CYCLE CALLBACKS:
    //当前选择卡牌
    private _currentCard:CardInfo = null;

    private _currentCardList:Array<CardInfo> =[];
    private _cardListData:Array<any> = [];
    private initCardList(){
        this._cardListData = [];
        this._currentCardList.forEach((item:CardInfo) =>{
            this._cardListData.push({type:CardSimpleShowType.Owner,uuid:item.uuid,cardId:item.cardId});
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
    private initLevel(){

        this.labelLv.string = this._currentCard.level+"级";
        var cfgs:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade,"level",this._currentCard.level+1);
        if(cfgs.length>0){
            this._nextLvCardCfg = cfgs[0];
            var addPower:number =(this._nextLvCardCfg.power - this._currentCard.carUpCfg.power);
            var addHtml:string = "<color=#D35C21>战力<color=#29b92f>+"+addPower+"</color></c>";
            this.labelPtPowerAdd.string = addHtml;
        }else{
            this._nextLvCardCfg = null;
            this.labelPtPowerAdd.string = "<color=#D35C21>已满级</color>";
        }
        
         if(this._nextLvCardCfg){
            this.upLvNode.active = true;
            this._upLvCost =  Card.getUpLvCostBuffed(this._currentCard.carUpCfg.needStore);
            this._upLvNeedLv = this._currentCard.carUpCfg.playerLevel;
            this.sprNextCardGrade.load(PathUtil.getCardnextGradeCard(this._currentCard.grade+1))
            this.labelUpLvCost.string = StringUtil.formatReadableNumber(this._upLvCost);
        }else{
            this.upLvNode.active = false;
        }
    }

    private initGrade(){
        this.labelSkillName.string = this._currentCard.cardSkillCfg[0].name;
        this.labelSkillDesc.string = Skill.getCardSkillDescHtml(this._currentCard);
        if(this._currentCard.isMaxGrade){
            this.nodeUpStar.active = false;
        }else{
            this.nodeUpStar.active = true;
            var cfgs:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade+1,"level",this._currentCard.level)[0];
            var addPower:number =(cfgs.power - this._currentCard.carUpCfg.power);
            var addHtml:string = "<color=#D35C21>战力<color=#29b92f>+"+addPower+"</color></c>";
            this.labelUpstarSkillAdd.string = Skill.getCardSkillAddDescHtml(this._currentCard);
            this.labelUpstarPowerAdd.string = addHtml;
        }
    }

    /////////////////////////
    //  合成
    ////////////////////////

    private _composeCardInfos:Array<CardInfo> = [];
    private initCardCompose(){
        var cfg:any;
        for(var i:number = 0;i<CardInfo.MaxGrade;i++){
            var cfgs:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",i+1,"level",1)[0];
            this.destoryGradeLabel[i].string = StringUtil.formatReadableNumber(cfgs.destoryGetStore);
        }
        if(this._currentCard){
            this._composeCardInfos = Card.getComposeCardInfos(this._currentCard.cardId);
            this.composeCards.forEach((node:cc.Node) => {
                if(node.childrenCount>0){
                    UI.removeUI(node.children[0]);
                }
            });
            var info:CardInfo;
            for( i = 0;i<this.composeCards.length;i++){
                if(this._composeCardInfos.length>i){
                    info = this._composeCardInfos[i];
                    var data:CardComposeData = new CardComposeData(info,i);
                    UI.loadUI(ResConst.CardComposeUI,data,this.composeCards[i]);
                }
            }
        }
    }

    public updateCardCompose(card:CardInfo,isCompose:boolean){
        var node:cc.Node = this.composeCards[this._composeToIndex];
        var data:CardComposeData = new CardComposeData(card,this._composeToIndex);
        if(node.childrenCount>0){
            node.children[0].getComponent(CardComposeUI).updateView(data,isCompose)
        }else{
            UI.loadUI(ResConst.CardComposeUI,data,this.composeCards[this._composeToIndex]);
        }
        this._composeToIndex = -1;
    }

    public removeCardCompose(){
        var node:cc.Node = this.composeCards[this._composeFromIndex];
        if(node.childrenCount>0){
            UI.removeUI(node.children[0]);
        }
        this._composeFromIndex = -1;
    }


    private _composeFromIndex:number = -1;
    private _composeToIndex:number = -1;
    private onCardUpStar(e){
        var from:CardComposeData = e.detail.from;
        this._composeFromIndex = from.index;
        var to:CardComposeData = e.detail.to;
        this._composeToIndex = to.index;
        if(from.info.isMaxGrade){
            UI.showTip("已经是最高星级");
            return;
        }
        var gold:number = COMMON.resInfo.gold;
        var upStarCost = Number(from.info.carUpCfg.needGold);
        
        if(gold < upStarCost){
            ResPanel.show(ResPanelType.GoldNotEnough);
            return;
        }

        Card.upCardStar(to.info.uuid,from.info.uuid);
    }


    public onDestroyCard(e){
        if(Drag.dragName == CardComposeUI.dragName){
            var data:CardComposeData  = Drag.dragData as CardComposeData;
            this._composeFromIndex = data.index;
            var cardInfo:CardInfo = data.info;
            // if(this._cardListData.length<=1){
            //     UI.showTip("卡牌不能回收");
            //     return;
            // }
            if(cardInfo.grade>=3){
                UI.showAlert("当前为"+this._currentCard.grade+"星卡牌，确定回收？",()=>{
                    Card.destroyCard(cardInfo.uuid);
                },null,AlertBtnType.OKAndCancel);
            }else{
                Card.destroyCard(cardInfo.uuid);
            }
        }
        
    }



    //合成或删除后更新列表信息或选中
    private updateCardListWithCardId(cardId:number):void{
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
            var newData = {type:CardSimpleShowType.Owner,uuid:card.uuid,cardId:card.cardId};
            this._cardListData[index] = newData;
            this.cardsList.updateIndexData(index,newData);
            this._currentCard = card;
        }else{
            this.cardsList.removeIndex(index);
            this.cardsList.selectIndex = index;
            this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
            this.initCardCompose();
        }
    }

}

export enum HeroViewSelect{
    Uplevel = 0,
    Compose,
}