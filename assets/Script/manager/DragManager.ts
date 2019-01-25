import { UI } from "./UIManager";

export default class DragManager {
    private static _instance: DragManager = null;
    public static getInstance(): DragManager {
        if (DragManager._instance == null) {
            DragManager._instance = new DragManager();
            
        }
        return DragManager._instance;
    }

    public dragNode:cc.Node = null;
    public dragData:any = null;
    public dragEvent:cc.Event.EventTouch = null;
    public dragName:string = "";

    private _startParent:cc.Node = null;
    private _startPos:cc.Vec2 = null;
    private _isDragging:boolean = false;
    public startDrag(node:cc.Node,data:any=null,name:string = "Drag"){
        if(this._isDragging)
            return;
        this.dragNode = node;
        this.dragData = data;
        this.dragName = name;
        this._isDragging = true;
        
        this._startParent = this.dragNode.parent;
        this._startPos = this.dragNode.position;
        this.addDragListener();

    }

    private _dropNodes:Array<cc.Node> = [];
    public addDragDrop(drop:cc.Node){
        if(this._dropNodes.indexOf(drop)<0){
            this._dropNodes.push(drop);
        }
    }
    public removeDragDrop(drop:cc.Node){
        var idx =this._dropNodes.indexOf(drop);
        if(idx>-1){
            this._dropNodes.splice(idx,1);
        }
    }

    private checkDrop(e:cc.Event.EventTouch){
        this._dropNodes.forEach((drop:cc.Node)=>{
            //获取target节点在父容器的包围盒，返回一个矩形对象
            let rect:cc.Rect = drop.getBoundingBox();
            //使用target容器转换触摸坐标
            let location = e.getLocation();
            let point:cc.Vec2 = drop.parent.convertToNodeSpaceAR(location);
            //if (cc.rectContainsPoint(rect, targetPoint)) {
            //Creator2.0使用rect的成员contains方法
            if (rect.contains(point)) {
                drop.emit(CDragEvent.DRAG_DROP);
            }
        })
    }
    // private contains(rect:cc.Rect,p:cc.Vec2):boolean{
    //     if(p.x>rect.x && p.x<rect.x+rect.width
    //         && p.y<rect.y && p.y>rect.y-rect.height){
    //             return true;
    //         }else{
    //             return false;
    //         }
    // }

    private addDragListener(){
        this.dragNode.on(cc.Node.EventType.TOUCH_MOVE,this.onDragMove,this);
        this.dragNode.on(cc.Node.EventType.TOUCH_END,this.onDragEnd,this);
        this.dragNode.on(cc.Node.EventType.TOUCH_CANCEL,this.onDragCancel,this);
    }

    private removeDragListenter(){
        this.dragNode.off(cc.Node.EventType.TOUCH_MOVE,this.onDragMove,this);
        this.dragNode.off(cc.Node.EventType.TOUCH_END,this.onDragEnd,this);
        this.dragNode.off(cc.Node.EventType.TOUCH_CANCEL,this.onDragCancel,this);
    }


    private onDragMove(e:cc.Event.EventTouch){
        let loc = e.getLocation();
        this.dragNode.parent = UI.DragLayer;
        this.dragNode.position = this.dragNode.parent.convertToNodeSpaceAR(loc);
    }
    private onDragEnd(e:cc.Event.EventTouch){
        
        this.dragEnd(e);
    }
    private onDragCancel(e:cc.Event.EventTouch){
        this.dragEnd(e);
    }

    private dragEnd(e:cc.Event.EventTouch){
        this.removeDragListenter();
        this.dragNode.parent = this._startParent;
        this.dragNode.position = this._startPos;

        this.checkDrop(e);
        this.reset();
    }

    
    private reset(){
        this.dragNode = null;
        this.dragData = null;
        this._isDragging = false;
        
        this._startParent = null;
        this._startPos = null;
    }
}

export class CDragEvent{

    public static DRAG_DROP:string ="DRAG_DROP";
}

export var Drag:DragManager = DragManager.getInstance();