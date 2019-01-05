import UIBase from "../../component/UIBase";
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
export default class CardHead extends UIBase {

    @property(cc.Label)
    power: cc.Label = null;
    @property(LoadSprite)
    head: LoadSprite = null;
    @property(LoadSprite)
    star: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.star.load("");
        this.head.load("");
    }

    private _head:string = "";
    private _grade:number = 0;
    private _power:number = 0;
    public setData(data:any){
        super.setData(data);
        this._head = data.head;
        this._grade = data.grade;
        this._power = data.power;
    }

    start () {

    }

    onEnable(){
        this.power.string = this._power.toString();
        this.star.load(PathUtil.getCardHeadGradeImgPath(this._grade));
        this.head.load(PathUtil.getCardHeadUrl(this._head));
    }

    public updatePower(power){
        this._power = power;
        this.power.string = this._power.toString();
    }

    onDisable(){
        this.power.string ="";
        this.star.load("");
        this.head.load("");
    }

    // update (dt) {}
}
