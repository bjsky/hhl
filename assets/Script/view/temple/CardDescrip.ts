import UIBase from "../../component/UIBase";
import { UI } from "../../manager/UIManager";
import ButtonEffect from "../../component/ButtonEffect";
import PopUpBase from "../../component/PopUpBase";
import LoadSprite from "../../component/LoadSprite";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import PathUtil from "../../utils/PathUtil";
import { Skill } from "../../module/skill/SkillAssist";

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
export default class CardDescrip extends PopUpBase {

    @property(cc.Label)
    cardName: cc.Label = null;
    @property(LoadSprite)
    cardRace: LoadSprite = null;
    @property(cc.Label)
    cardSkillName: cc.Label = null;
    @property(cc.RichText)
    cardSkillDesc: cc.RichText = null;
    @property(cc.Label)
    cardDesc: cc.Label = null;
    @property(LoadSprite)
    cardImg: LoadSprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _cardId:number ;
    private _cardCfg:any = null;
    private _cardSkillCfg:any = null;
    public setData(data:any){
        this._cardId = data.cardId;
        this._cardCfg = CFG.getCfgDataById(ConfigConst.CardInfo,this._cardId);
        this._cardSkillCfg = CFG.getCfgByKey(ConfigConst.CardSkill,"cardId",this._cardId)[0];
    }

    onEnable(){
        super.onEnable();
        this.cardName.string = this._cardCfg.name;
        this.cardSkillName.string = this._cardSkillCfg.name;
        this.cardDesc.string = String(this._cardCfg.desc).replace("$","\n");
        this.cardImg.load(PathUtil.getCardImgPath(this._cardCfg.imgPath));
        this.cardRace.load(PathUtil.getCardRaceImgPath(this._cardCfg.raceId));
        this.cardSkillDesc.string = Skill.getSkillHelDescHtml(this._cardSkillCfg);
    }
    // update (dt) {}
}