import PopUpBase from "../component/PopUpBase";
import { COMMON } from "../CommonData";
import { CONSTANT } from "../Constant";
import { UI } from "../manager/UIManager";

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
export default class LevelUpPanel extends  PopUpBase {

    @property(cc.Label)
    labelLevel: cc.Label = null;
    @property(cc.RichText)
    descText: cc.RichText = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    public onShow(){
        this.node.position = cc.v2(0,-200);
        this.node.opacity = 0;
        var seq = cc.spawn(cc.moveTo(0.2,COMMON.ZERO).easing(cc.easeBackOut()),cc.fadeIn(0.2));
        this.node.runAction(seq);
    }
    public onClose(e){
        var seq = cc.sequence(
            cc.moveBy(0.3,cc.v2(0,500)).easing(cc.easeBackIn()),
            cc.callFunc(()=>{
                this.node.position = COMMON.ZERO;
                UI.closePopUp(this.node);
            })
        )
        this.node.runAction(seq)
    }
    onEnable(){
        super.onEnable();

        this.initView();
    }

    private initView(){
        var level = COMMON.userInfo.level;
        this.labelLevel.string = level.toString();
        var str = "英雄等级上限提升至：<color =#2DBE04>"+level+"级</c><br />"+
        "建筑等级上限提升至：<color =#2DBE04>"+level+"级</c><br />";
        if(level ==  CONSTANT.getRankShowLevel()){
            str += "解锁：<color =#2DBE04>排行榜</c>";
        }
        str = "<color=#D35C21>"+str +"</c>";
        this.descText.string = str;
    }
    // update (dt) {}
}
