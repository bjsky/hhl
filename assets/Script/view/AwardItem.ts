import LoadSprite from "../component/LoadSprite";
import UIBase from "../component/UIBase";
import { ResType } from "../model/ResInfo";
import PathUtil from "../utils/PathUtil";

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
export default class AwardItem extends UIBase{

    @property(cc.Label)
    num: cc.Label = null;

    @property(LoadSprite)
    awardIcon: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _type:ResType = 0;
    private _val:number = 0;
    public setData(data){
        super.setData(data);
        this._type = data.type;
        this._val = data.value;
    }

    onEnable(){
        this.initView();
    }


    private initView(){
        this.num.string = this._val.toString();
        this.awardIcon.load(PathUtil.getResIconUrl(this._type));
    }
    start () {

    }

    // update (dt) {}
}
