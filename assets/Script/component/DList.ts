import DListItem from "./DListItem";

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
export enum DListDirection{
    Horizontal=0,
    Vertical
}

@ccclass
export default class DList extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    itemRender: cc.Prefab = null;

    private _col:number = 1;
    private _row:number = 1;
    private _direction:number = 0;
    public set col(val){
        this._col = val;
    }
    public get col(){
        return this._col;
    }

    public set row(val){
        this._row = val;
    }
    public get row(){
        return this._row;
    }

    public set direction(val){
        this._direction = val;
    }
    public get direction(){
        return this._direction;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scrollView.content.anchorX = 0;
        this.scrollView.content.anchorY = 1;
    }
    /** ItemRender内存池 */
    private _nodePool: cc.NodePool = new cc.NodePool();


    private _listItemArr:Array<DListItem> = [];

    private _listData:Array<any> = [];

    private _dataSourceChanged:boolean = false;
    public setListData(listdata:Array<any>){
        this._listData = listdata;
        
        this.updateDataSource();
        this._dataSourceChanged  = true;
    }

    public getItemAt(index):DListItem{
        if(index<this._listItemArr.length){
            return this._listItemArr[index];
        }else{
            return null;
        }
    }

    private updateDataSource(){
        this.removeListItems();
        
        for(var i = 0;i<this._listData.length;i++){
            var itemData:any = this._listData[i];
            this.addItem(itemData,i);
        }
    }

    private removeListItems(){
        while(this._listItemArr.length>0){
            var listItem = this._listItemArr.shift();
            this._nodePool.put(listItem.node);
        }
    }

    private addItem(itemData:any,index:number){
        var itemNode:cc.Node = this._nodePool.get();
        if(!itemNode){
            itemNode = cc.instantiate(this.itemRender);
        }
        var listItem:DListItem = itemNode.getComponent(DListItem);
        if(listItem){
            listItem.setData(itemData);
            listItem.index = index;
            listItem.node.parent = this.scrollView.content;
            this._listItemArr.push(listItem);
        }else{
            itemNode.destroy();
        }
    }

    private updateContentSize(){
        var viewWidth = this.scrollView.node.width;
        var viewHeight = this.scrollView.node.height;
        var listWidth = viewWidth;
        var listHeight = viewHeight;

        if(this._direction == DListDirection.Vertical){  //垂直排列
            var col = Math.ceil( this._listData.length / this._row);
            listWidth = col *  this.itemRender.data.width;
            if (listWidth <= viewWidth) {
                listWidth = viewWidth;
            }
        }else if(this._direction == DListDirection.Horizontal){ //水平排列
            var row = Math.ceil( this._listData.length / this._col);
            listHeight = row * this.itemRender.data.height;
            if (listHeight <= viewHeight) {
                listHeight = viewHeight;
            }
        }
        this.scrollView.content.setContentSize(listWidth, listHeight);
        this.scrollView.setContentPosition(cc.v2(0, 0));
    }


    private updateItems(){
        this._listItemArr.forEach((lsitItem:DListItem)=>{
            var item:cc.Node = lsitItem.node;
            if(this._direction == DListDirection.Vertical){  //垂直排列
                let col = Math.floor(lsitItem.index / this._row);
                let row = lsitItem.index % this._row;
                item.x = col * item.width + item.width * item.anchorX;
                item.y = -row * item.height - item.height * (1 - item.anchorY); 
            }else if(this._direction == DListDirection.Horizontal){ //水平排列
                let row = Math.floor(lsitItem.index / this.col);
                let col = lsitItem.index % this.col;
                item.x = col * item.width + item.width * item.anchorX;
                item.y = -row * item.height - item.height * (1 - item.anchorY);
            }
            lsitItem.showEffect();
        })
    }
    start () {

    }

    update (dt) {
        if(this._dataSourceChanged){
            this._dataSourceChanged = false;
            this.updateContentSize();
            this.updateItems();
        }

    }

}
