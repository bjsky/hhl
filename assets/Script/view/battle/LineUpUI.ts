import LineupInfo from "../../model/LineupInfo";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import TouchHandler from "../../component/TouchHandler";

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
export default class LineUpUI extends cc.Component {

    @property(cc.Label)
    labelPower: cc.Label = null;

    @property([cc.Node])
    nodeHeadArr: Array<cc.Node> = [];
    @property(cc.Node)
    nodeSelect: cc.Node = null;


    public static Remove_lineupCard:string ="Remove_lineupCard";
    // LIFE-CYCLE CALLBACKS:
    private _edit:boolean = false;

    onLoad () {
        if(this.nodeSelect){
            this._edit = true;
            this.nodeSelect.active = false;
            this.nodeHeadArr.forEach((node:cc.Node)=>{
                node.addComponent(TouchHandler);
            });
        }
    }

    start () {

    }
    onEnable(){
        if(this._edit){
            this.nodeHeadArr.forEach((node:cc.Node)=>{
                node.on(cc.Node.EventType.TOUCH_START,this.onSelectHeadNode,this);
                node.on(TouchHandler.TOUCH_CLICK,this.doubleClick,this);
            })  
        }
    }
    onDisable(){
        if(this._edit){
            this.nodeHeadArr.forEach((node:cc.Node)=>{
                node.off(cc.Node.EventType.TOUCH_START,this.onSelectHeadNode,this);
                node.off(TouchHandler.TOUCH_CLICK,this.doubleClick,this);
            })  
        }
    }
    private _lineupMap:any = {};
    private _totalPower:number = 0;
    public get totalPower(){
        return this._totalPower;
    }


    public initLineup(map:any){
        this._lineupMap = map;
        for(var i:number = 0;i<5;i++){
            var node:cc.Node;
            node = this.nodeHeadArr[i];
            if(node.childrenCount>0){
                UI.removeUI(node.children[0]);
            }
            var lineup:LineupInfo = this._lineupMap[i];
            if(lineup!=null){
                var upStarObj = {head:lineup.headUrl,grade:lineup.grade,power:lineup.power}
                UI.loadUI(ResConst.CardHead,upStarObj,node);
            }
        }
        this.updateTotalPower();
    }

    private updateTotalPower(){
        var power = 0;
        var lineup:LineupInfo = null;
        for(var key in this._lineupMap){
            lineup = this._lineupMap[key];
            power += Number(lineup.power);
        }
        this._totalPower = power;
        this.labelPower.string = this._totalPower.toString();
    }


    private onSelectHeadNode(e){
        var index = this.nodeHeadArr.indexOf (e.target as cc.Node);
        this.selectIndex = index;
    }

    private _selectIndex:number = -1;
    public get selectIndex(){
        return this._selectIndex;
    }
    public set selectIndex(index:number){
        this._selectIndex = index;
        if(!this._edit)
            return;
        if(this._selectIndex>-1){
            this.nodeSelect.active = true;
            this.nodeSelect.setPosition(this.nodeHeadArr[this._selectIndex].position);
        }else{
            this.nodeSelect.active = false;
        }
    }
    public getEmptyIndex(){
        for(var i:number = 0;i<5;i++){
            var lineup:LineupInfo = this._lineupMap[i];
            if(lineup == null){
                return i;
            }
        }
        return -1;
    }

    private doubleClick(e){
        var index = this.nodeHeadArr.indexOf (e.target as cc.Node);
        this.node.emit(LineUpUI.Remove_lineupCard,{pos:index});
    }
    // update (dt) {}
}
