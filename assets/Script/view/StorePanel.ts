import PopUpBase from "../component/PopUpBase";
import ButtonGroup from "../component/ButtonGroup";
import DList, { DListDirection } from "../component/DList";
import { CFG } from "../manager/ConfigManager";
import { ConfigConst } from "../module/loading/steps/LoadingStepConfig";
import { Card } from "../module/card/CardAssist";

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
export default class StorePanel extends PopUpBase {


    @property(ButtonGroup)
    btnGroup:ButtonGroup = null;
    @property(DList)
    cardsList:DList = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    

    private _currentGrade:number = 0;
    private _groupListData:number[] = [];
    private _costMap:any ={};
    onEnable(){
        super.onEnable();
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        
        this.initView();
    }

    onDisable(){
        super.onDisable();
        this.btnGroup.node.on(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,this.groupSelectChange,this);
        
        super.onDisable();
    }
    private groupSelectChange(e){
        this._currentGrade = this._groupListData[this.btnGroup.selectIndex];
        this.initCardList();
    }

    private initView(){

        this.initButtonGroup();
    }
    private initButtonGroup(){
        var labels = "";
        var cfg:any = CFG.getCfgGroup(ConfigConst.Store);
        for(var key in cfg){
            var grade = Number(cfg[key].grade);
            labels+=(grade+"星;");
            this._groupListData.push(grade);
            this._costMap[grade] = Number(cfg[key].priceDiamond);
        }
        labels =labels.substr(0,labels.length-1);
        this.btnGroup.labels = labels;
        this.btnGroup.selectIndex = 0;

        this.groupSelectChange(null);
    }

    private initCardList(){
        var cardsArr = Card.getCardSealCfgList();
        var cardsDataArr = [];
        cardsArr.forEach(item =>{
            cardsDataArr.push({cfg:item,grade:this._currentGrade,cost:this._costMap[this._currentGrade]});
        })
        this.cardsList.direction = DListDirection.Vertical;
        this.cardsList.setListData(cardsDataArr);
    }


    start () {

    }

    // update (dt) {}
}
