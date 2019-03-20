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
export default class TouchHandler extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public static TOUCH_CLICK:string ="TOUCH_CLICK";

    public static DRAG_START:string ="DRAG_START";
    public static DRAG_MOVE:string ="DRAG_MOVE";
    public static DRAG_END:string ="DRAG_END";

    public static DOUBLE_CLICK:string ="DOUBLE_CLICK";

    start () {

    }
    private _isMove:boolean = false;
    private _isStartDrag:boolean = false;


    //开始位置
    public startLoc:cc.Vec2 = null;
    //当前位置
    public curLoc:cc.Vec2 = null;
    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    /**
     * 触摸到此地图对象时被调用。
     * @param evt 
     */
    protected onTouchStart(evt:cc.Event.EventTouch) {
        this.startLoc = evt.getStartLocation();
        this.curLoc = evt.getLocation();
    }

    /**
     * 在此地图对象上点击时被调用
     * @param evt 
     */
    protected onTouchEnd(evt) {
       this.endTouch();
    }

    protected onTouchCancel(evt){
        this.endTouch();
    }

    private _clickNum:number = 0;
    private endTouch(){
        if(this._isMove){
            this.onDragEnd();
        }else{
            this._clickNum ++;
            this.startDoubleTouchSchedule();
            this.onTouchClick();
        }
        this._isMove= false;
        this._isStartDrag = false;
    }
    private startDoubleTouchSchedule(){
        this.scheduleOnce(()=>{
            this._clickNum = 0;
        },0.6)
    }
    private stopDoubleTouchSchedule(){
        this._clickNum = 0;
        this.unscheduleAllCallbacks();
    }
    /**
     * 在此地图对象上滑动时被调用
     * @param evt 
     */
    protected onTouchMove(evt:cc.Event.EventTouch) {

        this.startLoc = evt.getStartLocation();
        this.curLoc = evt.getLocation();
        var offx = Math.abs(this.curLoc.x - this.startLoc.x);
        var offy = Math.abs(this.curLoc.y - this.startLoc.y);
        var defaultDis = 10;    
        let vip = cc.view.getVisibleSizeInPixel();    
        let targetDpiRatio = vip.width * vip.height/(750*1134);
        defaultDis *= targetDpiRatio
        if(offx>defaultDis ||offy>defaultDis){
            this._isMove= true;
            this.stopDoubleTouchSchedule();
            if(!this._isStartDrag){
                this._isStartDrag = true;
                this.onDragStart(offx,offy);
            }
            this.onDragMove();
        }

    }

    public dragStartAngle:number = 0;
    protected onDragStart(offx,offy){
        this.dragStartAngle = this.getAngle(offx,offy);
        this.node.dispatchEvent(new cc.Event(TouchHandler.DRAG_START,true));
    }

    private getAngle(x, y) {
        var a = Math.atan2(y, x);
        var ret = a * 180 / Math.PI; //弧度转角度，方便调试
        if (ret > 360) {
            ret -= 360;
        }
        if (ret < 0) {
            ret += 360;
        }
        return ret;
    }
    
    protected onDragMove(){
        this.node.dispatchEvent(new cc.Event(TouchHandler.DRAG_MOVE,true));
    }

    protected onDragEnd(){
        this.node.dispatchEvent(new cc.Event(TouchHandler.DRAG_END,true));
    }
    
    /**
     * 
     * @param evt 跟移动互斥的点击
     */
    protected onTouchClick(){
        if(this._clickNum >= 2){
            this.stopDoubleTouchSchedule();
            this.node.dispatchEvent(new cc.Event(TouchHandler.DOUBLE_CLICK,true));
            // console.log("double click___");
        }else{
            this.node.dispatchEvent(new cc.Event(TouchHandler.TOUCH_CLICK,true));
        }
    }

    // update (dt) {}
}
