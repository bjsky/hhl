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
    Horizontal=1,
    Vertical
}

@ccclass
export default class DList extends cc.Component {
    //列表项点击
    public static ITEM_CLICK:string = "ITEM_CLICK";
    //列表项目改变
    public static ITEM_SELECT_CHANGE:string = "ITEM_SELECT_CHANGE";

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    itemRender: cc.Prefab = null;

    private _col:number = 1;
    private _row:number = 1;
    private _direction:number = 1;
    public enableDrag:boolean = false;
    public enableDragDirection :number = 0;
    private _selectIndex:number = -1;

    public set direction(val){
        this._direction = val;
    }
    public get direction(){
        return this._direction;
    }
    //允许拖动的方向 
    public setDragEnable(enable,dir){
        this.enableDrag = enable;
        this.enableDragDirection = dir;
    }
    // LIFE-CYCLE CALLBACKS:

    public set selectIndex(index){
        if(this._listData.length == 0)
            return;
        if(index<this._listData.length){
            this._selectIndex = index;
        }else{
            this._selectIndex = this._listData.length-1;
        }

        this._listItemArr.forEach((listItem:DListItem)=>{
            listItem.select = (listItem.index == this._selectIndex);
        })
    }
    public get selectIndex(){
        return this._selectIndex;
    }

    public get selectData():any{
        return this._listData[this._selectIndex];
    }

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
    
    public updateIndex(index:number,data:any){
        var item:DListItem = null;
        if(index<this._listItemArr.length){
            this._listData[index] = data;
            item = this._listItemArr[index];
            item.setData(data);
            item.onUpdate();
        }
    }   

    public removeIndex(index:number){
        var item:DListItem = null;
        if(index<this._listItemArr.length){
            this._listData.splice(index,1);
            var listItem:DListItem = this._listItemArr.splice(index,1)[0];
            for(var i:number = index;i<this._listItemArr.length;i++){
                this._listItemArr[i].index = i;
            }
            listItem.onRemove(()=>{
                this.removeListItem(listItem);
                // this.updateContentSize();
                //之后的重新排列
                this.updateItems(index,false);
            });
        }
    }

    private updateDataSource(){
        this.removeListItems();
        
        for(var i = 0;i<this._listData.length;i++){
            var itemData:any = this._listData[i];
            this.addItem(itemData,i);
        }
        this.updateContentSize(true);
        this.updateItems();
        this.selectIndex = this._selectIndex;
    }

    private removeListItems(){
        while(this._listItemArr.length>0){
            var listItem:DListItem = this._listItemArr.shift();
            this.removeListItem(listItem);
        }
    }

    private removeListItem(listItem:DListItem){
        listItem.list = null;
        listItem.stopEffect();
        this._nodePool.put(listItem.node);
    }

    private addItem(itemData:any,index:number){
        var itemNode:cc.Node = this._nodePool.get();
        if(!itemNode){
            itemNode = cc.instantiate(this.itemRender);
        }
        var listItem:DListItem = itemNode.getComponent(DListItem);
        if(listItem){
            listItem.list = this;
            listItem.setData(itemData);
            listItem.index = index;
            listItem.node.parent = this.scrollView.content;
            this._listItemArr.push(listItem);
        }else{
            itemNode.destroy();
        }
    }

    private updateContentSize(resetPostion:boolean = false){
        var viewWidth = this.scrollView.node.width;
        var viewHeight = this.scrollView.node.height;
        var listWidth = viewWidth;
        var listHeight = viewHeight;
        var itemWidth:number = this.itemRender.data.width;
        var itemHeight:number = this.itemRender.data.height;

        if(this._direction == DListDirection.Horizontal){ //水平排列
            this._col = Math.floor( viewWidth / itemWidth);
            this._row= Math.ceil( this._listData.length / this._col);
            listHeight = this._row * this.itemRender.data.height;
            if (listHeight <= viewHeight) {
                listHeight = viewHeight;
            }
        }else if(this._direction == DListDirection.Vertical){  //垂直排列
            this._row = Math.floor( viewHeight / itemHeight);
            this._col = Math.ceil( this._listData.length / this._row);
            listWidth = this._col *  this.itemRender.data.width;
            if (listWidth <= viewWidth) {
                listWidth = viewWidth;
            }
        }

        this.scrollView.vertical = (this._direction == DListDirection.Horizontal);
        this.scrollView.horizontal = (this._direction != DListDirection.Horizontal);
        this.scrollView.content.setContentSize(listWidth, listHeight);
        if(resetPostion){
            this.scrollView.setContentPosition(cc.v2(0, 0));
        }
    }


    private updateItems(fromIndex:number = 0,reset:boolean = true){

        for(var i:number = 0;i<this._listItemArr.length;i++){
            var lsitItem:DListItem = this._listItemArr[i];
            if(lsitItem.index<fromIndex){
                continue;
            }
            var toPos:cc.Vec2 = new cc.Vec2();
            var item:cc.Node = lsitItem.node;
            if(this._direction == DListDirection.Horizontal){ //水平排列
                let row = Math.floor(lsitItem.index / this._col);
                let col = lsitItem.index % this._col;
                toPos.x = col * item.width + item.width * item.anchorX;
                toPos.y = -row * item.height - item.height * (1 - item.anchorY);
            }else if(this._direction == DListDirection.Vertical){  //垂直排列
                let col = Math.floor(lsitItem.index / this._row);
                let row = lsitItem.index % this._row;
                toPos.x = col * item.width + item.width * item.anchorX;
                toPos.y = -row * item.height - item.height * (1 - item.anchorY); 
            } 
            // lsitItem.node.opacity = 0;
            // if(this._listData.length>10){
            //     this.scheduleOnce(()=>{
            //         lsitItem.showEffect();
            //     },0.15)
            // }else{
            //     lsitItem.showEffect();
            // }
            if(reset){
                item.setPosition(cc.v2(toPos.x+50,toPos.y));
                lsitItem.node.opacity = 0;
            }
            lsitItem.showEffect(toPos,reset);
        }
    }
    start () {

    }

    update (dt) {
        if(this._dataSourceChanged){
            this._dataSourceChanged = false;
            
        }

    }

}
