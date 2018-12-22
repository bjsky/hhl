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

        this.initView(true);
    }

    onDisable(){
        this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);

        EVENT.off(GameEvent.Panel_Show_Effect_Complete,this.onPanelShowComplete,this);

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
        //排序，按星级，等级，id
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
        if(this._currentCard == null){
            this.labelName.string = "";
            this.cardImg.load("");
            this.cardGrade.load("");
            
        }else{
            this.labelName.string = this._currentCard.cardInfoCfg.name;
            this.cardImg.load(PathUtil.getCardImgPath(this._currentCard.cardInfoCfg.imgPath));
            this.cardGrade.load(PathUtil.getCardGradeImgPath(this._currentCard.grade));
        }
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

    // update (dt) {}
}
