import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import { ResType } from "../../model/ResInfo";
import PathUtil from "../../utils/PathUtil";
import StringUtil from "../../utils/StringUtil";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShareItem extends DListItem{
    @property(cc.Label)
    num: cc.Label = null;
    @property(cc.Label)
    receiveLabel:cc.Label = null;
    @property(cc.Label)
    indexLabel: cc.Label = null;

    @property(LoadSprite)
    awardIcon: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _type:ResType = 0;
    private _num:number = 0;
    private _receive:boolean = false;
    private _index:number = 0;
    public setData(data){
        super.setData(data);
        this._type = data.type;
        this._num = data.num;
        this._receive = data.receive;
        this._index = data.index;
    }

    onEnable(){
        this.initView();
    }

    private initView(){
        this.awardIcon.load(PathUtil.getResMutiIconUrl(this._type));
        this.receiveLabel.node.active =  this._receive;
        this.num.node.active =  !this._receive;
        this.num.string = StringUtil.formatReadableNumber(this._num);
        this.indexLabel.string = "第"+this._index +"位";
    }
}