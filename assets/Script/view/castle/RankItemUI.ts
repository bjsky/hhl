import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";

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
export default class RankItemUI extends DListItem {

    @property(LoadSprite)
    sprRank: LoadSprite = null;
    @property(cc.Label)
    labelRank: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _index:number = 0;
    public setData(data:any){

        super.setData(data);
        this._index = data.index;

    }
    start () {

    }

    onEnable(){
        super.onEnable();
       this.initView();
    }
    onDisable(){
        super.onDisable();
    }

    private initView(){
        if(this._index<=2){
            this.labelRank.node.active = false;
            this.sprRank.node.active = true;
            this.sprRank.load(PathUtil.getRankImgUrl(this._index+1));
        }else{
            this.labelRank.node.active = true;
            this.sprRank.node.active = false;
            this.labelRank.string = String(this._index+1);
        }
    }
    // update (dt) {}
}
