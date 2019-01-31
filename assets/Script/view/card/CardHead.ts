import UIBase from "../../component/UIBase";
import LoadSprite from "../../component/LoadSprite";
import PathUtil from "../../utils/PathUtil";
import LineupInfo from "../../model/LineupInfo";
import { Lineup } from "../../module/battle/LineupAssist";

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
    @property(cc.Label)
    lblName: cc.Label = null;
    @property(LoadSprite)
    sprRace: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        this.star.load("");
        this.head.load("");
    }

    private _lineup:LineupInfo = null

    public setData(data:any){
        super.setData(data);
        this._lineup = data.lineup as LineupInfo;
    }

    start () {

    }

    onEnable(){
        this.power.string = this._lineup.power.toString();
        this.star.load(PathUtil.getCardHeadGradeImgPath(this._lineup.grade));
        this.head.load(PathUtil.getCardHeadUrl(this._lineup.headUrl));
        this.lblName.string = this._lineup.cardName;
        this.sprRace.load(PathUtil.getCardRaceImgPath(this._lineup.raceId));

    }

    // public updatePower(power){
    //     this._power = power;
    //     this.power.string = this._power.toString();
    // }

    onDisable(){
        this.power.string ="";
        this.star.load("");
        this.head.load("");
    }


    // update (dt) {}
}