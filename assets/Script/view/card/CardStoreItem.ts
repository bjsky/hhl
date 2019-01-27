import LoadSprite from "../../component/LoadSprite";
import DListItem from "../../component/DListItem";
import CardInfo from "../../model/CardInfo";
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
export default class CardStoreItem extends DListItem{
    @property(cc.Node)
    cardSelect: cc.Node = null;
    @property(LoadSprite)
    cardSrc: LoadSprite = null;
    @property(LoadSprite)
    cardStar: LoadSprite = null;
    @property(LoadSprite)
    cardFront: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    
    onLoad () {
        super.onLoad();
        this.cardSelect.active = false;
        this.cardSrc.load("");
    }

    start () {

    }
    private _info:CardInfo;
    public get info():CardInfo{
        return this._info;
    }
    public setData(data:any){
        super.setData(data);
        this._info = data as CardInfo;
    }

    private initView(){
        this.cardSrc.load(PathUtil.getCardImgPath(this._info.cardInfoCfg.simgPath));
        this.cardStar.load(PathUtil.getCardGradeImgPath(this._info.grade));
        this.cardFront.load(PathUtil.getCardFrontImgPath(this._info.grade));
    }
    onEnable(){
        super.onEnable();
        this.initView();
    }

    protected setSelect(select:boolean){
        this.cardSelect.active = select;
    }

    // update (dt) {}
}
