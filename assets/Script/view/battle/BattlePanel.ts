import UIBase from "../../component/UIBase";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import { COMMON } from "../../CommonData";
import { Passage } from "../../module/battle/PassageAssist";

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
export default class BattlePanel extends UIBase {

    @property(cc.Label)
    lblPassageGold:cc.Label = null;
    @property(cc.Label)
    lblPassageExp:cc.Label = null;
    @property(cc.Label)
    lblPassageStone:cc.Label = null;

    @property(cc.Label)
    lblCurGold:cc.Label = null;
    @property(cc.Label)
    lblCurExp:cc.Label = null;
    @property(cc.Label)
    lblCurStone:cc.Label = null;
    
    @property(cc.Button)
    btnCollect:cc.Button = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onEnable(){
        this.initView();
    }

    onDisable(){

    }

    private _passCfg:any = null;

    private initView(){
        this._passCfg = Passage.passageInfo.passageCfg;

        this.initPassageleftView();
    }


    private _passGoldPM:number = 0;
    private _passExpPM:number = 0;
    private _passStonePM:number = 0;
    private initPassageleftView(){
        if(this._passCfg){
            this._passExpPM = Number(this._passCfg.passageExp);
            this._passGoldPM = Number(this._passCfg.passageGold);
            this._passStonePM = Number(this._passCfg.passageStone);

            this.lblPassageExp.string = this._passExpPM+"/分";
            this.lblPassageGold.string = this._passGoldPM+"/分";
            this.lblPassageStone.string = this._passStonePM+"/分";
        }
    }
    // update (dt) {}
}
