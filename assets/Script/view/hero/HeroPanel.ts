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
import { NET } from "../../net/core/NetController";
import MsgCardUpLv from "../../net/msg/MsgCardUpLv";
import { AlertBtnType } from "../AlertPanel";
import StringUtil from "../../utils/StringUtil";
import CardHead from "../card/CardHead";
import { CardBigShowType } from "../card/CardBig";

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

    @property(ButtonGroup)
    btnGroup:ButtonGroup = null;
    @property(DList)
    cardsList:DList = null;

    @property(cc.Label)
    labelName:cc.Label = null;
    @property(LoadSprite)
    cardImg: LoadSprite = null;
    @property(LoadSprite)
    cardGrade: LoadSprite = null;
    @property(cc.Label)
    labelPower:cc.Label = null;
    @property(cc.Label)
    labelLv:cc.Label = null;
    @property(LoadSprite)
    raceSpr:LoadSprite = null;

    @property(cc.Node)
    cardNode:cc.Node = null;
    @property(cc.Node)
    nameNode:cc.Node = null;
    @property(cc.Node)
    propertyNode:cc.Node = null;
    @property(cc.Node)
    upLvNode:cc.Node = null;
    @property(cc.Node)
    skillNode:cc.Node = null;
    @property(cc.Node)
    destroyNode:cc.Node = null;

    @property(cc.Label)
    labelPtPower:cc.Label = null;
    @property(cc.Label)
    labelPtPowerAdd:cc.Label = null;
    @property(cc.Label)
    labelPtLife:cc.Label = null;
    @property(cc.Label)
    labelPtLifeAdd:cc.Label = null;
    @property(cc.Label)
    labelUpLvCost:cc.Label = null;
    @property(cc.Label)
    labelSkillName:cc.Label = null;
    @property(cc.Label)
    labelSkillLv:cc.Label = null;
    @property(cc.RichText)
    labelSkillDesc:cc.RichText = null;
    @property(cc.RichText)
    labelSkillAdd:cc.RichText = null;
    @property(cc.Label)
    labelDestoryGet:cc.Label = null;
    
    @property(cc.Button)
    btnUpgrade:cc.Button = null;
    @property(cc.Button)
    btnSkillUpgrade:cc.Button = null;
    @property(cc.Button)
    btnUpStar:cc.Button = null;
    @property(cc.Button)
    btnDestroy:cc.Button = null;

    @property(cc.Label)
    labelUpstarCost:cc.Label = null;

    @property(cc.Node)
    upstarCostNode:cc.Node = null;
    
    //升星组件
    @property(cc.Node)
    nodeUpStar:cc.Node = null;
    @property(LoadSprite)
    sprNeedCardGrade:LoadSprite = null;
    @property(cc.Node)
    cardHeadFromNode:cc.Node = null;
    @property(cc.Node)
    cardHeadToNode:cc.Node = null;


    // LIFE-CYCLE CALLBACKS:
    //当前选择卡牌
    private _currentCard:CardInfo = null;

    private _currentCardList:Array<CardInfo> =[];

    private _cardListMap:any = {};
    private _groupListDatas:Array<any> =[];
    private _cardListData:Array<any> = [];

    onLoad () {
        
    }

    private initListGroup(){
        this._cardListMap = Card.getOwnerCardListMap();
        var labels:string ="";
        this._groupListDatas = [];

        for(var key in CardRaceType){
            if(this._cardListMap[key]!=undefined &&this._cardListMap[key].length>0){
                var label:string = CONSTANT.getRaceNameWithId(Number(key));
                this._groupListDatas.push({raceId:Number(key)})
                labels +=(label)+";";
            }
        }
        labels = labels.substr(0,labels.length-1);
        this.btnGroup.labels = labels;
        this.btnGroup.selectIndex = 0;
    }

    onEnable(){
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.on(DList.ITEM_CLICK,this.onCardClick,this);
        this.btnUpgrade.node.on(TouchHandler.TOUCH_CLICK,this.upgradeHero,this);
        // this.btnSkillUpgrade.node.on(TouchHandler.TOUCH_CLICK,this.upgradeHeroSkill,this);
        this.btnDestroy.node.on(TouchHandler.TOUCH_CLICK,this.destroyHero,this);
        this.btnUpStar.node.on(TouchHandler.TOUCH_CLICK,this.onCardUpStar,this);
        this.cardImg.node.on(cc.Node.EventType.TOUCH_START,this.showCardBig,this);

        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.on(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.on(GameEvent.Card_update_Complete,this.onCardUpdate,this);
        EVENT.on(GameEvent.Card_Remove,this.onCardRemoved,this);

        this.initView(true);
    }

    onDisable(){
        this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);
        this.btnUpgrade.node.off(TouchHandler.TOUCH_CLICK,this.upgradeHero,this);
        // this.btnSkillUpgrade.node.off(TouchHandler.TOUCH_CLICK,this.upgradeHeroSkill,this);
        this.btnDestroy.node.off(TouchHandler.TOUCH_CLICK,this.destroyHero,this);
        this.btnUpStar.node.off(TouchHandler.TOUCH_CLICK,this.onCardUpStar,this);
        this.cardImg.node.off(cc.Node.EventType.TOUCH_START,this.showCardBig,this);

        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);
        EVENT.off(GameEvent.Build_Update_Complete,this.onBuildUpdate,this);
        EVENT.off(GameEvent.Card_update_Complete,this.onCardUpdate,this);
        EVENT.off(GameEvent.Card_Remove,this.onCardRemoved,this);

        this.cardsList.setListData([]);
    }
    private showCardBig(e){
        UI.createPopUp(ResConst.cardBig,{type:CardBigShowType.ShowCard, cardId:this._currentCard.cardId})
    }

    private onPanelShowComplete(e){
        this.initCardList();
    }

    private groupSelectChange(e){
        var idx = e.detail.index;
        this.listGroupSelected();
    }

    private onCardClick(e){
        var index = e.detail.index;
        this.cardsList.selectIndex = index;
        this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
        this.initCard();
    }

    private onBuildUpdate(e){
        if(this._currentCard != null){
            this.initProperty();
        }
    }

    private onCardUpdate(e){
        var cardUUid = e.detail.uuid;
        var type = e.detail.type;
        if(cardUUid != this._currentCard.uuid){
            return;
        }
        this._currentCard = Card.getCardByUUid(cardUUid);

        if(type == CardUpType.UpLevel){
            this.labelPower.string = this._currentCard.carUpCfg.power;
            this.labelLv.string = "Lv."+this._currentCard.level;
            this.initProperty();
            if(this.cardHeadToNode.childrenCount>0){
                var cardHead :CardHead = this.cardHeadToNode.children[0].getComponent(CardHead);
                if(cardHead){
                    var cardUpInfo = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade +1 ,"level",this._currentCard.level)[0];
                    var nextPower:number = cardUpInfo.power;
                    cardHead.updatePower(nextPower);
                }
            }
        }else if(type == CardUpType.UpGrade){
            this.labelPower.string = this._currentCard.carUpCfg.power;
            this.labelLv.string = "Lv."+this._currentCard.level;
            this.cardGrade.load(PathUtil.getCardGradeImgPath(this._currentCard.grade));
            this.initProperty();
            this.initSkill();
            this.initUpStar();
        }
        var upIndex = this.getCardIndexWithUUid(cardUUid);
        this.cardsList.updateIndex(upIndex);
    }

    private onCardRemoved(e){
        var uuid = e.detail.uuid;
        var type = e.detail.type;
        // if(type == CardRemoveType.upStarRemove){    //动画后移除

        // }else if(type == CardRemoveType.destroyRemove){  //直接移除
            
        // }
        var rIndex = this.getCardIndexWithUUid(uuid);
        this.cardsList.removeIndex(rIndex);
        if(type == CardRemoveType.destroyRemove){
            //选中下一个
            this.cardsList.selectIndex = rIndex;
            this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
            this.initCard();
        }
    }

    private initView(nolist:boolean = false){
        this.initListGroup();
        this.listGroupSelected(nolist);
        
    }
    private listGroupSelected(nolist:boolean = false){
        var cardRace = this._groupListDatas[this.btnGroup.selectIndex];
        var sortList = Card.getOwnerCardList(cardRace.raceId);
        //排序，按星级倒序，等级倒序，id正序
        sortList.sort((a:CardInfo,b:CardInfo)=>{
            if(a.grade == b.grade){
                if(a.level == b.level){
                    return a.cardId - b.cardId;
                }else{
                    return b.level - a.level;
                }
            }else{
                return  b.grade - a.grade;
            }
        })
        this._currentCardList = sortList;
        this._currentCard = this._currentCardList.length>0?this._currentCardList[0]:null;

        this.initCard();
        if(!nolist){
            this.initCardList();
        }
    }

    private initCard(){

        this.cardNode.active = (this._currentCard != null);
        this.nameNode.active = (this._currentCard != null);
        this.propertyNode.active = (this._currentCard != null);
        this.skillNode.active = (this._currentCard != null);
        this.destroyNode.active = (this._currentCard != null);

        if(this._currentCard != null){
            this.labelLv.string = "Lv."+this._currentCard.level;
            this.labelName.string = this._currentCard.cardInfoCfg.name;
            this.raceSpr.load(PathUtil.getCardRaceImgPath(this._currentCard.cardInfoCfg.raceId));
            this.cardImg.load(PathUtil.getCardImgPath(this._currentCard.cardInfoCfg.imgPath));
            this.cardGrade.load(PathUtil.getCardGradeImgPath(this._currentCard.grade));
            this.labelPower.string = this._currentCard.carUpCfg.power;
            this.initProperty();
            this.initSkill();
            this.initUpStar();
        }
    }

    private _nextLvCardCfg:any = null;
    private _upLvCost:number = 0;
    private _upLvNeedLv:number = 0;
    private _destoryGet:number = 0;
    private _upSkillLvCost:number = 0;
    private initProperty(){
        var cfgs:any = CFG.getCfgByKey(ConfigConst.CardUp,"grade",this._currentCard.grade,"level",this._currentCard.level+1);
        if(cfgs.length>0){
            this._nextLvCardCfg = cfgs[0];
        }else{
            this._nextLvCardCfg = null;
        }
        this.labelPtPower.string = this._currentCard.carUpCfg.power;
        this.labelPtPowerAdd.string = this._nextLvCardCfg?"+" + (this._nextLvCardCfg.power - this._currentCard.carUpCfg.power):"已满级";
        this.labelPtLife.string = this._currentCard.carUpCfg.body;
        this.labelPtLifeAdd.string = this._nextLvCardCfg?"+" + (this._nextLvCardCfg.body - this._currentCard.carUpCfg.body):"已满级";
        if(this._nextLvCardCfg){
            this.upLvNode.active = true;
            this._upLvCost =  Card.getUpLvCostBuffed(this._currentCard.carUpCfg.needStore);
            this._upLvNeedLv = this._currentCard.carUpCfg.playerLevel;
            this.labelUpLvCost.string = StringUtil.formatReadableNumber(this._upLvCost);
        }else{
            this.upLvNode.active = false;
        }
        this._destoryGet =  Number(this._currentCard.carUpCfg.destoryGetStore);
        this.labelDestoryGet.string = StringUtil.formatReadableNumber(this._destoryGet);
    }


    private initSkill(){
        this.labelSkillName.string = this._currentCard.cardSkillCfg[0].name;
        this.labelSkillLv.string =this._currentCard.grade+"星";

        this.labelSkillDesc.string = Skill.getCardSkillDescHtml(this._currentCard);
        this.labelSkillAdd.string = Skill.getCardSkillAddDescHtml(this._currentCard);
    }

    private _upStarCard:CardInfo = null;
    private _upStarCost:number = 0;
    //升星
    private initUpStar(){
        if(this._currentCard.isMaxGrade){
            this.nodeUpStar.active = false;
        }else{
            this.nodeUpStar.active = true;
            this.sprNeedCardGrade.load(PathUtil.getCardUpstarNeedCard(this._currentCard.grade));

            if(this.cardHeadFromNode.childrenCount>0){
                UI.removeUI(this.cardHeadFromNode.children[0]);
            }
            if(this.cardHeadToNode.childrenCount>0){
                UI.removeUI(this.cardHeadToNode.children[0]);
            }

            this._upStarCard = Card.getUpStarCardOne(this._currentCard);
            if(this._upStarCard){
                this.upstarCostNode.active = true;
                this._upStarCost = this._currentCard.carUpCfg.needGold;
                this.labelUpstarCost.string  = StringUtil.formatReadableNumber(this._upStarCost);
                var cardObj ={head:this._upStarCard.cardInfoCfg.head,grade:this._upStarCard.grade,power:this._upStarCard.carUpCfg.power}
                UI.loadUI(ResConst.CardHead,cardObj,this.cardHeadFromNode);
                var upStar = this._upStarCard.grade+1;
                var cardUpInfo = CFG.getCfgByKey(ConfigConst.CardUp,"grade",upStar,"level",this._currentCard.level)[0];
                var upStarObj = {head:this._upStarCard.cardInfoCfg.head,grade:upStar,power:cardUpInfo.power}
                UI.loadUI(ResConst.CardHead,upStarObj,this.cardHeadToNode);
            }else{
                this.upstarCostNode.active = false;
            }
        }
    }

    private initCardList(){
        this._cardListData = [];
        this._currentCardList.forEach((item:CardInfo) =>{
            this._cardListData.push({type:CardSimpleShowType.Owner,uuid:item.uuid});
        })
        this.cardsList.direction = DListDirection.Vertical;
        this.cardsList.row = 1;
        this.cardsList.setListData(this._cardListData);

        for(var i:number = 0;i<this._cardListData.length;i++){
            var data = this._cardListData[i];
            if(data.uuid == this._currentCard.uuid){
                this.cardsList.selectIndex = i;
                break;
            }
        }

    }

    //获取卡牌在list中的索引
    private getCardIndexWithUUid(uuid:string):number{
        for(var i:number = 0;i<this._cardListData.length;i++){
            var data = this._cardListData[i];
            if(data.uuid == uuid){
                return i;
            }
        }
        return -1;
    }

    start () {

    }

    public upgradeHero(e){
        if(!this._nextLvCardCfg)
            return;
        if(COMMON.resInfo.lifeStone< this._upLvCost){
            UI.showTip("灵石不足");
            return;
        }
        if(COMMON.userInfo.level< this._upLvNeedLv){
            UI.showTip("不能超过角色等级");
            return;
        }
        Card.upCardLv(this._currentCard.uuid,this._upLvCost);
    }

    private onCardUpStar(e){
        if(this._currentCard.isMaxGrade){
            UI.showTip("已经是最高星级");
            return;
        }
        if(this._upStarCard== null){
            UI.showTip("没有可合成升星的英雄！");
            return;
        }
        var gold:number = COMMON.resInfo.gold;
        if(gold < this._upStarCost){
            UI.showTip("金币不足");
            return;
        }

        Card.upCardStar(this._currentCard.uuid,this._upStarCard.uuid);
    }

    public upgradeHeroSkill(e){

    }

    public destroyHero(e){
        if(this._cardListData.length<=1){
            UI.showTip("卡牌不能回收");
            return;
        }
        if(this._currentCard.grade>=3){
            UI.showAlert("当前为"+this._currentCard.grade+"星卡牌，确定回收？",this.destoryOK.bind(this),null,AlertBtnType.OKAndCancel);
        }else{
            this.destoryOK();
        }
    }
    private destoryOK(){
        Card.destroyCard(this._currentCard.uuid);
    }

    public getGuideNode(name:string):cc.Node{
        if(name == "buildPanel_upgradeCard"){
            return this.btnUpgrade.node;
        }else{
            return null;
        }
    }

    private onGuideTouch(e){
        var guideId = e.detail.id;
        var nodeName = e.detail.name;
        if(nodeName == "buildPanel_upgradeCard"){
            GUIDE.nextGuide(guideId);
        }

    }
    // update (dt) {}
}
