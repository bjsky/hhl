import LineupInfo from "../../model/LineupInfo";
import { UI } from "../../manager/UIManager";
import { ResConst } from "../../module/loading/steps/LoadingStepRes";
import TouchHandler from "../../component/TouchHandler";
import { Drag, CDragEvent } from "../../manager/DragManager";
import { Lineup } from "../../module/battle/LineupAssist";

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

    public static Drag_Change_Lineup:string ="Drag_Change_Lineup";
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
                node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                node.on(TouchHandler.TOUCH_CLICK,this.onRemoveTouch,this);
                Drag.addDragDrop(node);
                node.on(CDragEvent.DRAG_DROP,this.onDragDrop,this);
            })  
        }
    }
    onDisable(){
        if(this._edit){
            this.nodeHeadArr.forEach((node:cc.Node)=>{
                node.off(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
                node.off(TouchHandler.TOUCH_CLICK,this.onRemoveTouch,this);
                Drag.removeDragDrop(node);
                node.off(CDragEvent.DRAG_DROP,this.onDragDrop,this);
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
                var upStarObj = {lineup:lineup,edit:this._edit}
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

    private onTouchStart(e){
        this.onSelectHeadNode(e);
        this.onDragStart(e);
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
            this.nodeSelect.setPosition(this.nodeHeadArr[this._selectIndex].parent.position);
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

    private onRemoveTouch(e){
        var index = this.nodeHeadArr.indexOf (e.target as cc.Node);
        this.node.emit(LineUpUI.Remove_lineupCard,{pos:index});
    }

    /////////////////
    // Drag
    /////////////////

    private onDragStart(e){
        var node:cc.Node = e.target as cc.Node;
        var index:number = this.nodeHeadArr.indexOf(node);
        if(node.childrenCount>0){
            var headNode:cc.Node = node.children[0];
            var data:LineupInfo = this._lineupMap[index];
            Drag.startDrag(node,data,LineUpUI.Drag_Change_Lineup);
        }
    }

    private onDragDrop(e){
        if(Drag.dragName == LineUpUI.Drag_Change_Lineup){
            var target:cc.Node = e.target as cc.Node;
            var dropIndex = this.nodeHeadArr.indexOf(target);
            var dragData:LineupInfo = Drag.dragData as LineupInfo;
            if(dragData.pos != dropIndex){
                var dropData:LineupInfo = this._lineupMap[dropIndex];
                if(dropData){
                    Lineup.exchangeLineup(dropIndex,dragData.uuid,dragData.pos,dropData.uuid);
                }else{
                    Lineup.exchangeLineup(dropIndex,dragData.uuid,dragData.pos,"");
                }
            }
        }
    }
    // update (dt) {}
}
