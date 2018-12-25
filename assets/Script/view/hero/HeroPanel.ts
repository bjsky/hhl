import UIBase from "../../component/UIBase";
import ButtonGroup from "../../component/ButtonGroup";
import DList, { DListDirection } from "../../component/DList";
import { CONSTANT } from "../../Constant";
import { CardRaceType, Card } from "../../module/card/CardAssist";
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
    labelSkillCost:cc.Label = null;
    @property(cc.Label)
    labelDestoryGet:cc.Label = null;
    
    @property(cc.Button)
    btnUpgrade:cc.Button = null;
    


    // LIFE-CYCLE CALLBACKS:
    //当前选择卡牌
    private _currentCard:CardInfo = null;

    private _currentCardList:Array<CardInfo> =[];


    onLoad () {

        this.initListGroup();
    }

    private initListGroup(){
        this.btnGroup.labels = "全部;" + CONSTANT.getRaceNameWithId(CardRaceType.WuZu)+";"
        + CONSTANT.getRaceNameWithId(CardRaceType.YaoZu)+";"
        + CONSTANT.getRaceNameWithId(CardRaceType.XianJie)+";"
        + CONSTANT.getRaceNameWithId(CardRaceType.RenJie);
        this.btnGroup.selectIndex = 0;
    }

    onEnable(){
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.on(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.on(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.on(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);

        this.initView(true);
    }

    onDisable(){
        this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);
        EVENT.off(GameEvent.Guide_Touch_Complete,this.onGuideTouch,this);

        this.cardsList.setListData([]);
    }
    private onPanelShowComplete(e){
        this.initCardList();
    }

    private groupSelectChange(e){
        var idx = e.detail.index;
        this.initView();
    }

    private onCardClick(e){
        var index = e.detail.index;
        this.cardsList.selectIndex = index;
        this._currentCard = Card.getCardByUUid(this.cardsList.selectData.uuid);
        this.initCard();
    }

    private initView(nolist:boolean = false){
        var sortList = Card.getOwnerCardList(this.btnGroup.selectIndex);
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
        }
    }

    private _nextLvCardCfg:any = null;
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
        this.labelUpLvCost.string = this._currentCard.carUpCfg.needStore;
        this.labelDestoryGet.string = this._currentCard.carUpCfg.destoryGetStore;
    }


    private initSkill(){
        this.labelSkillName.string = this._currentCard.cardSkillCfg[0].name;
        this.labelSkillLv.string =this._currentCard.skillLevel+"级";
        this.labelSkillCost.string = this._currentCard.skillUpCfg.upNeedStone;

        this.labelSkillDesc.string = Skill.getCardSkillDescHtml(this._currentCard);
        this.labelSkillAdd.string = Skill.getCardSkillAddDescHtml(this._currentCard);
    }

    private initCardList(){
        var listData:Array<any> = [];
        this._currentCardList.forEach((item:CardInfo) =>{
            listData.push({type:CardSimpleShowType.Owner,uuid:item.uuid});
        })
        this.cardsList.direction = DListDirection.Vertical;
        this.cardsList.row = 1;
        this.cardsList.setListData(listData);

        for(var i:number = 0;i<listData.length;i++){
            var data = listData[i];
            if(data.uuid == this._currentCard.uuid){
                this.cardsList.selectIndex = i;
                break;
            }
        }

    }

    start () {

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
