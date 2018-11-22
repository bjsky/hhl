import UIBase from "../../component/UIBase";
import GuideInfo from "../../model/GuideInfo";
import TextAni from "../../component/TextAni";
import { EVENT } from "../../message/EventCenter";
import GameEvent from "../../message/GameEvent";
import { NET } from "../../net/core/NetController";
import MsgGuideUpdate from "../../net/msg/MsgGuideUpdate";
import { GUIDE, GuideNpcDir } from "../../module/guide/GuideManager";

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
export default class GuideTalkPanel extends UIBase {

    @property(cc.Node)
    npc: cc.Node = null;
    @property(cc.Node)
    npc2: cc.Node = null;
    @property(cc.Label)
    title: cc.Label = null;
    @property(cc.RichText)
    content: cc.RichText = null;


    private _talkTextAni:TextAni = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.opacity = 0;
        this._talkTextAni = this.content.getComponent(TextAni);
    }

    private _guideId:number =0;
    private _guideInfo:GuideInfo = null;

    //设置数据
    public setData(data){
    }

    start () {

    }

    public show(data){
        this._guideInfo = data;
        this._guideId = this._guideInfo.guideId;

        this.title.string = this._guideInfo.npc+"：";
        this.npc.active = (this._guideInfo.npcDic == GuideNpcDir.NpcDirLeft)?true:false;
        this.npc2.active = (this._guideInfo.npcDic == GuideNpcDir.NpcDirRight)?true:false;
        this.content.string = "";
        this.node.runAction(cc.sequence(cc.fadeIn(0.3),cc.callFunc(this.showComplete.bind(this))));
    }

    private showComplete(){
        this._talkTextAni.addTypewriterAni(this._guideInfo.content,this.complete.bind(this),"#FFFFFF");
    }

    private hide(cb:Function) {
        this.node.runAction(cc.sequence(cc.fadeOut(0.3),cc.callFunc(cb.bind(this))));
    }

    private complete(){
        EVENT.on(GameEvent.Guide_Mask_Touch,this.onMaskClick,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);
    }


    private onMaskClick(e) {
        this.node.off(cc.Node.EventType.TOUCH_START,this.onMaskClick,this);
        EVENT.off(GameEvent.Guide_Mask_Touch,this.onMaskClick,this);
        this.hide(()=>{
            GUIDE.nextGuide(this._guideId);
        });
    }

    // update (dt) {}
}
