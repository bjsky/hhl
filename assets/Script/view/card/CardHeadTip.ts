import UIBase from "../../component/UIBase";
import LoadSprite from "../../component/LoadSprite";
import LineupInfo from "../../model/LineupInfo";
import PathUtil from "../../utils/PathUtil";
import { CFG } from "../../manager/ConfigManager";
import { ConfigConst } from "../../module/loading/steps/LoadingStepConfig";
import { Skill } from "../../module/skill/SkillAssist";
import TipBase from "../../component/TipBase";
import { COMMON } from "../../CommonData";

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
export default class CardHeadTip extends UIBase {

    @property(cc.Label)
    power: cc.Label = null;
    @property(cc.Label)
    lblName: cc.Label = null;
    @property(LoadSprite)
    sprRace: LoadSprite = null;

    @property(cc.Label)
    labelSkillName:cc.Label = null;
    @property(cc.RichText)
    labelSkillDesc:cc.RichText = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private _lineup:LineupInfo = null
    private _target:cc.Node = null;

    public setData(data:any){
        super.setData(data);
        this._lineup = data.lineup as LineupInfo;
        this._target = data.target;
    }

    onEnable(){

        this.power.string = this._lineup.power.toString();
        this.lblName.string = this._lineup.cardName;
        this.sprRace.load(PathUtil.getCardRaceImgPath(this._lineup.raceId));

        var skillCfg:any = CFG.getCfgByKey(ConfigConst.CardSkill,"cardId",this._lineup.cardId)[0];
        this.labelSkillName.string = skillCfg.name;
        this.labelSkillDesc.string = Skill.getLineupCardSkillDescHtml(skillCfg,Number(this._lineup.grade));

        this.adjustPosition();
    }
    onDisable(){

        this.power.string ="";
    }

    public adjustPosition(){
        if (this.node != null) {
            if(this._target != null)
            {
                let tpos = this._target.parent.convertToWorldSpaceAR(this._target.position)
                let pos  = tpos.add(cc.v2(0,(this._target.height+this.node.height)>>1));
                pos = this.node.parent.convertToNodeSpaceAR(pos);
                this.node.position = pos;
                let rect = this.node.getBoundingBoxToWorld();
                // if(nodeRect.y + nodeRect.height<=cc.winSize.height)
                // {
                //     if(nodeRect.x <0)
                //     {
                //         this.node.x += -nodeRect.x;
                //     }else if(nodeRect.x + nodeRect.width>cc.winSize.width)
                //     {
                //         this.node.x += -(nodeRect.x + nodeRect.width-cc.winSize.width)
                //     }
                // }else
                // {
                //     let w = (this._target.width+this.node.width)>>1;
                //     if(pos.x<cc.winSize.width*0.5)
                //     {
                //         pos = tpos.add(cc.v2(w,0));
                //     }else
                //     {
                //         pos = tpos.sub(cc.v2(w,0));
                //     }
                //     this.node.position = pos;
                // }

                if(rect.x<0){
                    this.node.x+= -rect.x;
                }else if(rect.x + rect.width>cc.winSize.width){
                    this.node.x += -(rect.x + rect.width-cc.winSize.width);
                }
            }
            
        }
       
    }
    start () {

    }

    // update (dt) {}
}
