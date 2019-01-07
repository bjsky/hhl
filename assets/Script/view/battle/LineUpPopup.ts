import PopUpBase from "../../component/PopUpBase";
import LineUpUI from "./LineUpUI";
import DList, { DListDirection } from "../../component/DList";
import { Card, CardRaceType } from "../../module/card/CardAssist";
import { CONSTANT } from "../../Constant";
import ButtonGroup from "../../component/ButtonGroup";
import CardInfo from "../../model/CardInfo";
import { CardSimpleShowType } from "../card/CardSmall";
import { UI } from "../../manager/UIManager";
import { Lineup } from "../../module/battle/LineupAssist";
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
export default class LineUpPopup extends PopUpBase {

    @property(LineUpUI)
    lineup: LineUpUI = null;

    @property(ButtonGroup)
    btnGroup:ButtonGroup = null;
    @property(DList)
    cardsList:DList = null;


    private _currentCardList:Array<CardInfo> =[];

    private _cardListMap:any = {};
    private _groupListDatas:Array<any> =[];
    private _cardListData:Array<any> = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    onEnable(){
        super.onEnable();
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.on(DList.ITEM_CLICK,this.onCardClick,this);
        this.lineup.node.on(LineUpUI.Remove_lineupCard,this.onRemoveLineupCard,this);

        EVENT.on(GameEvent.Lineup_Changed,this.onLineupChange,this);
        this.initView(true);
    }

    onDisable(){
        super.onDisable();
        this.btnGroup.node.off(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        this.cardsList.node.off(DList.ITEM_CLICK,this.onCardClick,this);
        this.lineup.node.off(LineUpUI.Remove_lineupCard,this.onRemoveLineupCard,this);

        EVENT.off(GameEvent.Lineup_Changed,this.onLineupChange,this);
        
        this.cardsList.setListData([]);
    }


    protected onShowComplete(){
        super.onShowComplete();

        this.initCardList();
    }

    start () {

    }

    private groupSelectChange(e){
        var idx = e.detail.index;
        this.listGroupSelected();
    }

    private onCardClick(e){
        var index = e.detail.index;
        this.cardsList.selectIndex = index;
        var cardUUid = this.cardsList.selectData.uuid;
        var cardInfo = Card.getCardByUUid(cardUUid);
        if(this.lineup.selectIndex>-1){
            if(Lineup.checkOwnerDuplicate(cardInfo.cardId)){
                UI.showAlert("每个卡牌角色只能上阵一个")
            }else{
                Lineup.changeLineUp(this.lineup.selectIndex,cardUUid);
            }
        }else{
            UI.showAlert("请先选择要上阵的位置");
        }
    }

    private onRemoveLineupCard(e){
        var pos:number = e.detail.pos;
        if(Lineup.ownerLineupMap[pos]){
            Lineup.changeLineUp(pos,"");
            console.log("remove card")
        }
    }

    private onLineupChange(){
        this.lineup.initLineup(Lineup.ownerLineupMap);
        this.lineup.selectIndex = this.lineup.getEmptyIndex();
    }

    private initView(nolist:boolean = false){
        this.initListGroup();
        this.listGroupSelected(nolist);
        
        this.lineup.initLineup(Lineup.ownerLineupMap);
        this.lineup.selectIndex = this.lineup.getEmptyIndex();
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

        if(!nolist){
            this.initCardList();
        }
    }
    private initCardList(){
        this._cardListData = [];
        this._currentCardList.forEach((item:CardInfo) =>{
            this._cardListData.push({type:CardSimpleShowType.Owner,uuid:item.uuid});
        })
        this.cardsList.direction = DListDirection.Vertical;
        // this.cardsList.setDragEnable(true,DListDirection.Vertical);
        this.cardsList.row = 1;
        this.cardsList.setListData(this._cardListData);
    }

        
    // update (dt) {}
}
