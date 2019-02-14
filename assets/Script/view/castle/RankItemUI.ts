import DListItem from "../../component/DListItem";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import { RankInfo } from "./RankPanel";

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
    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Label)
    lblName: cc.Label = null;
    @property(cc.Label)
    lblPower: cc.Label = null;
    @property(LoadSprite)
    sprSex: LoadSprite = null;
    @property(LoadSprite)
    sprHead: LoadSprite = null;
    @property(cc.Label)
    lblLevel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _info:RankInfo;
    public setData(data:any){
        super.setData(data);
        this._info = data as RankInfo;
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
        if(this.index<=2){
            this.labelRank.node.active = false;
            this.sprRank.node.active = true;
            this.sprRank.load(PathUtil.getRankImgUrl(this.index+1));
        }else{
            this.labelRank.node.active = true;
            this.sprRank.node.active = false;
            this.labelRank.string = String(this.index+1);
        }
        this.lblScore.string = this._info.playerScore.toString();
        this.lblName.string = this._info.playerName;
        this.lblPower.string = this._info.playerPower.toString();
        this.sprHead.load(this._info.playerIcon);
        this.sprSex.load(PathUtil.getSexIconUrl(this._info.playerSex));
        this.lblLevel.string = this._info.playerLevel.toString();
    }
    // update (dt) {}
}
