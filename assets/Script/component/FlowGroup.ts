import UIBase from "./UIBase";

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
export enum FlowGroupLayout{
    Center =1,  //居中
    Left,   //左
    LeftTop,    //左上
    Top,    //上
    TopRight,   //右上
    Right,  //右
    BottomRight,    //右下
    Bottom, //下
    BottomLeft, //左下
}

@ccclass
export default class FlowGroup extends cc.Component {

    @property(cc.Prefab)
    itemRender: cc.Prefab = null;

    private _contentNode:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    /** ItemRender内存池 */
    private _nodePool: cc.NodePool = new cc.NodePool();


    private _groupItemArr:Array<UIBase> = [];

    private _groupData:Array<any> = [];

    private _layout:FlowGroupLayout = 1;
    public set layout(val:FlowGroupLayout){
        this._layout = val;
    }
    public get layout():FlowGroupLayout{
        return this._layout;
    }

    private _contentWidth:number = 0;
    private _contentHeight:number = 0;
    private _col:number = 0;
    private _row:number = 0;

    start () {

    }

    public setGroupData(arr:Array<any>){
        this._groupData = arr;
        this.updateDataSource();
    }
    private updateDataSource(){
        this.removeListItems();
        
        for(var i = 0;i<this._groupData.length;i++){
            var itemData:any = this._groupData[i];
            this.addItem(itemData,i);
        }
        this.updateContentSize();
        this.updateItems();
    }

    private removeListItems(){
        while(this._groupItemArr.length>0){
            var listItem:UIBase = this._groupItemArr.shift();
            this.removeListItem(listItem);
        }
    }

    private removeListItem(listItem:UIBase){
        this._nodePool.put(listItem.node);
    }

    private addItem(itemData:any,index:number){
        var itemNode:cc.Node = this._nodePool.get();
        if(!itemNode){
            itemNode = cc.instantiate(this.itemRender);
        }
        var listItem:UIBase = itemNode.getComponent(UIBase);
        if(listItem){
            listItem.setData(itemData);
            this._groupItemArr.push(listItem);
        }else{
            itemNode.destroy();
        }
    }
    private updateContentSize(){
        var colcount = Math.ceil(this.node.width / this.itemRender.data.width);
        if(this._groupData.length<colcount){
            this._col = 1;
            this._row = 1;
        }else{
            this._col = colcount;
            this._row = Math.ceil(this._groupData.length /this._col);
        }
        
        this._contentWidth = this.itemRender.data.width * this._col;
        this._contentHeight = this.itemRender.data.height * this._row;

        if(!this._contentNode){
            this._contentNode = new cc.Node();
            this._contentNode.anchorX = 0;
            this._contentNode.anchorY = 1;
            this._contentNode.parent = this.node;
        }
        var offset:cc.Vec2 = this.getOffsetPos();
        this._contentNode.x = -this.node.width/2 + offset.x;
        this._contentNode.y = this.node.height/2 + offset.y;
    }

    private getOffsetPos():cc.Vec2{
        var offsetX:number = 0;
        switch(this._layout){
            case FlowGroupLayout.Left:
            case FlowGroupLayout.LeftTop:
            case FlowGroupLayout.BottomLeft:
            offsetX = 0;
            break;
            case FlowGroupLayout.Top:
            case FlowGroupLayout.Bottom:
            case FlowGroupLayout.Center:
            offsetX = (this.node.width - this._contentWidth)/2;
            break;
            case FlowGroupLayout.TopRight:
            case FlowGroupLayout.Right:
            case FlowGroupLayout.BottomRight:
            offsetX = this.node.width - this._contentWidth;
            break;
        }
        var offsetY:number = 0;
        switch(this._layout){
            case FlowGroupLayout.Top:
            case FlowGroupLayout.LeftTop:
            case FlowGroupLayout.TopRight:
            offsetY = 0;
            break;
            case FlowGroupLayout.Left:
            case FlowGroupLayout.Center:
            case FlowGroupLayout.Right:
            offsetY = -(this.node.height - this._contentHeight)/2;
            break;
            case FlowGroupLayout.Bottom:
            case FlowGroupLayout.BottomLeft:
            case FlowGroupLayout.BottomRight:
            offsetY = -(this.node.height - this._contentHeight);
            break;
        }
        return cc.v2(offsetX,offsetY);
    }

    private updateItems(){
        var index =0 ;
        this._groupItemArr.forEach((lsitItem:UIBase)=>{
            var item:cc.Node = lsitItem.node;
            var itemCol = index % this._col;
            let itemRow = Math.floor(index / this._col);
            item.x = itemCol * item.width + item.width * item.anchorX;
            item.y = -itemRow * item.height - item.height * (1 - item.anchorY); 
            item.parent = this._contentNode;
            index++;
        });
    }
    // update (dt) {}
}
