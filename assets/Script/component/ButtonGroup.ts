import LoadSprite from "./LoadSprite";

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
export default class ButtonGroup extends cc.Component {

    @property([LoadSprite])
    btnSprites: Array<LoadSprite> = [];
    @property
    labels: string = "";

    @property
    selectIcon: string = 'ui/Common/hPageSelect';
    @property
    unSelectIcon: string = 'ui/Common/hPageUnselect';
    
    private _selectIndex:number = 0;
    public set selectIndex(index:number){
        this._selectIndex = index;
    }
    public get selectIndex(){
        return this._selectIndex;
    }


    //按钮组改变
    public static BUTTONGROUP_SELECT_CHANGE:string = "BUTTONGROUP_SELECT_CHANGE";
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var labelArr:Array<string> = [];
        if(this.labels!=""){
            labelArr= this.labels.split(";");
        }
        for(var i:number = 0;i<this.btnSprites.length;i++){
            var btn:LoadSprite = this.btnSprites[i];
            btn.node.on(cc.Node.EventType.TOUCH_START,this.onBtnTouch,this);
            if(i==this._selectIndex){
                btn.load(this.selectIcon);
            }else{
                btn.load(this.unSelectIcon);
            }

            if(btn.node.childrenCount>0){
                var label:cc.Label = btn.node.children[0].getComponent(cc.Label);
                if(label && i<labelArr.length){
                     label.string = labelArr[i];
                }
            }
        }
    }

    private onBtnTouch(e){
        var target:LoadSprite = (e.currentTarget as cc.Node).getComponent(LoadSprite);
        if(target){
            var btnIndex = this.btnSprites.indexOf(target);
            if(btnIndex>-1 && btnIndex!=this._selectIndex){
                this.selectBtn(btnIndex);
            }
        }
    }


    private selectBtn(index:number){
        this.selectIndex = index;
        for(var i:number = 0;i<this.btnSprites.length;i++){
            var btn:LoadSprite = this.btnSprites[i];
            if(i==this._selectIndex){
                btn.load(this.selectIcon);
            }else{
                btn.load(this.unSelectIcon);
            }
        }
        this.node.emit(ButtonGroup.BUTTONGROUP_SELECT_CHANGE,{index:this._selectIndex});
    }
    start () {

    }

    // update (dt) {}
}
